# frozen_string_literal: true

# This is the most core part of the application.  An offer is a combination
# of a thing to be shown to the shopper, and conditions for when to display it.
# There are lots of options and offers are highly configurable.
class Offer < ApplicationRecord
  # require 'w3c_validators'
  # include W3CValidators
  include IcuModels::OfferStats

  belongs_to :shop
  belongs_to :product, optional: true
  has_many :offer_stats, inverse_of: :offer, dependent: :delete_all
  has_many :daily_stats, -> (offer) { where("created_at > \'#{ offer.shop.stats_from || Time.parse('2000-01-01')}\'").order(for_date: :asc) }, dependent: :destroy
  has_many :offer_events, dependent: :destroy
  has_one :placement_setting, dependent: :destroy
  accepts_nested_attributes_for :placement_setting
  has_one :advanced_placement_setting, dependent: :destroy
  accepts_nested_attributes_for :advanced_placement_setting

  after_save :populate_object_from_shopify

  after_create :assign_initial_position_order
  attr_accessor :offerable_name

  validate :offer_text_must_be_valid
  validate :offerable_must_be_present
  delegate :shopify_theme_name, to: :shop, prefix: true

  default_scope { order(position_order: :desc) }

  before_save do
    if offerable_type == 'auto' && offerable_product_shopify_ids.blank?
      self.offerable_product_shopify_ids = (shop.autopilot_companions.map { |c| [c[0], c[1].map(&:first)] }.flatten + shop.autopilot_bestsellers).uniq
    end
  end

  def shop_css
    shop.offer_css
  end

  def product_name
    offerable_title
  end

  def title_or_id
    title.presence || "# #{id}"
  end

  def uses_ab_test?
    offer_text_alt.present? || offer_cta_alt.present?
  end

  # this is a legacy method - in the old days,
  # you could either offer 1 product or 1 collection.
  # Now we use "offerables" which is 1 or more products,
  # much more flexible
  def collection
    if offerable_type == 'collection'
      if read_attribute(:offerable_shopify_id).present?
        shop.collections.find_by_shopify_id(offerable_shopify_id)
      else
        shop.collections.find_by_id(offerable_id)
      end
    else
      nil
    end
  end

  # this is a legacy method - in the old days,
  # you could either offer 1 product or 1 collection.
  # Now we use "offerables" which is 1 or more products,
  # much more flexible
  def product
    if offerable_type == 'product'
      if read_attribute(:offerable_shopify_id).present?
        shop.products.find_by_shopify_id(offerable_shopify_id)
      else
        shop.products.find_by_id(offerable_id)
      end
    else
      nil
    end
  end

  # Public. Get shopify's ids for the products in the offer
  def offerable_product_shopify_ids
    if offerable_type == 'product'
      [product.try(:shopify_id)]
    elsif offerable_type == 'collection'
      collection.products.map(&:shopify_id)
    elsif offerable_type == 'multi'
      read_attribute(:offerable_product_shopify_ids) || []   # set by lib/tasks/scheduler.rake
    elsif offerable_type == 'auto'
      stored = read_attribute(:offerable_product_shopify_ids)
      stored.presence || (shop.autopilot_companions.map { |c| [c[0], c[1].map(&:first)] }.flatten +
                          shop.autopilot_bestsellers).uniq
    end
  end

  # Public. Get product(s) details for the offer based on the historical saved orders.
  #
  # instock_only - boolean
  # filter_included_variants - boolean
  # limit - integer
  #
  # Return hashmap
  def offerable_product_details(instock_only = false, filter_included_variants = false, limit = nil)
    product_opts = {
      image_size: product_image_size,
      for_offer_id: id
    }

    deets = shop.products.where(shopify_id: offerable_product_shopify_ids).active.limit(limit).map do |p|
              if filter_included_variants && included_variants.present?
                product_opts[:included_variants] = included_variants[p.shopify_id.to_s] || []
              end
              p.offerable_details(product_opts)
            end
    if instock_only
      deets.map { |d| d if d[:available_json_variants].length > 0 }.compact.sort_by { |a|
                    offerable_product_shopify_ids.index(a[:id]) }
    else
      deets.sort_by { |a| offerable_product_shopify_ids.index(a[:id]) }
    end
  end

  # Public. Find the name of the variant. Return the first :title of many.
  #
  # Return String.
  def offerable_title
    if offerable_type == 'product'
      offerable_shopify_title || product.try(:title) || '(Product Deleted From Store)'
    elsif offerable_type =='collection'
      offerable_shopify_title || collection.try(:title) || '(Collection Deleted From Store)'
    elsif offerable_type == 'multi'
      if offerable_product_details.empty?
        ''
      else
        offerable_product_details.first[:title]
      end
    end
  end

  def offerable_price
    if offerable_type == 'multi'
      if offerable_product_details.present?
        offerable_product_details.first[:price]
      else
        0.0
      end
    elsif offerable_type == 'collection'
      if collection.nil? || collection.products.empty?
        0.0
      else
        if collection.products.first.variants_json.blank?
          0.0
        else
          #FORMAT PRICE
          OffersController.helpers.formatted_variant_price(shop, collection.products.first.variants_json.first['price'])
        end
      end
    else
      if product.nil? || product.variants_json.blank?
        0.0
      else
        #FORMAT PRICE
        OffersController.helpers.formatted_variant_price(shop, product.variants_json.first['price'])
      end
    end
  end

  def offerable_compare_at_price
    if offerable_type == 'multi'
      if offerable_product_details.present?
        offerable_product_details.first[:compare_at_price]
      else
        0.0
      end
    elsif offerable_type == 'collection'
      if collection.nil? || collection.products.empty?
        0.0
      else
        if collection.products.first.variants_json.blank?
          0.0
        else
          # FORMAT PRICE
          OffersController.helpers.formatted_variant_price(shop, collection.products.first.variants_json.first['compare_at_price'])
        end
      end
    else
      if product.nil? || product.variants_json.blank?
        0.0
      else
        # FORMAT PRICE
        OffersController.helpers.formatted_variant_price(shop, product.variants_json.first['compare_at_price'])
      end
    end
  end

  # Public. Sums the value of all the products in the offer.
  #
  # Return integer.
  def offerable_numeric_price
    if offerable_type == 'collection'
      if collection.blank?
        0.0
      else
        # GET TAXED PRICE
        price = collection.average_price
        if shop.present? && shop.tax_percentage.present?
          price + (price * shop.tax_percentage)
        else
          price
        end
      end
    elsif offerable_type == 'multi'
      average_product_price
    else
      price = average_product_price
      if price.nil?
        0.0
      else
        # GET TAXED PRICE
        if shop.present? && shop.tax_percentage.present?
          price + (price * shop.tax_percentage)
        else
          price
        end
      end
    end
  end

  def safe_offerable_price
    begin
      offerable_price
    rescue
      0.0
    end
  end

  def first_stat_date
    if daily_stats.empty?
      created_at.strftime("%Y-%m-%d")
    else
      daily_stats.first.for_date.strftime("%Y-%m-%d")
    end
  end

  def product_ids_to_remove
    if products_to_remove.blank?
      []
    else
      products_to_remove.map{|p| p['id'] }
    end
  end

  def offerable_must_be_present
    if offerable_type == 'multi'
      if offerable_product_shopify_ids.blank?
        # errors.add(:offerable_product_shopify_ids, "- please choose something to offer")
      end
    elsif offerable_type == 'auto'
    else
      if offerable_id.blank? && offerable_shopify_id.blank?
        errors.add(:offerable_id, "- please choose something to offer")
      end
    end
  end

  # Public. Build 'liquified' text.
  #
  # Return. String.
  def offer_text_must_be_valid
    if offer_text.blank?
      return
    else
      begin
        self.compiled_offer_text = Liquid::Template.parse(offer_text, error_mode: :strict)
      rescue Liquid::SyntaxError
        errors.add(:offer_text, 'has a syntax error')
      end
    end
  end

  def hidden_variants
    shop.products.where(shopify_id: offerable_product_shopify_ids).map{|p|
      p.hidden_variants
    }.flatten.compact
  end

  def available_variants?
    shop.products.where(shopify_id: offerable_product_shopify_ids).map{|p|
      p.available_json_variants.length >= 1
    }.member?(true)
  end

  def offerable_shopify_id
    if read_attribute(:offerable_shopify_id).blank?
      if offerable_type == 'collection'
        collection.try(:shopify_id)
      else
        product.try(:shopify_id)
      end
    else
      read_attribute(:offerable_shopify_id)
    end
  end

  def offerable_shopify_title
    if read_attribute(:offerable_shopify_title).blank?
      if offerable_type == "collection"
        collection.try(:title)
      else
        product.try(:title)
      end
    else
      read_attribute(:offerable_shopify_title)
    end
  end

  def offerable_products
    if offerable_type == "product"
      [product]
    else
      collection.products
    end
  end

  def variants_for_handlebars
    if offerable_type == 'product'
      product.available_variants_for_handlebars(image_size)
    elsif offerable_type == 'multi' || offerable_type == 'auto'
      h = []
      ids = (offerable_product_shopify_ids || []) + (multi_offerables || [])
      shop.products.where(shopify_id: ids).each { |product|
        my_variants = product.available_variants_for_handlebars(image_size)
        h << {
          id: product.shopify_id,
          title: product.title,
          url: product.url,
          medium_image_url: product.medium_image_url,
          available_json_variants: my_variants,
          hide_variants_wrapper: my_variants.count <= 1,
          show_single_variant_wrapper: my_variants.count == 1
        }
      }
      h
    elsif offerable_type == 'collection'
      h = []
      collection.products.each{|product|
        my_variants = product.available_variants_for_handlebars(image_size)
        h << {
          title: product.title,
          url: product.url,
          medium_image_url: product.medium_image_url,
          available_json_variants: my_variants,
          hide_variants_wrapper: my_variants.count <= 1,
          show_single_variant_wrapper: my_variants.count == 1
        }
      }
      h
    end
  end

  # Public. Found the offerable products based on the historic orders purchased products.
  #
  # Return hashmap.
  def library_json
    limit_offerables = offerable_type == 'auto' ? 10 : nil
    my_offerable_product_details = offerable_product_details(false, true, limit_offerables)
    res = {
      id: id,
      rules_json: rules_json,
      text_a:  (offer_text || ''),
      text_b:  (offer_text_alt || ''),
      cta_a:  offer_cta,
      cta_b:  offer_cta_alt,
      offerable: {
        title:  offerable_title,
        price:  offerable_price,
        compare_at_price: offerable_compare_at_price
      },
      css: offer_css,
      show_product_image: show_product_image,
      product_image_size: product_image_size || 'medium',
      link_to_product: link_to_product,
      theme:  theme ,
      shop: {
        path_to_cart: shop.path_to_cart,
        extra_css_classes: shop.extra_css_classes,
        css_options: shop.css_options,
        offer_css: shop.offer_css
      },
      show_nothanks: show_nothanks || false,
      calculated_image_url:  calculated_image_url ,
      hide_variants_wrapper: offerable_type == 'product' && product.available_json_variants.count == 1,
      show_variant_price: show_variant_price,
      uses_ab_test: uses_ab_test?,
      has_ab_test: subscription.try(:has_ab_testing) || false,
      ruleset_type: ruleset_type,
      offerable_type:  offerable_type,
      offerable_product_shopify_ids: offerable_product_shopify_ids,
      offerable_product_details: my_offerable_product_details,
      checkout_after_accepted: checkout_after_accepted || false,
      discount_code:  discount_code || '',
      discount_target_type:  discount_target_type || 'none',
      stop_showing_after_accepted: stop_showing_after_accepted || false,
      publish_status: active ? 'published' : 'draft',
      products_to_remove: products_to_remove || [],
      show_powered_by: show_powered_by,
      show_spinner: shop.show_spinner?,
      must_accept: must_accept || false,
      show_quantity_selector: show_quantity_selector,
      powered_by_text_color:  powered_by_text_color,
      powered_by_link_color:  powered_by_link_color,
      multi_layout: multi_layout || 'compact',
      show_custom_field: show_custom_field || false,
      custom_field_name: custom_field_name,
      custom_field_placeholder: custom_field_placeholder,
      custom_field_required: custom_field_required || false,
      custom_field_2_name: custom_field_2_name,
      custom_field_2_placeholder: custom_field_2_placeholder,
      custom_field_2_required: custom_field_2_required || false,
      custom_field_3_name: custom_field_3_name,
      custom_field_3_placeholder: custom_field_3_placeholder,
      custom_field_3_required: custom_field_3_required || false,
      title: title,
      included_variants: included_variants || {},
      show_compare_at_price: show_compare_at_price?,
      redirect_to_product: redirect_to_product?,
      show_product_price: show_product_price?,
      show_product_title: show_product_title?,
      in_cart_page: in_cart_page?,
      in_ajax_cart: in_ajax_cart?,
      in_product_page: in_product_page?,
      css_options: css_options || {},
      placement_setting: placement_setting,
      save_as_default_setting: save_as_default_setting,
      advanced_placement_setting: advanced_placement_setting,
      custom_css: custom_css,
    }
    # todo: hide title from published version
    res[:winning_version] = winner if winner.present?
    if offerable_type == 'auto'
      res[:autopilot_quantity] = autopilot_quantity || 1
      #excluded tags not in published_Version
      res[:excluded_tags] = excluded_tags
    end

    if shop.has_recharge && recharge_subscription_id.present?
      res[:has_recharge]             = shop.has_recharge && recharge_subscription_id.present?
      res[:interval_unit]            = interval_unit
      res[:interval_frequency]       = interval_frequency.to_i
      res[:recharge_subscription_id] = recharge_subscription_id.to_i
    end

    res[:remove_if_no_longer_valid] = remove_if_no_longer_valid ? true : false  # deprecated field anyway

    res
  end

  def self.available_themes
    themes = %w[custom default inverse original desert cobalt halloween turquoise blank]
    themes.map{|t| [t.capitalize,t] }
  end

  def duplicate
    new_offer = self.dup
    new_offer.title = "Copy of #{title_or_id}"
    new_offer.active = false;
    new_offer.published_at = nil;
    new_offer.save
  end

  def calculated_image_url
    if use_huge_image?
      product.try(:big_image_url)
    elsif use_bigger_image?
      product.try(:medium_image_url)
    else
      product.try(:image_url)
    end
  end

  def image_size
    if use_huge_image?
      'big'
    elsif use_bigger_image?
      'medium'
    else
      'small'
    end
  end

  ##### Methods for describing statistics about the offer #######
  def total_times_shown(variant=nil)
    q = ['times', variant, 'loaded'].compact.join('_').to_sym
    daily_stats.sum(q)
  end

  def total_times_clicked(variant=nil)
    q = ['times', variant, 'clicked'].compact.join('_').to_sym
    daily_stats.sum(q)
  end

  def ctr(version='all')
    if version == 'a'
      shown = total_times_shown('orig')
      clicked = total_times_clicked('orig')
    elsif version == 'b'
      shown = total_times_shown('alt')
      clicked = total_times_clicked('alt')
    else
      shown = total_times_shown
      clicked = total_times_clicked
    end
    if shown == 0
      0.0
    else
      clicked / shown.to_f * 100.0
    end
  end

  def ctr_string(version='all')
    if version == 'a'
      shown = total_times_shown('orig')
    elsif version == 'b'
      shown = total_times_shown('alt')
    else
      shown = total_times_shown
    end
    if shown == 0
      "N/A"
    else
      ctr(version).round(2).to_s + " %"
    end
  end

  # returns 'alt', 'orig', or nil
  def ab_test_winner
    base = (total_times_shown * total_times_clicked).to_f
    return nil if base < 1
    orig_expected = total_times_shown("orig") / base
    alt_expected = total_times_shown("alt") / base
    a = orig_expected - total_times_clicked("orig")
    b = alt_expected - total_times_clicked("alt")
    chi_squared = (a * a / orig_expected) + (b * b / alt_expected)
    if chi_squared > 3.84 # 95%
      ctr('a') > ctr('b') ? 'a' : 'b'
    else
      nil
    end
  end
  ##### End Methods for describing statistics about the offer #######

  def last_stat_update_at
    daily_stats.order(:created_at).last.try(:created_at)
  end

  ### Try to automatically determine high-contrast colors for the "powered by" link
  def powered_by_text_color
    if theme == 'custom'
      Offer.get_contrast_yiq(shop.custom_bg_color)
    else
      colors = {
        default: "#444444",
        inverse: "#EEEEEE",
        original: "#376D38",
        desert: "#444444",
        cobalt: "#EEEEEE",
        halloween: '#eeeeee',
        turquoise: "#EEEEEE",
        blank: "#444444"
      }
      colors[theme.to_sym]
    end
  end

  def powered_by_link_color
    if theme == 'custom'
      base = Offer.get_contrast_yiq(shop.custom_bg_color)
      if base == '#FFFFFF'
        '#EEEEEE'
      else
        '#222222'
      end
    else
      colors = {
        default: "#333333",
        inverse: "#EEEEEE",
        original: "#376D38",
        desert: "#DA482E",
        cobalt: "#2BE8A4",
        halloween: "#FB8800",
        turquoise: "#222222",
        blank: "#333333"
      }
      colors[theme.to_sym]
    end
  end

  # Public: Migrate form old to the new rules_json format.
  #
  # Returns boolean.
  def update_rules_format
    return false if rules_json.blank?

    new_rules = rules_json.map do |rule|
      next if rule['rule_selector'].present? # rule already has the new format

      add_rule_keys(rule)
    end

    return false if new_rules == rules_json

    update_column :rules_json, new_rules
  end

  def self.get_contrast_yiq(hexcolor)
    if hexcolor.length == 6 && hexcolor.to_s[0] != "#"
      hexcolor = '#' + hexcolor.to_s
    end
    r = hexcolor[1,2].to_s.to_i(16)
    g = hexcolor[3,2].to_s.to_i(16)
    b = hexcolor[5,2].to_s.to_i(16)
    yiq = ((r*299)+(g*587)+(b*114))/1000
    (yiq >= 128) ? '#000000' : '#FFFFFF'
  end
  ### End Try to automatically determine high-contrast colors for the "powered by" link

  def self.new_with_defaults(for_shop=nil)
    offerables = Product.where(shop_id: for_shop.try(:id)).limit(1)
    oid = offerables.empty? ? "" : offerables[0].id
    Offer.new(
      offer_text: "Would you like to add a {{ product_title }} for {{ product_price }}?",
      offerable_type: "product",
      offerable_id: oid,
      show_product_image: true,
      theme: "default",
      offer_css: "",
      offer_cta: "Add To Cart",
      collection_layout: 'accordion',
      shop: for_shop
    )
  end

  def self.active
    where(active: true)
  end

  def self.search_for(str)
    where("title ilike '%#{str}%'")
  end

  # Public. Give us what collections are we using in the rules.
  #
  # Return Array.
  def active_collections_shopify_ids
    rules_json.map do |r|
      ria = r.with_indifferent_access
      ria[:item_shopify_id]  if ria[:item_type] == 'collection'
    end
  end

  private

  # Private: add the new format key to the old format rules.
  #
  # rule - hash holding the old format rule.
  #
  # Returns new hash.
  def add_rule_keys(rule)
    parities = { 'rule_type' => 'rule_selector', 'itemShopifyId' => 'item_shopify_id',
                 'item_id' => 'item_shopify_id', 'body' => 'item_name' } # K = old, V = new

    new_rules = parities.each_with_object({}) do |(key, value), a|
      if rule[key].present? && rule[value].blank?
        a[value] = rule[key]
      end
    end

    if rule['type'].present?
      new_rules['rule_selector'] = define_rule_type(rule['type'])
      new_rules['item_type']     = rule['type']
    end
    rule.merge new_rules
  end

  # Private: Support function, find the new name for and old format rule.
  #
  # rtype - String, old rule_type name.
  #
  # Returns String.
  def define_rule_type(rtype)
    case rtype
    when 'product'
      'cart_at_least'
    when 'collection'
      'on_product_this_product_or_in_collection'
    when 'tag'
      'customer_is_tagged'
    when 'cart_total'
      'total_at_least'
    else
      rtype
    end
  end

  # Private: get the average price of the products contained in the offer.
  #
  # Returns float.
  def average_product_price
    prices = offerable_product_details.map { |d| d[:price].to_f }
    prices.reduce(:+).to_f / prices.size # average
  end

  # Private. Get all the info for a Product or Collection related to a rule (trigger).
  #
  # Return. Boolean.
  def populate_object_from_shopify
    (rules_json || []).each do |rule|
      if %w[product collection].include? rule['item_type']
        tmp_type = rule['item_type'].capitalize.constantize # Model's name
        item = tmp_type.find_or_create_by(shop_id: shop_id, shopify_id: rule['item_shopify_id'])

        item.get_details_after_create if item.title.blank?
      end
    end
  end

  # Public. Give us what collections are we using in the rules.
  #
  # Return Array.
  def self.active_collections_shopify_ids
    active.where.not(rules_json: '[]').map { |o|
      o.rules_json.map do |r|
        ria = r.with_indifferent_access
        ria[:item_shopify_id]  if ria[:item_type] == 'collection'
      end
    }.flatten.compact.uniq
  end

  # Private. asign_initial_position_order.
  #
  # Return. Boolean.
  def assign_initial_position_order
    higher_position_offer  = shop.offers.pick(:position_order) #  picks the first result from value(s)
    higher_position_value  = higher_position_offer || 0
    initial_position_order = (higher_position_value + 1)
    update_column :position_order, initial_position_order
  end
end
