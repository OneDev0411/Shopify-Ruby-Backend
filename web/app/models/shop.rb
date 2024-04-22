# frozen_string_literal: true

class Shop < ApplicationRecord
  include ShopifyApp::ShopSessionStorageWithScopes

  has_one :subscription
  has_one :plan, through: :subscription
  has_one :customer
  has_one :customer_by_shopify_domain, primary_key: 'shopify_domain', class_name: 'Customer', foreign_key: 'shopify_domain'
  has_one :theme_app_extension
  has_many :offers
  has_many :orders
  has_many :daily_stats, -> (shop) { where("created_at > \'#{ shop.stats_from || Time.parse('2000-01-01')}\'") }
  has_many :products
  has_many :setups, dependent: :destroy
  has_many :pending_jobs, dependent: :destroy
  has_many :sync_results
  has_many :shop_events, dependent: :destroy
  has_many :shop_action, dependent: :destroy

  before_create :set_up_for_shopify
  after_create :shop_selection_and_setup

  include Shopifable
  include Graphable

  include ActionView::Helpers::DateHelper
  include ShopWorker

  def shop_selection_and_setup
    puts "After Create"
    
    # Fetch all shops matching either shopify_domain or myshopify_domain
    matching_shops = Shop.where("shopify_domain = :domain OR myshopify_domain = :domain", domain: self.shopify_domain).order(created_at: :desc)
    shops = matching_shops.select { |shop| shop.shopify_domain == self.shopify_domain }
    puts "Shop Count: #{shops.count}"
    
     # Separate the current shop and old shop based on the domains
    current_shop = shops.first
    puts "New shop found...." if current_shop

    old_shop = matching_shops.find { |shop| shop.myshopify_domain == self.shopify_domain }
    puts "Old shop found...." if old_shop

    # this is the case when 2 shops exists with the same shopify_domain so we are delelting the second shop
    # which is the newer/current shop and re enabling the previous/original one.
    if shops.count > 1
      current_shop = shops.second
      old_shop = shops.first
    end

    # This  will return shop acc to the shopify domain, it is receving through params.
    # Will return the shop if it finds through shopify_domain, otherwise if shop can be find through
    # myshopify_domain, means that user is re-installing the old shop, so we will enable the old shop,
    # and deletes the newly created shop.

    if shops.count > 1 || (old_shop.present? && !old_shop.id.eql?(current_shop&.id))
      puts 'Im IN...'
      token = current_shop.shopify_token
      scopes = current_shop.access_scopes
      puts 'Destroying Shop !!!'
      current_shop&.destroy_completely
      puts 'Re enabling old shop...'
      old_shop.enable_reinstalled_shop(self.shopify_domain, token, scopes)
      puts 'Shop Setup completed in re enable'
      return
    end
    self.update(is_shop_active: true)

    self.shop_setup
    puts 'Shop Setup completed on first install'
  end

  def shop_setup
    ShopAction.create(
      shop_id: self.id,
      action_timestamp: Time.now.utc.to_i,
      shopify_domain: self.shopify_domain,
      action: 'install',
      source: 'icu-redesign_shop_setup'
    )

    begin
      $redis_cache.del("shopify_uninstalled_#{self.myshopify_domain}")
    rescue => e
      Rails.logger.error "Redis Error, #{e.class}: #{e.message}"
    end

    async_setup
    signup_for_referral_program
    select_plan('trial_plan')
    track_installation
  end

  # This method is intended to delete shops that are forcefully being created and controlled by 
  # shopify app gem on re-install, We enable the the old shop and deletes the new one. 
  # Never use this method on un-install app.

  def destroy_completely
    subscription&.delete
    products&.delete_all
    offers&.delete_all
    shop_events&.delete_all
    shop_actions = ShopAction.where(shop_id: self.id)
    shop_actions.delete_all if shop_actions.any?
    pending_jobs&.delete_all
    theme_app_extension&.delete 
    begin
      destroy
      puts 'Shop Destroyed.'
    rescue => error

      # if due to any unknown error new shop decline to delete we will change it shopify domain so when
      # fetch shop on re installed is called, one shop with the shopify domain exists and can be returned
      # that will be the original/old one. We are changing domain for the new one.
      # Later on production we can see why these shops were not deleted due to any possible associaiton that
      # were not deleted above due to which this shop couldn't be destroyed.

      self.update_column(:shopify_domain, "#{self.shopify_domain}_deletable")
      puts "Shop couldn't be destroyed #{error}"
    end

  end

  def active_offers
    offers.active
  end

  def most_recent_setup
    setups.last || {}
  end


  def offerable_types
    if platform == 'shopify'
      [['Single Product', 'product'], ['All Items In Collection', 'collection']]
    else
      [['Single Product', 'product'], ['All Items In Category', 'collection']]
    end
  end

  # Public. Builds the "local" current time using the store time zone.
  #
  # Return. String.
  def timezone_offset
    Time.now.in_time_zone(iana_timezone).utc_offset
  end

  def total_winnings
    daily_stats.blank? ? 0.0 : daily_stats.sum(:click_revenue)
  end

  def has_custom_theme?
    custom_bg_color.present? ||
    custom_text_color.present? ||
    custom_button_bg_color.present? ||
    custom_button_text_color.present?
  end

  def custom_theme
    bg_color = if custom_bg_color.present?
      custom_bg_color.starts_with?('#') ? custom_bg_color : "##{custom_bg_color}"
    else
      '#ECF0F1'
    end
    text_color = if custom_text_color.present?
      custom_text_color.starts_with?('#') ? custom_text_color : "##{custom_text_color}"
    else
      '#ECF0F1'
    end
    button_bg_color = if custom_button_bg_color.present?
      custom_button_bg_color.starts_with?('#') ? custom_button_bg_color : "##{custom_button_bg_color}"
    else
      '#ECF0F1'
    end
    button_text_color = if custom_button_text_color.present?
      custom_button_text_color.starts_with?('#') ? custom_button_text_color : "##{custom_button_text_color}"
    else
      '#ECF0F1'
    end
    {
      bg_color: bg_color,
      text_color: text_color,
      button_bg_color: button_bg_color,
      button_text_color: button_text_color,
    }
  end

  def custom_theme_css
    ".nudge-offer.custom{ background-color: #{custom_theme[:bg_color]};" \
    "color: #{custom_theme[:text_color]}; } .nudge-offer.custom input.bttn," \
    ".nudge-offer.custom button.bttn{ background-color: #{custom_theme[:button_bg_color]};" \
    "color: #{custom_theme[:button_text_color]};}"
  end

  # Public. Gathers products and collections shopify's ids. Used to determine if an incoming
  #         'product/collection changed' webhook is one we care about - ie. if it is used in an offer
  # Return map.
  def offerable_products_and_collections
    product_ids    = []
    collection_ids = []
    offers.each do |offer|
      if offer.offerable_type == 'product'
        product_ids << offer.offerable_shopify_id
      elsif offer.offerable_type == 'multi' || offer.offerable_type == 'auto'
        product_ids += offer.offerable_product_shopify_ids
      else #offer.offerable_type == "collection"
        collection_ids << offer.offerable_shopify_id
      end
      (offer.rules_json || []).each do |rule|
        if rule['item_type'] == 'collection'
          collection_ids << (rule['item_shopify_id'] || rule['item_id'])
        elsif rule['item_type'] == 'product'
          product_ids << (rule['item_shopify_id'] || rule['item_id'])
        end
      end
    end
    { product_ids: product_ids.flatten.compact, collection_ids: collection_ids.flatten.compact }
  end

  # Public. Check the collection is in fact used by us.
  #
  # sid  - number. Shopify collection id.
  #
  # Return Boolean.
  def uses_collection_in_offer?(sid)
    offerable_products_and_collections[:collection_ids].member?(sid)
  end

  def uses_product_in_offer?(sid)
    offerable_products_and_collections[:product_ids].member?(sid)
  end

  def roi
    daily_stats.sum(:click_revenue)
  end

  def click_stats
    Rails.cache.fetch("shop/click_stats_#{id}", expires_in: 24.hours) do
      {
        revenue: roi,
        views: daily_stats.where('offer_id is not null').sum(:times_loaded),
        clicks: daily_stats.sum(:times_clicked)
      }
    end
  end

  def use_autocomplete?
    products.count > 20 && collections.count > 20
  end

  def uses_customer_tags?
    active_rules = offers.active.map(&:rules_json).flatten.compact
    active_rules.count { |e| e['rule_selector']&.include?('tagged') }&.positive?
  end

  def in_trial_period?
    self.subscription.days_remaining_in_trial.positive?
  end

  def next_bill_date
    Rails.logger.error('Should Not Call This')
    if subscription.present? && subscription.shopify_status.present?
      subscription.shopify_status.billing_on
    else
      nil
    end
  end

  def age_in_days_at_uninstall
    if uninstalled_at.blank?
      -1
    else
      ((uninstalled_at - (installed_at || created_at)) / 86400).floor
    end
  end

  # Public. Define CSS clases names
  # Returns Array.
  def classes
    classes = ['shop']
    if uninstalled_at.nil?
      classes << 'active'
    else
      classes << 'cancelled'
    end
    if uninstalled_at.nil? && subscription.try(:price_in_cents).present? && subscription.try(:price_in_cents) > 0
      classes << 'paying'
    end
    classes
  end

  def needs_expanded_drawer?
    shopify_theme_name.try(:downcase) == 'classic'
  end

  def canonical_domain
    custom_domain.present? ? custom_domain : shopify_domain
  end

  # Public. DOM element to anchor the offer on the popup drawer
  def ajax_dom_selector
    custom_ajax_dom_selector.present? ? custom_ajax_dom_selector :  ".ajaxcart__row:first"
  end

  # Public. Where to put offer relative to the ajax_dom_selector: 'prepend', 'append', 'after' or 'before'
  def ajax_dom_action
    custom_ajax_dom_action.present? ? custom_ajax_dom_action : 'prepend'
  end

  # Public. DOM element to anchor the offer on the cart page
  def cart_page_dom_selector
    custom_cart_page_dom_selector.present? ? custom_cart_page_dom_selector : "form[action^='/cart']"
  end

  # Public. Where to put offer relative to the cart_page_dom_selector: 'prepend', 'append', 'after' or 'before'
  def cart_page_dom_action
    custom_cart_page_dom_action.present? ? custom_cart_page_dom_action : 'prepend'
  end

  # Public. DOM element to anchor the offer on the product page
  def product_page_dom_selector
    custom_product_page_dom_selector.present? ? custom_product_page_dom_selector : "[class*='description']"
  end

  # Public. Where to put offer relative to the product_page_dom_selector: 'prepend', 'append', 'after' or 'before'
  def product_page_dom_action
    custom_product_page_dom_action.present? ? custom_product_page_dom_action : 'after'
  end

  # Checkout page is for now deprecated
  def checkout_dom_selector
    custom_checkout_dom_selector.present? ? custom_checkout_dom_selector : ".section--contact-information"
  end

  def checkout_dom_action
    custom_checkout_dom_action.present? ? custom_checkout_dom_action : "before"
  end

  def path_to_cart
    custom_cart_url.presence || '/cart'
  end

  def regex_safe_path_to_cart
    path_to_cart.gsub('/','\/')
  end

  def should_upgrade_to_starter?
    ((subscription.try(:price_in_cents) || 0) < 1200) && offers.count > 0
  end

  def should_upgrade_to_beginner?
    ((subscription.try(:price_in_cents) || 0) < 1200) && offers.count > 0
  end

  def should_upgrade_to_professional?
    ((subscription.try(:price_in_cents) || 0) > 1200) &&
    ((subscription.try(:price_in_cents) || 0) < 3900) && offers.count > 0
  end

  def should_upgrade_to_enterprise?
    false
    # shopify_plan_name.try(:downcase) == "shopify plus" && ((subscription.try(:price_in_cents) || 0) < 10000)
  end

  # to add a feature flag to a store:
  # s.feature_flags['flag_name'] = true
  # s.save
  def has_feature?(feature)
    (feature_flags || {})[feature] == true
  end

  def has_remove_offer
    if read_attribute(:has_remove_offer) == true
      true
    else
      plan.try(:has_remove_offers) || false
    end
  end

  def has_geo_offers
    if read_attribute(:has_geo_offers) == true
      true
    else
      plan.try(:has_geo_offers) || false
    end
  end

  def can_run_on_checkout_page
    if read_attribute(:can_run_on_checkout_page) == true
      true
    else
      plan.try(:has_offers_in_checkout) || false
    end
  end

  def ab_test_banner_page
    redis_key = "ab_test_banner_page"
    if $redis.hexists(redis_key, self.shopify_domain)
      page = $redis.hget(redis_key, self.shopify_domain)
    else
      pages = ["offer", "dashboard"]
      page = pages.sample
      $redis.hset(redis_key, self.shopify_domain, page)
    end

    page
  end

  def ab_test_banner_click
    ShopAction.create(
      shop_id: self.id,
      action_timestamp: Time.now.utc.to_i,
      shopify_domain: self.shopify_domain,
      action: 'click_on_ab_test_banner',
      source: "icu-redesign_click_on_ab_test_banner_#{self.ab_test_banner_page}"
    )
  end

  def has_autopilot?
    if read_attribute(:has_autopilot) == true
      true
    else
      plan.try(:has_autopilot) || false
    end
  end

  def has_default_colors?
    custom_bg_color == '#ECF0F1' && custom_text_color == '#2B3D51' &&
    custom_button_bg_color == '#2B3D51' && custom_button_text_color == '#ffffff'
  end

  # Public: Check if number of active offers are below plan's limit.
  #
  # Returns Boolean.
  def offers_limit_reached?
    plan.present? && plan.offers_limit <= active_offers.length
  end

  # Public. TRUE if the shop has the multi_offer feature AND does not have any product or collection offers
  def only_has_multi?
    has_multi? && (offers.map(&:offerable_type) & ['product','collection'] == [])
  end

  # Public. Set the Wizard's token and upload the changes
  def start_wizard
    self.wizard_token = Devise.friendly_token
    self.started_wizard_at = Time.now
    save
    reload
    force_purge_cache
  end

  # Public. Save data from the Wizard
  def save_wizard_from_api(data)
    Rails.logger.error data
    self.custom_bg_color = if data['custom_colors']['bg_color'].starts_with?('#') && data['custom_colors']['bg_color'].length > 2
      data['custom_colors']['bg_color']
    elsif data['custom_colors']['bg_color'].length > 2
      "##{data['custom_colors']['bg_color']}"
    end
    self.custom_button_bg_color = if data['custom_colors']['button_bg_color'].starts_with?('#') && data['custom_colors']['button_bg_color'].length > 2
      data['custom_colors']['button_bg_color']
    elsif data['custom_colors']['button_bg_color'].length > 2
      "##{data['custom_colors']['button_bg_color']}"
    end
    self.custom_text_color = if data['custom_colors']['text_color'].starts_with?('#') && data['custom_colors']['text_color'].length > 2
      data['custom_colors']['text_color']
    elsif data['custom_colors']['text_color'].length > 2
      "##{data['custom_colors']['text_color']}"
    end
    self.custom_button_text_color = if data['custom_colors']['button_text_color'].starts_with?('#') && data['custom_colors']['button_text_color'].length > 2
      data['custom_colors']['button_text_color']
    elsif data['custom_colors']['button_text_color'].length > 2
      "##{data['custom_colors']['button_text_color']}"
    end

    if data['css_classes']
      self.extra_css_classes = data['css_classes']['layout']
      self.extra_css_classes += ' space_below' if data['css_classes']['space_below']
      self.extra_css_classes += ' wider' if data['css_classes']['wider']
      self.extra_css_classes += ' big_image' if data['css_classes']['big_image']
    end
    self.uses_ajax_cart = data['ajax']
    if self.uses_ajax_cart
      self.custom_ajax_dom_selector = data['selector'].gsub('"',"'")
      self.custom_ajax_dom_action = data['position'].gsub('"',"'")
    else
      self.custom_cart_page_dom_selector = data['selector'].gsub('"',"'")
      self.custom_cart_page_dom_action = data['position'].gsub('"',"'")
    end
    self.wizard_completed_at = Time.now
    self.wizard_token = nil
    self.started_wizard_at = nil
    save
  end

  # Legacy - used by legacy new offer method
  def bestselling_product
    activate_session
    product = nil
    if top_sellers.present?
      product = products.find_by(shopify_id: top_sellers[0])
    end
    if product.nil?
      product = if products.empty?
        activate_session
        remote = ShopifyAPI::Product.all.first
        return nil if remote.nil?
        json = JSON.parse(remote.original_state.to_json)
        new_p = Product.create(shop_id: id, shopify_id: json['id'])
        new_p.update_with_data(json)
        new_p
      else
        products.first
      end
    end
    product
  end

  # Public. Duplicate some text an arbitrary number of times.
  #
  # Return. Array of Hashmap.
  def products_by_active_collection
    collection_shopify_ids = collections_shopify_ids_in_active_offers
    return [] if collection_shopify_ids.blank?

    current_collections = Collection.where(shopify_id: collection_shopify_ids)
    current_collections.map { |c| { collection_id: c.shopify_id, products: c.collects_json} }
  end

  def collections_shopify_ids_in_active_offers
    offers_with_rules = offers.active.filter{ |o| o.rules_json&.present? }
    coll_shopify_ids  = offers_with_rules.map(&:active_collections_shopify_ids)
    coll_shopify_ids.flatten.compact.uniq
  end

  def s3_filename
    letters = %w[a b c d e f g h i j]
    id_as_str = id.to_s.chars.map { |i| letters[i.to_i] }.join
    # TODO: switch the dash to a slash
    "#{id_as_str}-#{finder_token}.js"
  end

  def unpublish_all_offers
    offers.update_all({ active: false, published_at: nil })
    begin
      force_purge_cache
    rescue ActiveResource::UnauthorizedAccess => e
      ErrorNotifier.call(e)
      return e.message
    end
  end

  # Public. Upload our JS file.
  #
  # Return. Boolean.
  def publish_to_stackpath
    begin
      obj = STACKPATH_S3.bucket('incartupsell').object(s3_filename)
      obj.put(body: script_tag_body, content_type: 'application/javascript', acl: 'public-read')
      Rails.logger.debug "Published to Stackpath spaces:"
      Rails.logger.debug "https://incartupsell.s3.us-east-2.stackpathstorage.com/#{s3_filename}"
    rescue StandardError => e
      Rails.logger.debug "Error publishing object: #{e.message}"
      Rollbar.error("Error Publishing to Stackpach Object Storage", e)
      return false
    end
    true
  end

  def self.update_stackpath_token
    Rollbar.info 'Updating Stackpath Token'
    options = {
      headers: {'Content-Type' => 'application/json', 'accept' => 'application/json'},
      body: {
        client_id: ENV['STACKPATH_PUT_CLIENT_ID'],
        client_secret: ENV['STACKPATH_PUT_CLIENT_SECRET'],
        grant_type: 'client_credentials'
      }.to_json
    }
    sp_bearer = HTTParty.post("https://gateway.stackpath.com/identity/v1/oauth2/token", options)
    token = sp_bearer['access_token']
    $redis.set('STACKPATH_BEARER', token)
    token
  end

  # Public: flush the cache from the CDN.
  #
  # **args: :count, :wait
  #
  # Returns Hash.
  def expire_from_stackpath(**args)
    count = args[:count] || 0
    res = 'start'
    while res == 'start' || (res['code'] == 16 && count < 3)
      if res != 'start' && res['code'] == 16
        Shop.update_stackpath_token
      end
      token = $redis.get('STACKPATH_BEARER')
      query_headers = {
        'Content-Type' => 'application/json',
        'accept' => 'application/json',
        'Authorization' => "Bearer #{token}"
      }
      options = {
        headers: query_headers,
        body: {'items': [
          {url: "https://spcdn.incartupsell.com/#{s3_filename}", recursive: true},
          {url: "//q8d6j5r5.stackpathcdn.com/#{s3_filename}" },
          {url: "//q8d6j5r5.stackpathcdn.com/#{s3_filename}?shop=#{shopify_domain}"}]}.to_json
      }
      gw_url = "https://gateway.stackpath.com/cdn/v1/stacks/#{ENV['STACKPATH_STACK_ID']}/purge"
      res = HTTParty.post(gw_url, options)
      count += 1
    end
    if res['code'] == 16 || res.code != 200
      Rollbar.error("Could not expire from stackpath cache", res.parsed_response)
      return false
    end
    if args[:wait]
      unless soft_purge_only
        url = "https://#{shopify_domain}/admin/script_tags/#{script_tag_id}.json"
        opts = {
          'script_tag': {
            'id': script_tag_id,
            'src': calculated_js_src + "?c=#{Time.now.to_i}",
            'format': 'json'
          }
        }
        if shopify_token.present?
          HTTParty.put(url, body: opts.to_json, headers: api_headers)
        end
      end
      cdn_url = 'https://gateway.stackpath.com/cdn/v1/stacks/' \
                "#{ENV['STACKPATH_STACK_ID']}/purge/#{res['id']}"
      progress_query = HTTParty.get(cdn_url, headers: query_headers)
      cycle = 0;
      while (progress_query['progress'].nil? && cycle < 5) || progress_query['progress'] < 1
        Rails.logger.info "Checking progress: #{progress_query['progress']}"
        cycle += 1
        progress_query = HTTParty.get("https://gateway.stackpath.com/cdn/v1/stacks/#{ENV['STACKPATH_STACK_ID']}/purge/#{res['id']}", headers: query_headers)
        sleep(1)
      end
    end
    res
  rescue StandardError => e
    ErrorNotifier.call(e)
  end

  # Public. This deletes the shops JS tag, if they are using a shopify-injected tag.  Be careful
  #
  # Return Boolean.
  def disable_javascript(opts = {})
    delete_script_tag_on_store
    script_tag_id = nil
    soft_purge_only = true if opts[:soft_purge]
    save
  end

  def calculated_js_src
    "https://spcdn.incartupsell.com/#{s3_filename}"
  end

  # Public: republish our JS library on the background.
  #
  # Return boolean.
  def publish_async
    j = Sidekiq::Client.push('class' => 'ShopWorker::ForcePurgeCacheJob', 'args' => [id], 'queue' => 'shop', 'at' => Time.now.to_i)
    update_column(:publish_job, j)

    if ENV["PUBLISH_SCRIPT_VIA_API"]&.downcase == 'true'
      query_headers = {
        'Content-Type' => 'application/json',
        'accept' => 'application/json',
        'Authorization' => "Bearer #{ENV['ICU_INTER_SERVICES_AUTH_TOKEN']}"
      }
      options = {
        headers: query_headers,
        body: {}.to_json
      }
      legacy_base = ENV['DOMAIN_URL']
      legacy_api = "/internal/shops/#{id}/force_purge_cache"
      url = legacy_base + legacy_api
      begin
        res = HTTParty.post(url, options)
      rescue => e
        ErrorNotifier.call(e)
      end
    end
  end

  # Public: Upload JS file to stackpath.
  #
  # Returns Httparty::response object.
  def force_purge_cache
    if script_tag_id.blank? && !theme_app_extension&.theme_app_complete && ENV['ENABLE_THEME_APP_EXTENSION']&.downcase != 'true'
      puts "No script tag - creating"
      create_script_tag
    else
      publish_to_stackpath
      res = expire_from_stackpath(wait: true)
      update({ last_published_at: Time.now.utc })
      res
    end
  end

  def trailing_30_day_roi
    daily_stats.where('for_date >= ?', 1.month.ago).sum(:click_revenue)
  end

  def needs_new_token?
    needed = shopify_token.blank?
    begin
      session = activate_session
      client=ShopifyAPI::Clients::Graphql::Admin.new(session: session)
      ShopifyAPI::Webhooks::Registry.get_webhook_id(topic: "products/create", client: client)

    rescue ActiveResource::UnauthorizedAccess
      needed = true
    end
    needed
  end

  def active?
    activated &&
    uninstalled_at.blank? &&
    shopify_token.present? &&
    shopify_plan_name != 'cancelled' &&
    shopify_plan_name != 'frozen' &&
    shopify_plan_name != 'dormant' &&
    is_shop_active
  end

  # the customer has uninstalled the app
  def mark_as_cancelled
    begin
      unpublish_all_offers
      # This needs to go in a delayed job
      # Order.where(shop_id: self.id).delete_all
      update_columns(uninstalled_at: Time.now.utc, myshopify_domain: shopify_domain,
                     shopify_token: nil, shopify_domain: "#{shopify_domain}_OLD", access_scopes: 'uninstalled',
                     is_shop_active: false)

      if subscription.present?
        ShopEvent.create(shop_id: id, title: 'Cancelled', 
                         revenue_impact: (subscription.price_in_cents / 100.0 * -1))
        subscription.status = 'cancelled'
        subscription.save
        puts 'Cancelling Subscription...'
      end
      track_uninstallation
      remove_cache_keys_for_uninstalled_shop
      # Finally, delete from FirstPromoter as we don't want to pay commission against this shop anymore
      delete_from_referral_program
    rescue StandardError => e
      delete_from_referral_program
      ErrorNotifier.call(e)
    end
  end

  def enable_reinstalled_shop(s_domain, s_token, a_scopes)
    begin
      update_columns(shopify_domain: s_domain,
      myshopify_domain: nil,
      installed_at: Time.now.utc,
      uninstalled_at: nil,
      access_scopes: a_scopes,
      is_shop_active: true,
      shopify_token: s_token)
      
      if subscription.present?
        subscription.status = 'approved'
        subscription.shopify_charge_id = nil
        subscription.save
      end
    rescue => e
      ErrorNotifier.call(e)
    end
    shop_setup
    store_cache_keys_on_reinstall
  end


  def signup_for_referral_program
    # First Promoter is the referral platform that we are using for referral tracking purposes
    customer = customer_by_shopify_domain
	  if customer.present? && !customer.is_referral_tracked #&& plan.internal_name == "plan_based_billing"
      response_code, response_body = ReferralIntegrations::FirstPromoter.signup_referral(
        customer.shopify_domain,
        customer.referral_code
      )

      if response_code == 200
        customer.update(shopify_id: shopify_id, shop_id: id, is_referral_tracked: true)
        ShopEvent.create(
          shop_id: id,
          title: "Lead Generated in FirstPromoter",
          body: "Response: #{response_body}",
          revenue_impact: 0
        )
      end
    end
  end

  def delete_from_referral_program
    customer = customer_by_shopify_domain
    if customer.present? && customer.is_referral_tracked
      response_code, response_body = ReferralIntegrations::FirstPromoter.delete_referral(customer.shopify_domain)
      if response_code == 200
        ShopEvent.create(shop_id: id,
                          title: "Lead Deleted from FirstPromoter", 
                          body: "Response: #{response_body}", 
                          revenue_impact: (subscription.price_in_cents / 100.0 * -1))
      end
    end
  end

  def track_sale_to_referral_program(payment_id, amount_in_cents)
    customer = customer_by_shopify_domain
    if customer.present? && customer.is_referral_tracked
      response_code, response_body = ReferralIntegrations::FirstPromoter.track_sale(
        customer.shopify_domain,
        payment_id,
        amount_in_cents,
        referral_code: customer.referral_code
      )

      if response_code == 200
        ShopEvent.create(shop_id: id, title: "Tracked Sale in FirstPromoter", body: "Response: #{response_body}", revenue_impact: 0)
      end
    end
  end

  def defaults_set_for_theme
    (defaults_set_for || '').split(" (")[0]
  end

  def defaults_set_for_cart_type
    ((defaults_set_for || '').split(" (")[1] || "").gsub(/\)$/,'')
  end

  # Public. Creates an "Auto" offer, only one offer of this type by Store
  #
  # TODO. Moves this method to the Offer model
  def auto_offer
    if offers.where(offerable_type: 'auto').present?
      offers.where(offerable_type: 'auto').first
    else
      offer_opts = {
        shop_id: id,
        theme: 'custom',
        title: 'Autopilot',
        offer_text: 'Would you like to add this perfect companion product?',
        offer_cta: 'Add To Cart',
        show_product_image: true,
        multi_layout: 'stack',
        offerable_type: 'auto',
        offerable_product_shopify_ids: [12321]
      }
      offer = Offer.create(offer_opts)
      offer.offerable_product_shopify_ids = (autopilot_companions.map{|c| [c[0], c[1].map(&:first)] }.flatten + autopilot_bestsellers).uniq
      offer.save
      offer
    end
  end

  # Public. Used in the views/js/libray.js.erb file
  def autopilot_data
    {
      companions: autopilot_companions,
      bestsellers: autopilot_bestsellers
    }
  end

  def autopilot_companions
    excluded_product_shopify_ids = if auto_offer.excluded_tags.present?
                                     products.where("regexp_split_to_array(tags, E\', \') @> ARRAY[?]",
                                                    auto_offer.excluded_tags).select(:shopify_id).map(&:shopify_id)
                                   else
                                     [-1]
                                   end
    products.where("published_status = 'present' OR published_status is null").
             where('most_popular_companions is not null').where('orders_count > 2').
             where("shopify_id NOT IN (?)",excluded_product_shopify_ids).active.map{ |p|
      if p.most_popular_companions.present?
        filtered_companion_ids = products.where("published_status = 'present' OR published_status is null").
                                        where(shopify_id: p.most_popular_companions.map(&:first)).
                                        where("shopify_id NOT IN (?)",excluded_product_shopify_ids).
                                        map{|p| p.shopify_id if p.available_json_variants.present? }.compact
        filtered_companions = p.most_popular_companions.map{|c| c if filtered_companion_ids.member?(c[0]) }.compact
        [p.shopify_id, filtered_companions]
      end
    }.compact
  end

  def autopilot_bestsellers
    my_products = if auto_offer.excluded_tags.present?
      products.where("published_status = 'present' OR published_status is null").active.where("not regexp_split_to_array(tags, E\', \') @> ARRAY[?]", auto_offer.excluded_tags).order('orders_count DESC nulls last').limit(25)
    else
      products.where("published_status = 'present' OR published_status is null").active.order('orders_count DESC nulls last').limit(25)
    end
    my_products.map{|p| p if p.available_json_variants.present? }.compact.map(&:shopify_id)
  end

  def has_pro_features?
    plan_name = subscription.plan.internal_name
    plan_name.present? && (plan_name == "trial_plan" || plan_name == "plan_based_billing")
  end

  # Public. Gathers current shop data for the API response.
  #
  # admin - boolean.
  #
  # Return. Hashmap.
  def shop_settings(admin = false)
    std_settings = {
      custom_ajax_dom_selector: ajax_dom_selector,
      custom_ajax_dom_action: ajax_dom_action,
      custom_cart_page_dom_selector: cart_page_dom_selector,
      custom_cart_page_dom_action: cart_page_dom_action,
      custom_product_page_dom_selector: product_page_dom_selector,
      custom_product_page_dom_action: product_page_dom_action,
      ajax_refresh_code: ajax_refresh_code,
      activated: active?,
      canonical_domain: canonical_domain,
      can_run_on_checkout_page: can_run_on_checkout_page,
      custom_theme_css: custom_theme_css,
      shopify_domain: shopify_domain,
      currency_units: currency_units,
      offer_css: offer_css,
      path_to_cart: path_to_cart,
      show_spinner: show_spinner?,
      uses_ajax_refresh: uses_ajax_refresh?,
      uses_ajax_cart: uses_ajax_cart?,
      wizard_token: wizard_token,
      finder_token: finder_token,
      has_branding: subscription.try(:has_branding) || false,
      has_pro_features: has_pro_features?,
      css_options: css_options.present? ? css_options : { main: {}, button: {}, text: {} },
      custom_bg_color: custom_bg_color,
      custom_text_color: custom_text_color,
      custom_button_bg_color: custom_button_bg_color,
      custom_button_text_color: custom_button_text_color,
      tax_percentage: tax_percentage,
      money_format: money_format,
      stats_from: stats_date_for_UI,
      shop_id: id,
      default_template_settings: default_template_settings,
      has_redirect_to_product: has_redirect_to_product?,
      theme_version: theme_app_extension&.theme_version || '',
      offers_limit_reached: offers_limit_reached?,
      multi_layout: self.multi_layout
    }

    admin ? std_settings.merge(admin_settings) : std_settings
  end

  def stats_date_for_UI
    stats_from.present? ? stats_from.strftime('%Y-%m-%d') : '2000-01-01'
  end

  # Public. Duplicate some text an arbitrary number of times.
  #
  # opts - options.
  #
  # Return. Hashmap.
  def offer_settings(**opts)
    settings = {
      ajax_dom_selector: ajax_dom_selector,
      ajax_dom_action: ajax_dom_action,
      cart_page_dom_selector: cart_page_dom_selector,
      cart_page_dom_action: cart_page_dom_action,
      product_page_dom_selector: product_page_dom_selector,
      product_page_dom_action: product_page_dom_action,
      ajax_refresh_code: ajax_refresh_code,
      canonical_domain: canonical_domain,
      can_run_on_checkout_page: can_run_on_checkout_page,
      custom_theme_css: custom_theme_css,
      debug_mode: debug_mode,
      extra_css_classes: extra_css_classes,
      has_recharge: has_recharge,
      has_remove_offer: has_remove_offer,
      has_geo_offers: has_geo_offers,
      has_custom_rules: has_custom_rules,
      has_custom_layout: custom_theme_template.present?,
      has_custom_theme: !has_default_colors?,
      has_redirect_to_product: has_redirect_to_product?,
      shopify_domain: shopify_domain,
      shop_domain: shop_domain,
      currency_units: currency_units,
      offer_css: offer_css,
      css_options: css_options || { main: {}, button: {}, text: {} },
      path_to_cart: path_to_cart,
      platform: platform,
      uses_ajax_refresh: uses_ajax_refresh,
      uses_ajax_cart: uses_ajax_cart,
      wizard_token: wizard_token,
      finder_token: finder_token,
      has_branding: subscription.try(:has_branding) || false,
      has_shopify_multicurrency: enabled_presentment_currencies.present? && enabled_presentment_currencies.length > 0,
      default_presentment_currency: default_presentment_currency,
      admin: admin
    }
    if opts[:include_sample_products]
      settings[:sample_products] = products.where('title is not null').limit(5).map{|p| p.offerable_details.merge({offer_id: 1})}
    end
    if custom_theme_template.present?
      settings[:custom_theme_template] = custom_theme_template
    end
    settings
  end

  def combined_css
    if css_options.blank?
      offer_css
    else
      str = "";
      #dont need to do custom color scheme here, it is included somewhere else
      if(css_options['main']['borderWidth'].to_i > 0)
        str += ".nudge-offer{ border: #{css_options['main']['borderWidth']}px #{css_options['main']['borderStyle']} #{css_options['main']['borderColor']}; } "
      end
      if(css_options['main']['borderRadius'].to_i != 4)
        str += ".nudge-offer{ border-radius: #{css_options['main']['borderRadius']}px; } "
      end
      if(css_options['main']['marginTop'].to_i > 0)
        str += ".nudge-offer{ margin-top: #{css_options['main']['marginTop']}; } "
      end
      if(css_options['main']['marginBottom'].to_i > 0)
        str += ".nudge-offer{ margin-bottom: #{css_options['main']['marginBottom']}; } "
      end
      if(css_options['main']['borderWidth'].to_i > 0)
        str += ".nudge-offer{ border: #{css_options['main']['borderWidth']}px #{css_options['main']['borderStyle']} #{css_options['main']['borderColor']}; border-radius: #{css_options['main']['borderRadius']}px; } "
      end
      str += ".nudge-offer.multi form input.bttn, #nudge-offer.multi form button.bttn, #nudge-offer input.bttn, #nudge-offer button.bttn{ ";
      if(css_options['button']['borderRadius'].to_i != 4)
        str += "border-radius: #{css_options['button']['borderRadius']}px; ";
      end
      if(css_options['button']['fontWeight'].present? && css_options['button']['fontWeight'] != 'bold')
        str += "font-weight: #{css_options['button']['fontWeight']}; ";
      end
      if(css_options['button']['fontFamily'] != 'inherit' && css_options['button']['fontFamily'].present?)
        str += "font-family: #{css_options['button']['fontFamily']}; "
      end
      if(css_options['button']['textTransform'] != 'inherit' && css_options['button']['textTransform'].present?)
        str += "text-transform: #{css_options['button']['textTransform']}; "
      end
      if(css_options['button']['fontSize'] != 'inherit' && css_options['button']['fontSize'].present?)
        str += "font-size: #{css_options['button']['fontSize']}; "
      end
      if(css_options['button']['letterSpacing'] != 'inherit' && css_options['button']['letterSpacing'].present?)
        str += "letter-spacing: #{css_options['button']['letterSpacing']}; "
      end
      if (css_options['button']['width'] != 'auto' && css_options['button']['width'].present?)
        str += "width: #{css_options['button']['width']}; "
      end
      if (css_options['button']['marginTop'].present? && css_options['button']['marginTop'] != '0px')
        str += "margin-top: #{css_options['button']['marginTop']};"
      end
      if (css_options['button']['marginBottom'].present? && css_options['button']['marginBottom'] != '0px')
        str += "margin-bottom: #{css_options['button']['marginBottom']};"
      end
      if (css_options['button']['marginRight'].present? && css_options['button']['marginRight'] != '0px')
        str += "margin-right: #{css_options['button']['marginRight']};"
      end
      if (css_options['button']['marginLeft'].present? && css_options['button']['marginLeft'] != '0px')
        str += "margin-left: #{css_options['button']['marginLeft']};"
      end
      if (css_options['button']['paddingTop'].present? && css_options['button']['paddingTop'] != '6px')
        str += "padding-top: #{css_options['button']['paddingTop']};"
      end
      if (css_options['button']['paddingRight'].present? && css_options['button']['paddingRight'] != '6px')
        str += "padding-right: #{css_options['button']['paddingRight']};"
      end
      if (css_options['button']['paddingBottom'].present? && css_options['button']['paddingBottom'] != '6px')
        str += "padding-bottom: #{css_options['button']['paddingBottom']};"
      end
      if (css_options['button']['paddingLeft'].present? && css_options['button']['paddingLeft'] != '6px')
        str += "padding-left: #{css_options['button']['paddingLeft']};"
      end
      str += "} "
      str += ".nudge-offer .offer-text, #nudge-offer .product-title{ ";
      if (css_options['text']['fontWeight'] != 'bold')
        str += "font-weight: #{css_options['text']['fontWeight']}; ";
      end
      if (css_options['text']['fontFamily'] != 'inherit')
        str += "font-family: #{css_options['text']['fontFamily']}; ";
      end
      if (css_options['text']['fontSize'] != '16px')
        str += "font-size: #{css_options['text']['fontSize']}; "
      end
      str += "} "
      str += (css_options['custom'] || "")
      if offer_css.present? && (css_options['custom'].blank? || !css_options['custom'].include?(offer_css))
        str += (offer_css || "")
      end
      str
    end
  end

  # Public: required data to display debug Vue component.
  #
  # Returns hashmap.
  def debug_hash
    my_last_refresh = if last_refreshed_at.blank? || last_refresh_result.blank?
                        if sync_results.count.zero?
                          nil
                        else
                          sync_results.order('id DESC').first
                        end
                      end
    {
      shopify_token_present: shopify_token.present?,
      email: email,
      finder_token: finder_token,
      id: id,
      shopify_id: shopify_id,
      created_at: created_at,
      installed_at: installed_at,
      in_trial_period: in_trial_period?,
      app: app,
      shopify_domain: shopify_domain,
      s3_filename: s3_filename,
      soft_purge_only: soft_purge_only,
      js_version: js_version,
      notification_email: notification_email,
      opened_at: opened_at.present? ? distance_of_time_in_words_to_now(opened_at) : '',
      shopify_plan_name: shopify_plan_name,
      shopify_theme_name: shopify_theme_name,
      cart_type: cart_type,
      canonical_domain: canonical_domain,
      skip_inventory: skip_inventory,
      cdn: cdn,
      calculated_js_src: calculated_js_src,
      subscription_plan_name: subscription.try(:plan).try(:name) || 'NONE',
      subscription_dollar_price: subscription.present? ? subscription.revenue_cents / 100.0 : '?',
      defaults_set_at: defaults_set_at,
      defaults_set_for: defaults_set_for,
      presets_for_theme: presets_for_theme,
      has_branding: subscription.try(:has_branding) || false,
      pending_jobs: pending_jobs.map{|j| {readable_description: j.readable_description} }.uniq,
      last_refreshed_at: last_refreshed_at || my_last_refresh.try(:created_at),
      last_refresh_result: last_refresh_result || my_last_refresh.try(:result_message),
      subscription_id: subscription.try(:id),
      subscription_next_bill_date: subscription.try(:bill_on),
      subscription_status: subscription.try(:status),
      subscription_plan_id: subscription.try(:plan_id),
      subscription_created_at: subscription.try(:created_at),
      subscription_trial_ends_at: subscription.try(:trial_ends_at),
      subscription_discount_percent: subscription.try(:discount_percent)
    }
  end

  def config_hash
    {
      finder_token: finder_token,
      id: id,
      shopify_id: shopify_id,
      shopify_domain: shopify_domain,
      shop_domain: shop_domain,
      shopify_theme_name: shopify_theme_name,
      cart_type: cart_type,
      defaults_set_at: defaults_set_at,
      defaults_set_for: defaults_set_for,
      presets_for_theme: presets_for_theme,
      uses_ajax_cart: uses_ajax_cart,
      custom_bg_color: custom_bg_color,
      custom_text_color: custom_text_color,
      custom_button_bg_color: custom_button_bg_color,
      custom_button_text_color: custom_button_text_color,
      custom_cart_page_dom_selector: custom_cart_page_dom_selector,
      custom_cart_page_dom_action: custom_cart_page_dom_action,
      custom_product_page_dom_selector: custom_product_page_dom_selector,
      custom_product_page_dom_action: custom_product_page_dom_action,
      custom_ajax_dom_selector: custom_ajax_dom_selector,
      custom_ajax_dom_action: custom_ajax_dom_action,
      offer_css: offer_css,
      css_options: css_options,
      stats_from: stats_date_for_UI,
      wizard_token: wizard_token
    }
  end

  def self.destroy_with_products(shop_id)
    s = Shop.find(shop_id)
    s.products.each do |p|
      p.variants.destroy_all
    end
    s.daily_stats.destroy_all
    s.offers.destroy_all
    s.collections.each do |c|
      c.collects.destroy_all
      c.destroy
    end
    s.products.destroy_all
    s.subscription.try(:destroy)
    s.destroy
  end

  def self.active
    where(uninstalled_at: nil).where('shopify_token is not null').where("shopify_plan_name != 'frozen'").where("shopify_plan_name != 'dormant'").where("shopify_plan_name != 'cancelled'")
  end

  def self.inactive
    where('uninstalled_at is not null').where('shopify_token is null')
  end

  def api_version
    ShopifyApp.configuration.api_version
  end

  #Unpublish all offers except first when merchant switches to free plan
  def unpublish_extra_offers
    first_active_offer_id = self.unpublished_offer_ids? ? self.unpublished_offer_ids.last : self.offers.active.first&.id
    if first_active_offer_id.present?
      @offers = self.offers.where.not(id: first_active_offer_id)
      @offers.update({ published_at: nil, active: false })
      self.offers.find(first_active_offer_id).update({ published_at: Time.now.utc, deactivated_at: nil, active: true })
      self.update(unpublished_offer_ids: nil)
      self.publish_async
    end
  end

  #Unpublish active offers
  def unpublish_active_offers
    active_ids = offers.active.pluck(:id)
    self.offers.where(active: true).update_all({ published_at: nil, active: false })
    self.publish_async
    self.update(unpublished_offer_ids: active_ids)
  end

  def publish_offers
    self.offers.where(id: self.unpublished_offer_ids).update_all({ published_at: Time.now.utc, deactivated_at: nil, active: true })
    self.update(unpublished_offer_ids: nil)
  end

  def select_plan(plan_internal_name)
    plan = Plan.find_by(internal_name: plan_internal_name)
    old_shop = Shop.find_by(myshopify_domain: shopify_domain)
    if (old_shop.present? && old_shop.id!=self.id && old_shop.in_trial_period?) || !old_shop.present?
      subscription = self.subscription || Subscription.new
      subscription.plan = plan
      subscription.shop = self
      subscription.status = 'approved'
      subscription.update_subscription(plan)
      subscription.save
    end
    if !plan.nil? and plan.free_plan?
      self.unpublish_extra_offers if self.offers.present?
    end
    # subscription.update_attribute(:free_plan_after_trial, false)
  end

  def offer_data_with_stats
    data = []
    offers
      .select('offers.id, offers.shop_id, offers.title, offers.active, offers.total_clicks, offers.total_views, offers.total_revenue, offers.created_at, offers.offerable_type')
      .group('offers.id')
      .each do |offer|
        data << {
          id: offer.id,
          title: offer.title,
          status: offer.active,
          clicks: offer.total_clicks,
          views: offer.total_views,
          revenue: offer.total_revenue,
          created_at: offer.created_at.to_datetime,
          offerable_type: offer.offerable_type,
        }
    end
    return data
  end

  def offer_data_with_stats_by_period(period)
    start_date, end_date = period_hash_to_offers[period].values_at(:start_date, :end_date)

    # Define the CTE with the proper WITH clause
    combined_stats_cte = <<-SQL
      WITH combined_stats AS (
        SELECT
          d.offer_id,
          SUM(d.times_clicked) AS total_clicks,
          SUM(d.times_loaded) AS total_views,
          SUM(e.amount) FILTER (WHERE e.action = 'sale') AS total_revenue
        FROM
          daily_stats d
          LEFT JOIN offer_events e ON d.offer_id = e.offer_id AND e.created_at BETWEEN '#{start_date}' AND '#{end_date}'
        WHERE
          d.created_at BETWEEN '#{start_date}' AND '#{end_date}'
          AND d.shop_id = #{self.id} -- Assuming DailyStat has a shop_id column
        GROUP BY
          d.offer_id
      )
    SQL

    # Main query referencing the CTE
    query = <<-SQL
      #{combined_stats_cte}
      SELECT
        o.id, o.shop_id, o.title, o.active, o.created_at,
        COALESCE(cs.total_clicks, 0) AS total_clicks,
        COALESCE(cs.total_views, 0) AS total_views,
        COALESCE(cs.total_revenue, 0) AS total_revenue
      FROM
        offers o
        LEFT OUTER JOIN combined_stats cs ON cs.offer_id = o.id
      WHERE
        o.shop_id = #{self.id}
      ORDER BY
        total_revenue DESC
      LIMIT 3
    SQL

    # Execute the query
    data = ActiveRecord::Base.connection.execute(query).map do |offer|
      {
        id: offer['id'],
        title: offer['title'],
        status: offer['active'],
        clicks: offer['total_clicks'],
        views: offer['total_views'],
        revenue: offer['total_revenue'],
        created_at: offer['created_at']
      }
    end

    return data
  end

  def publish_or_delete_script_tag
    if (!self.theme_app_extension.theme_app_complete || self.theme_app_extension.theme_version != '2.0') && ENV['ENABLE_THEME_APP_EXTENSION']&.downcase != 'true'
      self.publish_async
    elsif !script_tag_id.nil?
      Sidekiq::Client.push('class' => 'ShopWorker::DisableJavaScriptJob', 'args' => [id], 'queue' => 'scripts', 'at' => Time.now.to_i)
    end
  end

  def proxy_offers
    offers = []

    self.offers.where(active: true).each do | offer |
      new_offer = {
        id: offer.id,
        rules: offer.rules_json,
        text_a:  (offer.offer_text || ''),
        text_b:  (offer.offer_text_alt || ''),
        cta_a:  offer.offer_cta,
        cta_b:  offer.offer_cta_alt,
        css: offer.offer_css,
        show_product_image: offer.show_product_image,
        product_image_size: offer.product_image_size || 'medium',
        link_to_product: offer.link_to_product,
        theme: offer.theme,
        shop: {
          path_to_cart: self.path_to_cart,
          extra_css_classes: self.extra_css_classes,
        },
        show_nothanks: offer.show_nothanks || false,
        calculated_image_url:  offer.calculated_image_url ,
        hide_variants_wrapper: offer.offerable_type == 'product' && offer.product.available_json_variants.count == 1,
        show_variant_price: offer.show_variant_price || false,
        uses_ab_test: offer.uses_ab_test?,
        ruleset_type: offer.ruleset_type,
        offerable_type:  offer.offerable_type,
        offerable_product_shopify_ids: offer.offerable_product_shopify_ids.compact,
        offerable_product_details: offer.offerable_product_details(true, true),
        checkout_after_accepted: offer.checkout_after_accepted || false,
        discount_code:  offer.discount_target_type == 'code' ? offer.discount_code : false,
        stop_showing_after_accepted: offer.stop_showing_after_accepted || false,
        products_to_remove: offer.product_ids_to_remove,
        show_powered_by: self.subscription.has_branding,
        show_spinner: self.show_spinner?,
        must_accept: offer.must_accept || false,
        show_quantity_selector: offer.show_quantity_selector || false,
        powered_by_text_color: offer.powered_by_text_color,
        powered_by_link_color: offer.powered_by_link_color,
        multi_layout: offer.multi_layout || 'compact',
        show_custom_field: offer.show_custom_field || false,
        custom_field_name: offer.custom_field_name,
        custom_field_placeholder: offer.custom_field_placeholder,
        custom_field_required: offer.custom_field_required || false,
        custom_field_2_name: offer.custom_field_2_name,
        custom_field_2_placeholder: offer.custom_field_2_placeholder,
        custom_field_2_required: offer.custom_field_2_required || false,
        custom_field_3_name: offer.custom_field_3_name,
        custom_field_3_placeholder: offer.custom_field_3_placeholder,
        custom_field_3_required: offer.custom_field_3_required || false,
        show_compare_at_price: offer.show_compare_at_price?,
        redirect_to_product: self.has_redirect_to_product? && offer.redirect_to_product?,
        show_product_price: offer.show_product_price?,
        show_product_title: offer.show_product_title?,
        in_cart_page:  offer.in_cart_page?,
        in_ajax_cart:  offer.in_ajax_cart?,
        in_product_page:  offer.in_product_page?,
        css_options:  offer.css_options || {},
        custom_css: offer.custom_css
      }

      if offer.winner.present?
        new_offer[:winning_version] = offer.winner
      end

      if offer.offerable_type == 'auto'
        new_offer[:autopilot_data] = self.autopilot_data
        new_offer[:autopilot_quantity] = offer.autopilot_quantity || 1
      end

      if self.has_recharge && offer.recharge_subscription_id.present?
        new_offer[:has_recharge]             = self.has_recharge && offer.recharge_subscription_id.present?
        new_offer[:interval_unit]            = offer.interval_unit
        new_offer[:interval_frequency]       = offer.interval_frequency.to_i
        new_offer[:recharge_subscription_id] = offer.recharge_subscription_id.to_i
      end

      if self.has_remove_offer
        new_offer[:remove_if_no_longer_valid] = offer.remove_if_no_longer_valid
      end

      offers << new_offer
    end

    offers
  end

  def proxy_shop_settings
    {
      ajax_refresh_code: self.ajax_refresh_code,
      canonical_domain: self.canonical_domain,
      has_recharge: self.has_recharge,
      has_remove_offer: self.has_remove_offer,
      has_geo_offers: self.has_geo_offers,
      uses_ajax_cart: self.uses_ajax_cart,
      has_shopify_multicurrency: self.enabled_presentment_currencies.present? && self.enabled_presentment_currencies.length > 0,
      show_spinner: self.show_spinner?,
      uses_customer_tags: self.uses_customer_tags? || false,
    }
  end

  private

  # Private. get the index.js file from webpack (dev) or rendered.
  #
  # Returns. String.
  def library_string
    if Rails.env.production?
      filename = 'public/packs/js/library/index-*\.js'
      a = File.read(Dir.glob(Rails.root.join(filename))[0])
      a.gsub(/\n\/\/# sourceMappingURL=index-.*\.js\.map/, '')
    else
      manifest_json = HTTParty.get('http://localhost:8080/packs/manifest.json', verify: false).parsed_response
      filename = manifest_json['library/index.js']
      Rails.logger.info "Fetching library from #{filename}"
      HTTParty.get("http://localhost:8080#{filename}", verify: false)
    end
  end

  # Private. Render and merge the index.js file with the views/js/library.js.erb file.
  #
  # Returns. String.
  def script_tag_body
    valid_offers = if self.activated?
      active_and_valid_offers
    else
      []
    end
    assigns = { library_string: library_string, icushop: self, offers: valid_offers }
    JsController.render('js/library', assigns: assigns)
  end

  # Private. Find active and valid offers.
  #
  # Return. Array.
  def active_and_valid_offers
    offers.active.map { |o| o if o.available_variants? }.compact
  end

  # Private. Values for the admin Shop's section.
  #
  # Return. Hashmap.
  def admin_settings
    {
      soft_purge_only: soft_purge_only,
      custom_theme_template: custom_theme_template,
      extra_css_classes: extra_css_classes,
      variant_price_format: variant_price_format,
      custom_cart_url: custom_cart_url,
      has_recharge: has_recharge,
      has_remove_offer: has_remove_offer,
      has_geo_offers: has_geo_offers,
      js_version: js_version,
      stat_provider: stat_provider,
      debug_mode: debug_mode,
      has_autopilot: has_autopilot,
      has_reviewed: has_reviewed,
      review: review,
      builder_version: builder_version,
      cdn: cdn,
      has_custom_rules: has_custom_rules,
      has_redirect_to_product: has_redirect_to_product
    }
  end

  # To make product specific keys for redis cache
  def shopify_products_ids_with_prefix
    products.pluck(Arel.sql("CONCAT('shopify_product_', products.shopify_id)"), 1)
  end

  # To make collection specific keys for redis cache
  def shopify_collections_ids_with_prefix
    Collection.where(collections: { shop_id: id }).pluck(Arel.sql("CONCAT('shopify_collection_', shopify_id)"), 1)
  end

  def shopify_products_and_collections_ids
    shopify_products_ids_with_prefix + shopify_collections_ids_with_prefix
  end

  def remove_cache_keys_for_uninstalled_shop
    ids = shopify_products_and_collections_ids

    begin
      $redis_cache.del(*ids) unless ids.blank?
    rescue => e
      Rails.logger.error "Redis Error, #{e.class}: #{e.message}"
    end
  end

  def store_cache_keys_on_reinstall
    ids = shopify_products_and_collections_ids
    begin
      $redis_cache.mset(*ids) unless ids.blank?
    rescue => e
      Rails.logger.error "Redis Error, #{e.class}: #{e.message}"
    end
  end
end
