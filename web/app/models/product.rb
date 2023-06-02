# frozen_string_literal: true
# coding: utf-8

# One of the core models of the application, this is used to
# store data about a product. We listen for changes to a product
# via webhooks, and we also manually fetch updates for all of the products
# we're currently concerned about once a day in a scheduled job

class Product < ApplicationRecord
  # require 'rake/pathmap'
  include ActiveModel::Dirty
  include ActionView::Helpers::NumberHelper
  enum status: %i[draft active]
  belongs_to :shop
  has_many :offers
  has_many :collections, through: :collects
  has_many :collects, dependent: :delete_all

  attr_accessor :hidden_json_variants

  def price
    if read_attribute(:price).present?
      read_attribute(:price)
    else
      if variants_json.present?
        variants_json.first['price']
      else
        0.0
      end
    end
  end

  def compare_at_price
    variants_json.blank? ? price : variants_json.first['compare_at_price']
  end

  def platform
    shop.try(:platform) || "shopify"
  end

  # Public. Create data structure.
  #
  # Return. Hashmap.
  def build_to_json
    my_variants = variants_json.map{ |v| { image_url: v['image_url'], title: v['title'],
                                          shopify_id: v['shopify_id'], price: v['price'] } }
    {
      title: title,
      shopify_id: shopify_id,
      product_type: product_type,
      variants: my_variants,
      variant_ids: variants_json.map{|v| v['id'] }
    }
  end

  # Public: gather data for each offer.
  #
  # opts - hashmap.
  #
  # Returns hashmap.
  def offerable_details(opts = {})
    for_offer_id = opts[:for_offer_id] || nil
    image_size   = opts[:image_size] || 'small'
    my_image_url = medium_image_url
    my_available_variants = available_variants_for_handlebars(image_size, opts[:included_variants] || [])

    my_image_url = big_image_url  if ['big', 'huge'].include? image_size

    if my_available_variants.length > 1 && my_available_variants[0][:image_url].present?
      my_image_url = my_available_variants[0][:image_url]
    end
    {
      id: shopify_id,
      offer_id: for_offer_id,
      title: title,
      price: price,
      url: url,
      compare_at_price: compare_at_price,
      available_json_variants: my_available_variants,
      show_single_variant_wrapper: my_available_variants.length == 1,
      hide_variants_wrapper: my_available_variants.length <= 1,
      medium_image_url: my_image_url
    }
  end

  def hidden_variants
    hide = []
    if(shop.present? && shop.hidden_products_json.present?)
      hide << shop.hidden_products_json[shopify_id.to_s]
    end
    if hidden_variant_shopify_ids.present?
      hide << hidden_variant_shopify_ids
    end
    hide
  end

  def formatted_presentment_prices_for_variant(v)
    return [] if v['presentment_prices'].blank?

    v['presentment_prices'].map { |p|
      {
        label: p['price']['currency_code'],
        price: formatted_price_for_code(p['price']['currency_code'], p['price']['amount']),
        compare_at_price: p['compare_at_price'].present? ? formatted_price_for_code(p['price']['currency_code'], p['compare_at_price']['amount']) : ''
      }
    }
  end

  # Public: create a datastructure to populate the mustache templates.
  #
  # image_size  - String.
  # included_variants - Array.
  #
  # Returns Array.
  def available_variants_for_handlebars(image_size = 'small', included_variants = [])
    begin
      available_json_variants(included_variants).map do |v|
        {
          id: v['id'],
          image_url: calculated_image_for_json_variant(v['id'], image_size),
          title: v['title'],
          price: OffersController.helpers.parenthesized_variant_price(shop, v['price']),
          currencies: formatted_presentment_prices_for_variant(v),
          unparenthesized_price: OffersController.helpers.variant_price(shop, v['price']),
          compare_at_price: v['compare_at_price'].present? ? OffersController.helpers.variant_price(shop, v['compare_at_price']) : '',
          price_is_minor_than_compare_at_price: price_is_minor_than_compare_at_price?(v)
        }
      end
    rescue
      []
    end
  end

  # Public. Get all of the variants that are 1) in stock and 2) not hidden
  #
  # included_variants - Array
  #
  # Return hashmap
  def available_json_variants(included_variants=[])
    return JSON.parse([].to_s) if variants_json.nil?

    hide = []
    hide += (shop.hidden_products_json[shopify_id.to_s] || []) if shop.try(:hidden_products_json).present?
    hide += hidden_variant_shopify_ids || []

    res = variants_json.map { |v|
      hidden = hide.member?(v['id'])
      inventory_available = v['inventory_quantity'] > 0 || v['inventory_management'].blank? || v['inventory_policy'].blank? || v['inventory_policy'] == 'continue'
      shown = included_variants.blank? || included_variants.member?(v['id'])
      v if !hidden && inventory_available && shown
    }.compact
    res
  end

  def medium_image_url
    if image_url.blank?
      ''
    else
      image_url.gsub('_small.', '_medium.')
    end
  end

  def big_image_url
    if image_url.blank?
      ''
    else
      image_url.gsub('_small.', '_1024x1024.')
    end
  end

  def update_from_shopify
    shop.activate_session
    remote = ShopifyAPI::Product.find(id: shopify_id)
    self.update_with_data(JSON.parse(remote.original_state.to_json))
  end

  # Public: Save "update/product" webhook.
  #
  # Returns boolean.
  def update_from_shopify_new
    begin
      headers = shop.api_headers.merge('X-Shopify-Api-Features' => 'include-presentment-prices')
      remote = HTTParty.get(api_url, headers: headers)
    rescue Exception => e
      self.sync_state = "update_from_shopify_new error: #{e.message}"
      save
      return
    end
    if remote.parsed_response['product'].blank?
      self.sync_state = "error: #{remote.parsed_response}"
      save
      return
    end
    self.apply_new_data(remote.parsed_response['product'])
    if self.changed?
      self.sync_state = 'success'
      self.last_synced_at = Time.now.utc
      save
      return true
    else
      self.sync_state = 'success'
      self.last_synced_at = Time.now.utc
      save
      return false
    end
  end

  # Public. Populate the object with Shopify's data after created.
  #
  # full_details  - boolean.
  #
  # Return. boolean.
  def get_details_after_create(full_details = true)
    begin
      self.update_from_shopify_new
    rescue ActiveResource::ClientError => e
      ShopWorker::UpdateProductJob.perform_async(id)
    end
  end

  def image_for_json_variant(shopify_variant_id)
    begin
      image_id = variants_json.map{|v| v if v['id'].to_s == shopify_variant_id.to_s }.compact[0]['image_id']
      images_json[image_id.to_s]
    rescue
      image_url
    end
  end

  def calculated_image_for_json_variant(shopify_variant_id, size)
    url = image_for_json_variant(shopify_variant_id)
    if url.blank?
      ""
    elsif size == 'big' || size == 'huge'
      url.gsub("_small.", "_1024x1024.")
    elsif size == 'medium'
      url.gsub("_small.", "_medium.")
    else
      url
    end
  end

  def update_with_data(s_product)
    self.apply_new_data(s_product)
    save
  end

  # Public: find product(s) that were purchased beside this one.
  #
  # use_weight - boolean, determines if weight of the companion must be added.
  #
  # Returns boolean.
  def set_most_popular_companions(use_weight = false)
    orders_count = Order.where(shop_id: shop.id).where("unique_product_ids @> '?'", shopify_id).count
    orders = orders_with_self_and_others
    if orders.length > 0
      products = {}
      orders.each do |o|
        o.unique_product_ids.each do |pid|
          next if pid == shopify_id && pid == 0

          products[pid.to_s] = 0 if products[pid.to_s].nil?
          if use_weight
            weighted_value = weight_companion(o)
            products[pid.to_s] += weighted_value
          else
            products[pid.to_s] += 1
          end
        end
      end
      companions = products.map{|k,v| [k.to_i, v / orders_count.to_f] }.sort{|a,b| b[1] <=> a[1] }.first(15)
    else
      companions = []
    end
    self.orders_count = orders_count
    self.most_popular_companions = companions
    self.most_popular_companions_updated_at = Time.now.utc
    save
  end

  def companions_list
    return [] if most_popular_companions.blank?

    if most_popular_companions[0][0].is_a?(String)
      most_popular_companions.last(3).map{|c|
        prod = shop.products.find_by(shopify_id: c[0])
        [prod.try(:title), c[0], c[1]] if prod && c[1] > 0.01 && prod.try(:title)
      }.compact.reverse[0 .. 2]
    else
      most_popular_companions.first(3).map{|c|
        prod = shop.products.find_by(shopify_id: c[0])
        [prod.try(:title), c[0], c[1]] if prod && c[1] > 0.01 && prod.try(:title)
      }.compact[0..2]
    end
  end

  # Public: Save data from Shopify to our DB. Called from Shop model.
  #
  # s_product - hashmap
  #
  # Returns boolean.
  def apply_new_data(s_product)
    self.title         = s_product['title']
    self.product_type  = s_product['product_type']
    self.url           = s_product['handle']
    self.options       = s_product['options']
    self.tags          = s_product['tags']
    self.vendor        = s_product['vendor']
    self.variants_json = s_product['variants']
    self.status        =  Product.statuses[s_product['status']]
    my_images = {}
    (s_product['images'] || []).each do |i|
      uri = URI.parse(i['src'])
      curr_image_url = [uri.host, uri.path.pathmap('%X_small%x')].join()
      my_images[i['id']] = curr_image_url
      if i['position'] == 1
        self.image_url = curr_image_url
      end
    end
    self.images_json = my_images
    self.removed_at = nil
  end

  private

  # Private: find orders with this product and at least another product (the companions).
  #
  # Returns AR object.
  def orders_with_self_and_others
    Order.where(shop_id: shop.id)
         .where("unique_product_ids @> '?'", shopify_id)
         .where("((jsonb_array_length(unique_product_ids) > 1 AND NOT unique_product_ids @> '0') OR " \
                      "jsonb_array_length(unique_product_ids) > 2)")
         .select(:unique_product_ids, :created_at)
  end

  # Private. Set weight for companion: weight == more recent, more than one year == less 1.0
  #
  # order - AR object.
  #
  # Returns float.
  def weight_companion(order)
    age_in_months = ((Time.now.year * 12 + Time.now.month) - (order.created_at.year * 12 + order.created_at.month)) + 1
    (12.0 / age_in_months) < 1.0 ? 1.0 : (12.0 / age_in_months)
  end

  # Private.
  # Return String.
  def api_url
    "https://#{shop.shopify_domain}/admin/api/#{ShopifyApp.configuration.api_version}/" \
    "products/#{shopify_id}.json"
  end

  # Private: Format price message. Note: keep the alphabetic order in currencies.
  #
  # code  - string, currency international code.
  # price - string.
  #
  # Returns String.
  def formatted_price_for_code(code, price)
    case code
    when 'AED'
      "#{number_to_currency(price, { unit: 'AED', delimiter: ',', separator: '.'})}"
    when 'CHF'
      "#{number_to_currency(price, { unit: 'CHF', delimiter: ',', separator: '.'})}"
    when 'CLP'
      "$ #{number_with_delimiter(price, { delimiter: '.' })}"
    when 'CNY' # chinese
      "&yen; #{number_with_delimiter(price, { delimiter: ',' })}"
    when 'COP'
      "&#36; #{number_with_precision(price, { precision: 2, delimiter: '.', separator: ',' })}"
    when 'DKK'
      "#{price.gsub('.', ',')} kr"
    when 'EUR'
      formatted_price = OffersController.helpers.variant_price(shop, price)
      formatted_price.include?('&euro;') ? formatted_price : "&euro; #{price.gsub('.', ',')}"
    when 'GBP'
      "&pound; #{price}"
    when 'INR'
      "RS. #{number_with_delimiter(price, { delimiter: ',', separator: '.'})}"
    when 'ISK'
      "#{number_with_precision(price, { precision: 0, delimiter: ',', separator: '.'})} kr"
    when 'JPY'
      "&yen; #{number_with_delimiter(price, { delimiter: ',' })}"
    when 'KWD'
      "#{number_with_delimiter(price, { delimiter: ',', separator: '.'})} KWD"
    when 'MYR'
      number_to_currency(price, { unit: 'RM', delimiter: ',', separator: '.'})
    when 'NOK'
      "#{number_with_precision(price, { precision: 0, delimiter: ',', separator: '.'})} kr"
    when 'PHP'
      "#{number_with_precision(price, { precision: 0, delimiter: ',', separator: '.'})}"
    when 'QAR'
      "#{number_to_currency(price, { unit: 'QAR', delimiter: ',', separator: '.'})}"
    when 'RON'
      "#{number_with_precision(price, { precision: 0, delimiter: '.' })} lei"
    when 'SAR'
      "#{number_to_currency(price, { unit: 'SAR', delimiter: ',', separator: '.'})}"
    when 'SEK'
      "#{number_with_precision(price, { precision: 0, delimiter: ',', separator: '.'})} kr"
    when 'THB' # Thailand Baht
      "#{number_with_delimiter(price, { delimiter: ',' })} &#3647;"
    else
      "&#36; #{price}"
    end
  end

  # Private. To show 'compare_at_price' doesn't make sense if is cheaper than the actual price.
  #
  # variant - Hashmap.
  #
  # Return. Boolean.
  def price_is_minor_than_compare_at_price?(variant)
    begin
      (variant['compare_at_price'].present? && variant['price'].present?) &&
        (variant['compare_at_price'].to_f > variant['price'].to_f)
    rescue StandardError => e
      Rails.logger.debug "Caught compare_at_price exception #{e}!"
      false
    end
  end
end
