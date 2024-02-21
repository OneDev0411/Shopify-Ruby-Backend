# coding: utf-8
# frozen_string_literal: true

# Shop's methods related to Shopify's tasks.
module Shopifable
  extend ActiveSupport::Concern
  include IcuModels::Webhooks

  # Public. Set the headers to use the Shopify's REST API.
  #
  # Return. Hashmap.
  def api_headers
    {
      'Content-type' => 'application/json',
      'X-Shopify-Access-Token' => shopify_token
    }
  end

  def api_version
    ShopifyApp.configuration.api_version
  end

  # Public. Gather values to encode a valid JWT.
  #
  # Return. Hashmap.
  def encode_new_jwt
    JWT.encode(build_jwt_values, ShopifyApp.configuration.secret, 'HS256')
  end

  # Public: General update setup: Install WHs, the ScriptTag and get orders.
  #
  # Returns boolean.
  def async_setup
    fetch_shopify_settings
    Sidekiq::Client.push('class' => 'ShopWorker::EnsureInCartUpsellWebhooksJob', 'args' => [id], 'queue' => 'default', 'at' => Time.now.to_i)
    Sidekiq::Client.push('class' => 'ShopWorker::CreateScriptTagJob', 'args' => [id], 'queue' => 'default', 'at' => Time.now.to_i)
    Sidekiq::Client.push('class' => 'ShopWorker::FetchOrdersJob', 'args' => [id], 'queue' => 'default', 'at' => Time.now.to_i)
  end

  # Public: Updates our DB shop data with the Shopify's info.
  #
  # Returns boolean.
  def fetch_shopify_settings
    activate_session
    shop = ShopifyAPI::Shop.all[0]
    self.name = shop.name
    self.shopify_id = shop.id
    self.email = shop.email
    self.timezone = shop.timezone
    self.iana_timezone = shop.iana_timezone
    self.money_format = shop.money_format
    self.currency = shop.currency
    self.phone_number = shop.phone if shop.phone.present?
    if self.shopify_plan_name != shop.plan_display_name
      ShopEvent.create(shop_id: id, title: 'Shopify Plan Changed',
                       body: "From #{shopify_plan_name} (#{shopify_plan_internal_name}) to #{shop.plan_display_name} (#{shop.plan_name})",
                       revenue_impact: 0)
    end
    self.shopify_plan_name = shop.plan_display_name
    self.shopify_plan_internal_name = shop.plan_name
    self.enabled_presentment_currencies = shop.enabled_presentment_currencies
    self.default_presentment_currency = shop.currency
    self.custom_domain = shop.domain  # Our offers only work on this domain btw
    self.opened_at = shop.created_at

    save
  end

  # Public. Calculate a prorated usage charge based on what portion of the month
  # the store spent at each Shopify plan level
  # Return Boolean.
  def calculate_usage_charge(start_at = nil, end_at = nil)
    activate_session
    current_plan = ShopifyAPI::Shop.all[0].plan_display_name
    log = []
    # Last event should be a transition to current plan
    events = shop_events_by_title_and_dates
    if events.empty?
      log << {
        plan: current_plan,
        start_at: start_at,
        end_at: end_at,
        duration: 1.0
      }
    else
      regex = Regexp.new('From +([\w ]*) \(\w*\) to ([\w ]+) \(\w+\)')

      events.each do |evt|
        # transition is an array with this data: [FROM_PLAN, TO_PLAN, TIMESTAMP]
        transition = regex.match(evt.body)
        # Populate the start state from the FROM field of the first transition
        log << { plan: transition[1], start_at: start_at } if log.empty?
        log << { plan: transition[2], start_at: evt.created_at }
      end
    end
    log
  end

  def fetch_active_shopify_theme
    activate_session
    shopify_theme = ShopifyAPI::Theme.all.map{|t| t if t.role == 'main'}.compact.first
    if shopify_theme.nil?
      raise 'Could not find active Shopify Theme via API'
    else
      if shopify_theme.name != shopify_theme_name
        ShopEvent.create(shop_id: id, title: "Theme Changed", body: "From #{shopify_theme_name} to #{shopify_theme.name}", revenue_impact: 0)
        self.shopify_theme_name = shopify_theme.name
        save
      end
    end
    shopify_theme_name
  end

  # Public. Checks to see if the app has presets (ie. Cart DOM location, colors, cart types, etc.)
  # for currently active theme
  # This doesn't do anything clever like partially matching
  # Return String.
  def presets_for_theme
    return 'none' if shopify_theme_name.blank?
    t = Theme.find_by('lower(name) = ?', shopify_theme_name.downcase)
    if t.nil?
      'none'
    elsif t.active?
      'yes'
    else
      'inactive'
    end
  end

  # Public. Like the above, sets up app using presets, if presets are available
  def fetch_colors_for_active_theme
    activate_session
    shopify_theme = ShopifyAPI::Theme.all.map{|t| t if t.role == 'main'}.compact.first
    if shopify_theme.nil?
      return {result: false, message: 'Could not find active Shopify Theme' }
    else
      if shopify_theme.name != shopify_theme_name
        self.shopify_theme_name = shopify_theme.name
      end
      local_theme = Theme.find_by('lower(name) = ?', shopify_theme.name.downcase)
      if local_theme.blank?
        save
        return {result: false, message: "No local settings for #{shopify_theme.name.downcase}" }
      end
      settings_data = JSON.parse(ShopifyAPI::Asset.all(theme_id: shopify_theme.id, asset: {"key" => local_theme.settings_asset_file}).first.value)
      current_settings = if settings_data['current'].is_a?(Hash)
        settings_data['current']
      else
        settings_data['presets'][settings_data['current']]
      end
      active_cart_type = if local_theme.cart_type_path.blank? || local_theme.cart_types.count == 1
        local_theme.cart_types.first
      else
        local_theme.cart_types.find_by(name: current_settings[local_theme.cart_type_path])
      end
      theme_background_color = current_settings[active_cart_type.background_color_path]
      background_color = if active_cart_type.background_color_path == 'inherit'
                           'inherit'
                         elsif Hex::Colors.light?(theme_background_color)
                           Hex::Colors.darken(theme_background_color)
                         else
                           Hex::Colors.lighten(theme_background_color)
                         end
      self.custom_bg_color = background_color
      self.custom_text_color = active_cart_type.text_color_path == 'inherit' ? 'inherit' : current_settings[active_cart_type.text_color_path] || '#2B3D51'
      self.custom_button_bg_color = active_cart_type.button_background_color_path == 'inherit' ? 'inherit' : current_settings[active_cart_type.button_background_color_path] || '#2B3D51'
      self.custom_button_text_color = active_cart_type.button_text_color_path == 'inherit' ? 'inherit' : current_settings[active_cart_type.button_text_color_path] || '#ffffff'
      self.uses_ajax_cart =  active_cart_type.ajax
      self.ajax_refresh_code = active_cart_type.refresh_code
      self.offer_css = "#{local_theme.css} #{active_cart_type.css}"
      if active_cart_type.ajax
        page_cart_type = local_theme.cart_types.find_by(name: 'page')
        self.custom_cart_page_dom_selector = page_cart_type.cart_page_dom_selector
        self.custom_cart_page_dom_action = page_cart_type.cart_page_dom_action
        self.custom_ajax_dom_selector = active_cart_type.cart_page_dom_selector
        self.custom_ajax_dom_action = active_cart_type.cart_page_dom_action
      else
        self.custom_cart_page_dom_selector = active_cart_type.cart_page_dom_selector
        self.custom_cart_page_dom_action = active_cart_type.cart_page_dom_action
      end
      self.defaults_set_at = Time.now
      self.defaults_set_for = "#{shopify_theme_name} (#{active_cart_type.name})"
      self.defaults_set_result = "Success"
      Setup.create({shop_id: id, details: {
        shopify_theme_name: shopify_theme.name,
        cart_type: active_cart_type.name,
        setup_via: "fetch_colors_for_active_theme" }
      })
      if save
        return { result: true, message: "Set colors and location for #{self.defaults_set_for} successfully"}
      else
        return { result: false, message: "Could not save: #{self.errors.full_messages.first}" }
      end
    end
  end

  def fetch_theme_names
    activate_session
    begin
      themes = ShopifyAPI::Theme.all
    rescue Exception => e
      Rollbar.info("Could not fetch theme for #{shopify_domain}", e)
      themes = []
    end
    themes.each do |t|
      if t.role == 'main'
        self.shopify_theme_name = t.name
      elsif t.role == 'mobile'
        self.shopify_mobile_theme_name = t.name
      end
    end
    save
  end

  # Public. Open a Ruby shopify API session.
  #
  # Return. Boolean.
  def activate_session
    begin
      raise "ShopifyToken Not Present for shop: ##{id}, #{shopify_domain}" if shopify_token.nil?

      session = ShopifyAPI::Auth::Session.new(shop: shopify_domain, access_token: shopify_token)
      ShopifyAPI::Context.activate_session(session)
      return session
    rescue => e
      Rails.logger.debug "Error Message: #{e.message}"
      Rollbar.error("Error", e)
      return false
    end
  end

  def delete_webhooks
    session = activate_session
    delete_event_bridge_webhooks(session)
  end

  # Public. Be sure all the WH are installed
  #
  # Return Array.
  def ensure_incartupsell_webhooks
    session = activate_session
    publish_event_bridge_webhooks(session)
  end

  def shopify_graphql_product_search(query)
    if query.empty?
      graphql = %{ { products(first: 20, query:"#{query}") { edges { node { id title featuredImage { transformedSrc(maxHeight: 50, maxWidth: 50) }  } } } } }
    else
      graphql = %{ { products(first: 20, query:"title:*#{query}*") { edges { node { id title featuredImage { transformedSrc(maxHeight: 50, maxWidth: 50) }  } } } } }
    end
    res = HTTParty.post(graphql_url, headers: api_headers, body: { query: graphql, variables: ''}.to_json)
    res&.parsed_response.dig('data', 'products', 'edges')&.map { |prod|
      {
        id: prod['node']['id'].gsub("gid://shopify/Product/","").to_i,
        title: prod.dig("node", "title"),
        image: prod.dig("node", "featuredImage", "transformedSrc"),
        variants: []
        # variants: prod['node']['variants']['edges'].map { |variant|
        #   {
        #     id: variant['node']['id'].gsub("gid://shopify/ProductVariant/","").to_i,
        #     title: variant.get('node.title'),
        #     price: variant.get('node.price'),
        #     image: variant.get('node.image.originalSrc')
        #   }
        # }
      }
    }
  end

  def shopify_graphql_collection_search(query)
    graphql = %{ { collections(first: 20, query: "#{query}") { edges { node { id title } } } } }
    res = HTTParty.post(graphql_url, headers: api_headers, body: { query: graphql, variables: ''}.to_json)
    res.parsed_response['data']['collections']['edges'].map do |coll|
      {
        id: coll['node']['id'].delete_prefix('gid://shopify/Collection/').to_i,
        title: coll['node']['title']
      }
    end
  end

  # Public. When a shop installs our app, get their historical orders for the Autopilot.
  #
  # Return. Boolean.
  def fetch_shopify_orders(limit = 250)
    next_link_uri = "https://#{shopify_domain}/admin/api/#{api_version}/orders.json?limit=#{limit}&status=any&financial_status=paid"
    while next_link_uri.present?
      res = HTTParty.get(next_link_uri, headers: api_headers)
      orders = process_json_orders(res)
      save_orders(orders)
      next_link_uri = next_link_avaliable(res.headers)

      sleep 0.5 if next_link_uri.present?
    end
    update fetched_shopify_orders_at: Time.now.utc
  end

  def fetch_shopify_product_new(shopify_product_id)
    activate_session
    product = Product.find_or_create_by(shop_id: id, shopify_id: shopify_product_id)
    product.update_from_shopify_new
  end

  # Public: Update data for the topsellers products.
  #
  # array  - shopify_product_ids = topsellers
  #
  # Returns boolean.
  def batch_fetch_shopify_products(shopify_product_ids)
    return if shopify_product_ids.blank?

    activate_session
    number_of_pages = shopify_product_ids.count.to_f / 250
    (0..number_of_pages).each do |page|
      start_idx = page * 250
      end_idx = start_idx + 249
      if end_idx >= shopify_product_ids.count
        end_idx = -1
      end
      ids_to_fetch = shopify_product_ids[start_idx .. end_idx].join(',')

      begin
        remote_products = ShopifyAPI::Product.all(ids: ids_to_fetch, limit: 250)
      rescue ActiveResource::UnauthorizedAccess => e
        activate_session
        remote_products = ShopifyAPI::Product.all(ids: ids_to_fetch, limit: 250)
      end

      remote_products.each do |r|
        p = Product.find_or_create_by(shop_id: id, shopify_id: r.id)
        p.apply_new_data(JSON.parse(r.original_state.to_json))
        p.last_synced_at = Time.now.utc
        p.sync_state = 'success'
        p.save
      end
    end
  end

  def regenerate_top_sellers
    a = orders.select(:product_shopify_ids).map(&:product_shopify_ids).flatten
    b = Hash.new(0)
    a.each do |v|
      b[v] += 1
    end
    self.top_sellers = b.sort_by{|k,v| v }.reverse[0 .. 49].map{|i| i[0].to_i }
    self.top_sellers_updated_at = Time.now.utc
    save
  end

  def set_companion_products_for_bestsellers
    regenerate_top_sellers
    batch_fetch_shopify_products(top_sellers) # update data on each product
    use_weighted_autopilot = has_weighted_autopilot?
    products.where(shopify_id: top_sellers).map{|p| p.set_most_popular_companions(use_weighted_autopilot) }
  end

  def enable_autopilot_status
    if offers.map(&:offerable_type).member?('auto')
      'complete'
    elsif pending_jobs.map(&:description).member?('enableautopilot')
      'in progress'
    else
      'not started'
    end
  end

  # Public. Pass the work to sidekiq and save a PendingJob.
  #
  # Return. AR Object.
  def async_enable_autopilot
    j = Sidekiq::Client.push('class' => 'ShopWorker::EnableAutopilotJob', 'args' => [id], 'queue' => 'autopilot', 'at' => Time.now.to_i)
    PendingJob.create(shop_id: self.id, sidekiq_id: j, description: 'enableautopilot')
  end

  def async_refresh_sales_intelligence
    self.companions_status = 'pending'
    j = Sidekiq::Client.push('class' => 'ShopWorker::RefreshSalesIntelligenceJob', 'args' => [id], 'queue' => 'default', 'at' => Time.now.to_i)
    PendingJob.create(shop_id: id, sidekiq_id: j, description: 'refreshsalesintel')
  end

  # Public. Find all orders with more than one product and fetch the details of those products
  #
  # opts - Hashmap
  #
  # Return Boolean.
  def fetch_data_on_companions(opts = {})
    self.companions_status = 'in progress'
    save
    use_weighted_autopilot = has_weighted_autopilot?
    if opts[:since]
      product_ids = orders.where('created_at > ?', opts[:since]).where("((jsonb_array_length(unique_product_ids) > 1 AND NOT unique_product_ids @> '0') OR jsonb_array_length(unique_product_ids) > 2)").select(:unique_product_ids).map(&:unique_product_ids).flatten.uniq
    else
      product_ids = orders.where("((jsonb_array_length(unique_product_ids) > 1 AND NOT unique_product_ids @> '0') OR jsonb_array_length(unique_product_ids) > 2)").select(:unique_product_ids).map(&:unique_product_ids).flatten.uniq
    end
    puts "fetching #{product_ids.count} products"
    batch_fetch_shopify_products(product_ids)
    puts "fetching #{product_ids.count} products companions"
    if opts[:since]
      products.where(shopify_id: product_ids).where('most_popular_companions_updated_at is null OR most_popular_companions_updated_at < ?', opts[:since]).map{|p| p.set_most_popular_companions(use_weighted_autopilot) }
    else
      products.where(shopify_id: product_ids).map{|p| p.set_most_popular_companions(use_weighted_autopilot) }
    end
    self.companions_status = 'complete'
    self.companions_status_updated_at = Time.now.utc
    save
  end

  # Public. Refresh all the inventory
  def async_check_offerable_inventory
    j = Sidekiq::Client.push('class' => 'ShopWorker::CheckOfferableStatusJob', 'args' => [id], 'queue' => 'default', 'at' => Time.now.to_i)
    PendingJob.create(shop_id: id, sidekiq_id: j, description: 'inventorysync')
  end

  # Public. Sync shopify data with our DB.
  def check_offerable_inventory
    start_at = Time.now.utc
    sync     = SyncResult.new(shop_id: id)
    if offers.length.zero?
      sync.active_offers_count = 0
      sync.result_message = 'No offers.'
      sync.elapsed_time_seconds = (Time.now.utc - start_at).round(2)
      sync.save
      last_refreshed_at = Time.now.utc
      last_refresh_result = sync.result_message
      save
      return sync
    else
      sync.active_offers_count = offers.count
      sync.active_offer_ids = offers.map(&:id)
    end

    sync.offerable_products = []
    sync.offerable_collections = []
    sync.rule_products = []
    sync.rule_collections = []

    sync.updated_collections = []
    sync.updated_products = []
    sync.missing_collections = []
    sync.missing_products = []

    item_errors = []
    if offers.where(offerable_type: 'auto').count.positive?
      set_companion_products_for_bestsellers
      fetch_data_on_companions
      # This sets the offerable_product_shopify_ids field for AUTOPILOT
      offer = offers.where(offerable_type: 'auto').first
      offer.offerable_product_shopify_ids = (autopilot_companions.map{|c| [c[0], c[1].map(&:first)] }.flatten + autopilot_bestsellers).uniq

      offer.save
    end
    offers.each do |offer|
      if offer.offerable_shopify_id.blank? && (offer.offerable_type == 'product' || offer.offerable_type == 'collection')
        item_errors << "offer #{offer.id} offerable_shopify_id is blank"
      else
        if offer.offerable_type == "product"
          sync.offerable_products << offer.offerable_shopify_id
        elsif offer.offerable_type == 'multi' || offer.offerable_type == 'auto'
          sync.offerable_products += offer.offerable_product_shopify_ids
        else #offer.offerable_type == "collection"
          sync.offerable_collections << offer.offerable_shopify_id
        end
      end
      if offer.rules_json.present?
        offer.rules_json.each do |rule|
          if rule['item_type'] == 'collection'
            sync.rule_collections << (rule['item_id'] || rule['item_shopify_id'])
          elsif rule['item_type'] == 'product'
            sync.rule_products << (rule['item_id'] || rule['item_shopify_id'])
          end
        end
      end
    end

    if item_errors.present?
      sync.result_message = "Unable to refresh: #{item_errors.join(', ')}"
      sync.elapsed_time_seconds = (Time.now.utc - start_at).round(2)
      sync.save
      self.last_refreshed_at = Time.now.utc
      self.last_refresh_result = sync.result_message
      save

      return sync
    end

    begin
      activate_session
    rescue Exception => e
      sync.result_message = e.message
      sync.save
      self.last_refreshed_at = Time.now.utc
      self.last_refresh_result = sync.result_message
      save

      return sync
    end

    if sync.offerable_collections.uniq.count > 250
      Rollbar.error("Too many full collections - add pagination")
    end
    if sync.rule_collections.uniq.count > 250
      Rollbar.error("Too many partial collections - add pagination")
    end

    puts "  full fetching #{sync.offerable_collections.uniq.count} collections"
    sync.offerable_collections.uniq.each do |shopify_collection_id|
      cxn = Collection.find_or_create_by(shop_id: id, shopify_id: shopify_collection_id)
      begin
        changed = cxn.update_from_shopify_new
      rescue Exception => e
        sync.result_message = e.message
        sync.save
        self.last_refreshed_at = Time.now
        self.last_refresh_result = sync.result_message
        save
        return sync
      end
      if changed == 200
        sync.updated_collections << shopify_collection_id
      elsif changed == 404
        sync.missing_collections << shopify_collection_id
        # Pause this offer - the offerable is missing
        # offers.where(offerable_id: shopify_collection_id).where(offerable_type: "collection").deactivate
      end
      # add its collects to the "products to fetch" array
      sync.offerable_products += (cxn.collects_json || [])
      sleep(0.5)
    end
    puts "  partial fetching #{sync.rule_collections.uniq.count} collections"
    sync.rule_collections.uniq.each do |shopify_collection_id|
      # if we didn't JUST check this collection, check it
      if !sync.offerable_collections.member?(shopify_collection_id)
        # but don't fetch its products
        cxn = Collection.find_or_create_by(shop_id: id, shopify_id: shopify_collection_id)
        changed = cxn.update_from_shopify_new
        if changed == 200
          sync.updated_collections << shopify_collection_id
        elsif changed == 404
          sync.missing_collections << shopify_collection_id
        end
      end
      sleep(0.5)
    end
    all_products_to_check = (sync.offerable_products + sync.rule_products).compact.uniq
    all_products_found = []
    puts "  fetching #{all_products_to_check.count} products all at once"
    page = 1
    number_of_pages = (all_products_to_check.count / 250.0).ceil
    remote_products = []
    while page <= number_of_pages
      segment_start = (page - 1) * 250
      product_ids = all_products_to_check.slice(segment_start, 250).join(',')
      headers = {'X-Shopify-Api-Features': 'include-presentment-prices', "X-Shopify-Access-Token": shopify_token}
      url = "https://#{shopify_domain}/admin/api/#{ShopifyApp.configuration.api_version}/" \
            "products.json?ids=#{product_ids}&limit=250"
      remote_products = HTTParty.get(url, headers: headers).parsed_response['products']
      puts "  #{remote_products.length} products found"
      next unless remote_products.present?
      all_products_found += remote_products.map{|p| p['id']}
      remote_products.each do |s_product|
        l_product = Product.find_or_create_by(shop_id: id, shopify_id: s_product['id'])
        l_product.apply_new_data(s_product)
        if l_product.changed?
          sync.updated_products << s_product['id']
          l_product.save
        end
      end
      page += 1
    end
    if all_products_found.length != all_products_to_check.count
      puts "  #{all_products_to_check.count - all_products_found.length} products not found at shopify"
      absent = all_products_to_check - all_products_found
      sync.missing_products = absent

      products.where(shopify_id: all_products_found).update_all(published_status: 'present')
      offers.where(offerable_type: "product").where(offerable_shopify_id: all_products_found)
        .update_all({offerable_stock_status: "present", offerable_stock_status_updated_at: Time.now.utc })
      products.where(shopify_id: absent).update_all(published_status: "absent")
      offers.where(offerable_type: "product").where(offerable_shopify_id: absent)
        .update_all({offerable_stock_status: "absent", offerable_stock_status_updated_at: Time.now.utc })
    else
      products.where(shopify_id: all_products_to_check).update_all(published_status: "present")
      offers.where(offerable_type: "product").where(offerable_shopify_id: all_products_to_check)
        .update_all({offerable_stock_status: "present", offerable_stock_status_updated_at: Time.now.utc })
    end

    checked_products_count = (sync.offerable_products + sync.rule_products).uniq.count
    checked_collections_count = (sync.offerable_collections + sync.rule_collections).uniq.count
    if sync.updated_products.count.positive? || sync.updated_collections.count.positive?
      if force_purge_cache
        sync.republished = true
        sync.republish_result_code = 200
        sync.republish_message = "#{sync.updated_products.count} of #{checked_products_count} products and #{sync.updated_collections.count} of #{checked_collections_count} collections updated."
        sync.result_message = "Republished Successfully"
      else
        sync.republish_result_code = 400
        sync.republish_message = "Could Not Republish JS Tag"
        sync.result_message = "Republish Error"
      end
    else
      sync.result_message = "No products or collections changed."
      sync.republish_message = "Checked #{checked_products_count} products and #{checked_collections_count} collections. None changed."
      sync.republished = false
    end
    sync.elapsed_time_seconds = (Time.now.utc - start_at).round(2)
    sync.save
    self.last_refreshed_at = Time.now.utc
    self.last_refresh_result = sync.result_message
    save
    sync
  end

  # Public: Adds the published JS to store through the Shopify's API.
  #
  # opts  - Options hash.
  #
  # Returns boolean.
  def create_script_tag(opts = {})
    publish_to_stackpath
    expire_from_stackpath
    delete_script_tag_on_store
    session = activate_session
    tag_updated = false

    begin
      res = ShopifyAPI::ScriptTag.new(session: session)
      res.event = 'onload'
      res.src = calculated_js_src
      res.save!
      if res
        update_column :script_tag_id, res.id
        tag_updated = true
      end
    rescue StandardError => error
      Rollbar.error('Error while creating script tag', error)
      Rails.logger.info("Enqueuing to ShopWorker::CreateScriptTagJob for shop # #{self.id} : #{self.shopify_domain}")
      Sidekiq::Client.push('class' => 'ShopWorker::CreateScriptTagJob', 'args' => [self.id], 'queue' => 'default', 'at' => Time.now.to_i)
    end
   
    update_column(soft_purge_only, opts[:soft_purge_only]) if opts[:soft_purge_only]
    tag_updated
  end

  def delete_script_tag_on_store
    activate_session
    ShopifyAPI::ScriptTag.all.each do |s|
      ShopifyAPI::ScriptTag.delete(id: s.id)
    end
  end

  # Public: check if our JS file is already in the current theme.
  #
  # Returns boolean.
  def tag_present_in_theme?
    begin
      res = HTTParty.get("https://#{canonical_domain}")
      res.include?(s3_filename)
    rescue
      false
    end
  end

  def tags_in_theme
    begin
      res = HTTParty.get("https://#{canonical_domain}")
      page = Nokogiri.parse(res.body)
      page.search('script[src*=incartupsell]')
    rescue
      []
    end
  end

  def check_shopify_token(token)
    if token && (token != shopify_token)
      update_column :shopify_token, token
    end
  end

  # Private. before_create :set_up_for_shopify
  #
  # Return AR object.
  def set_up_for_shopify
    self.is_shop_active = true
    self.finder_token = SecureRandom.hex(10) if self.finder_token.blank?
    self.access_scopes = ShopifyApp.configuration.scope
    if uninstalled_at.present? && installed_at.present? && installed_at < uninstalled_at
      self.installed_at = Time.now.utc
    end
    self.uninstalled_at = nil
  end

  #Called to get name of the theme for the current shop
  def active_theme_for_dafault_template
    activate_session
    shopify_theme = ShopifyAPI::Theme.all.map{|t| t if t.role == 'main'}.compact.first
    if shopify_theme.nil?
      return {result: false, message: 'Could not find active Shopify Theme via API' }
    else
      if shopify_theme.name != shopify_theme_name
        self.shopify_theme_name = shopify_theme.name
        save
      end
    end
    return {result: true, message: shopify_theme_name }
  end

  private

  # Private. defines the webhooks used in the store.
  #
  # Returns Array.
  def shopify_webhook_topics
    %w[app/uninstalled orders/create shop/update products/create products/update
       collections/create collections/update products/delete]
  end

  # Private. Find changed pĺans events for the last month.
  #
  # Returns array with ActiveRecords or empty.
  def shop_events_by_title_and_dates
    start_at ||= 30.days.ago.beginning_of_day
    end_at ||= 1.day.ago.end_of_day
    ShopEvent.where(shop_id: id, title: 'Shopify Plan Changed')
             .where('created_at >= ? AND created_at <= ?', start_at, end_at)
             .order(:created_at)
  end

  # Private. Find "next" link using the Regex "capturing group" option.
  #
  # res_headers - Hashmap of HTTP headers.
  #
  # Return. String.
  def next_link_avaliable(res_headers)
    pre_link = res_headers['link']&.split('; ')
    link = pre_link&.last(2)
    return false if link.blank?

    pre_link = link.second.include?('rel="next"') ? link.first.scan(/<(.*)>/) : ['']
    pre_link.flatten&.first
  end

  # Private. Format JSON to Hashmap.
  #
  # res - Whole Hashmap of the HTTP response.
  #
  # Return. Array of hashmaps.
  def process_json_orders(res)
    shopify_orders = JSON.parse(res.body)['orders']
    return [] if shopify_orders.blank?

    shopify_orders.map do |shopify_order|
      pre_items = shopify_order['line_items']&.map { |l| l['product_id'] }
      items = pre_items.present? ? pre_items.compact.sort : []

      { id: shopify_order['id'],
        items: items,
        discount_code: shopify_order['discount_codes'].first&.dig('code'),
        shopper_country: shopify_order.dig('billing_address', 'country_code'),
        referring_site: shopify_order['referring_site'],
        orders_count: shopify_order.dig('customer', 'orders_count'),
        total_price: shopify_order['total_price'],
        cart_token: shopify_order['cart_token'] }
    end
  end

  # Private. Save batch of orders.
  #
  # orders - Array of Hashmaps.
  #
  # Return. Void.
  def save_orders(orders)
    orders.each do |order|
      loaded_order = Order.find_or_create_by(shop_id: id, shopify_id: order[:id])
      loaded_order.line_item_product_shopify_ids = order[:items]
      loaded_order.product_shopify_ids = order[:items]
      loaded_order.unique_product_ids = order[:items].uniq
      loaded_order.discount_code = order[:discount_code]
      loaded_order.shopper_country = order[:shopper_country]
      loaded_order.referring_site = order[:referring_site]
      loaded_order.orders_count = order[:orders_count]
      loaded_order.total = order[:total_price]
      loaded_order.cart_token = order[:cart_token]
      loaded_order.save
    end
  end

  # Private. builds GraphQL API route.
  #
  # Return String.
  def graphql_url
    "https://#{shopify_domain}/admin/api/#{ShopifyApp.configuration.api_version}/graphql.json"
  end

  # Private. Gather values to encode a valid JWT.
  #
  # Return. Hashmap.
  def build_jwt_values
    session = self.activate_session
    valid_for_minutes = 60
    iat = Time.now.to_i
    jti_raw = [ShopifyApp.configuration.secret, iat].join(':').to_s
    jti = Digest::MD5.hexdigest(jti_raw)
    exp = iat + (valid_for_minutes*60)
    { jti: jti,
      iss: shopify_domain,
      aud: ShopifyApp.configuration.api_key,
      dest: shopify_domain,
      iat: Time.now.to_i,
      nbf: iat,
      sid: session.id,
      sub: shopify_token,
      exp: exp }
  end

  def track_installation
    return if ENV['ENV']!="PRODUCTION"
    # to check if the app is being re-installed
    intercom = IntercomEventsTracker.new
    mixpanel = MixpanelEventsTracker.new

    shop = Shop.find_by(myshopify_domain: shopify_domain)

    intercom.install_event(self, 'install')

    if shop.present? && shop.id!=self.id
      mixpanel.track_shop_event(self, 'App re-installed')
    else
      mixpanel.add_user(self)
      mixpanel.track_shop_event(self, 'App installed')
    end
  end

  def track_uninstallation
    intercom = IntercomEventsTracker.new
    mixpanel = MixpanelEventsTracker.new
    intercom.uninstall_event(self)
    mixpanel.track_shop_event(self, 'App uninstalled')
  end

  ####  CLASS METHODS IN THE MIXIN #####

  class_methods do

    # This method will return shop acc to the shopify domain, it is receving through params.
    # Will return the shop if it finds through shopify_domain, otherwise if shop can be find through
    # myshopify_domain, means that user is re-installing the old shop, so we will enable the old shop,
    # and deletes the newly created shop.

    # While enabling the old shop, we are using access scopes of new shop and updating the coloum because
    # user can change them before re installing and can be caught through new shop that is created with that data.

    def fetch_shop(current_shopify_domain)
      icushop = Shop.find_by(shopify_domain: current_shopify_domain)
      old_shop = Shop.find_by(myshopify_domain: current_shopify_domain)
      if old_shop.present? && icushop&.id != old_shop.id
        old_shop.enable_reinstalled_shop(current_shopify_domain,
                                         icushop.shopify_token,
                                         icushop.access_scopes)
        icushop.destroy_completely
        return old_shop
      end
      icushop
    end

    def search_shops_by_criteria(search_type, search)
      shops_order = 'installed_at DESC NULLS LAST'
      if search_type.present? && search_type == 'recent'
        shops_recently_installed(search_type, shops_order)
      else
        if search.present?
          search_for(search).limit(10).order(shops_order)
        else
          limit(5).order(shops_order)
        end
      end
    end

    # Public Class. shops_recently_installed
    #
    # subscription_type - String.
    # shops_order - String.
    #
    # Return. Array of AR objects.
    def shops_recently_installed(subscription_type, shops_order='installed_at DESC')
      shops_time = Time.now.in_time_zone('US/Mountain').beginning_of_day
      icushops = where('installed_at > ?', shops_time).order(shops_order)

      case subscription_type
      when 'paid'
        paid_plan_ids = Plan.paid_plan_ids
        res = icushops.select { |s| paid_plan_ids.include?(s.subscription&.plan_id) }
        icushops = res.compact
      when 'cancellations'
        icushops = where('uninstalled_at > ?', 24.hours.ago).order(shops_order)
      end
      icushops
    end

    # Search using different criteria
    def search_for(str)
      str.strip!
      where('name ilike ? OR shopify_domain ilike ? OR email ilike ? OR custom_domain ilike ? OR finder_token=? OR id=?', "%#{str}%", "%#{str}%", "%#{str}%", "%#{str}%", str, str.to_i)
    end
  end
end
