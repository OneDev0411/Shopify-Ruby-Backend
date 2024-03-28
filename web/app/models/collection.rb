# frozen_string_literal: true

# This model is exactly what it sounds like - stores details about Collections in the merchant's store.
# Mainly it is used for rules like "show this offer if a product from collection X is in the cart"
class Collection < ApplicationRecord
  include ActiveModel::Dirty

  belongs_to :shop
  has_many :collects

  after_create :cache_collection_key

  def products
    if collects_json.present?
      Product.where(shopify_id: collects_json)
    else
      Rollbar.info("Collection using legacy collects", {collection_id: id})
      Product.where(id: collects.map(&:product_id))
    end
  end

  def average_price
    products.map{|p| p.price.to_f }.sum / products.count
  end

  def fetch_collection_type
    shop.activate_session
    begin
      ShopifyAPI::CustomCollection.find(id: shopify_id)
      self.smart = false
      save
    rescue ShopifyAPI::Errors::HttpResponseError
      begin
        ShopifyAPI::SmartCollection.find(id: shopify_id)
        self.smart = true
        save
      rescue Exception => e
        self.last_error = e.message
        self.last_error_happened_at = Time.now
        save
      end
    end
  end

  # Public. Update local data from Shopify.
  #
  # Return Boolean.
  def fetch_attributes_from_shopify
    shop.activate_session
    fetch_collection_type if smart.nil?
    remote_collection = if smart
                          ShopifyAPI::SmartCollection.find(id: shopify_id)
                        else
                          ShopifyAPI::CustomCollection.find(id: shopify_id)
                        end
    self.title = remote_collection.title
    self.handle = remote_collection.handle
    self.sort_order = remote_collection.try(:sort_order)
    self.products_count = remote_collection.try(:products_count)
  end

  def fetch_attributes_from_shopify!
    fetch_attributes_from_shopify
    save
  end

  def fetch_collects_from_shopify
    self.collects_json = total_products_in_collection
  end

  def fetch_collects_from_shopify!
    fetch_collects_from_shopify
    save
  end

  def fetch_collect_details_from_shopify
    shop.activate_session
    remote_products = ShopifyAPI::Product.all(ids: collects_json.uniq.join(','))
    remote_products.each do |s_product|
      l_product = shop.products.find_or_create_by(shop_id: shop.id, shopify_id: s_product.id)
      l_product.update_with_data(JSON.parse(s_product.original_state.to_json))
    end
  end

  # Public. Updates the collection info, triggered from the Sidekiq worker after Webhook.
  #
  # Return Integer.
  def update_from_shopify_new
    begin
      something_changed = false
      fetch_attributes_from_shopify
      fetch_collects_from_shopify
      something_changed = self.changed?
      Rails.logger.info "  #{title} #{something_changed ? 'has' : 'does not have' } changes"
      self.last_synced_at = Time.now.utc
      self.published_status = 'present'
      save
      return something_changed ? 200 : 304
    rescue ShopifyAPI::Errors::HttpResponseError
      self.last_error = 'Not found at Shopify'
      self.published_status = 'absent'
      self.last_error_happened_at = Time.now.utc
      save
      return 404
    end
  end

  def get_details_after_create(with_products=false)
    Rails.logger.info "Getting details for #{title}"
    begin
      Rails.logger.info " attributes"
      fetch_attributes_from_shopify
      Rails.logger.info " collects"
      fetch_collects_from_shopify
      if with_products
        Rails.logger.info " collect_details"
        fetch_collect_details_from_shopify
      else
        Rails.logger.info " skipping product details"
      end
      save
    rescue ActiveResource::ClientError => e
      Rollbar.error(e)
      # Not sure what to do here
      # self.delay.get_details_after_create
    end
  end

  private

  # Private. Get all products shopify IDs through the API.
  #
  # Return. Hashmap.
  def total_products_in_collection
    url = "https://#{shop.shopify_domain}/admin/api/#{ShopifyApp.configuration.api_version}" \
          "/collections/#{shopify_id}/products.json?limit=250&fields=id"

    sum_products_id(url, []).flatten
  end

  # Private. Recursive method. Sum all the products shopify IDs in a collection.
  #
  # url         - String. The Shopifys API url.
  # accumulator - Array.
  #
  # Return. Array.
  def sum_products_id(url, accumulator)
    result = HTTParty.get(url, body: {}, headers: shop.api_headers)
    accumulator << extract_ids(result.body)

    return accumulator unless result.header['link']&.include? 'next'

    new_url = result.header['link'].scan(/<(\S+)>/).last.first # take next URL
    sum_products_id(new_url, accumulator)
  end

  def extract_ids(result_body)
    hash_body = JSON.parse(result_body)
    hash_body['products'].map{ |pp| pp['id'] }
  end

  def cache_collection_key
    begin
      $redis_cache.set("shopify_collection_#{shopify_id}", 1)
    rescue => e
      Rails.logger.error "Redis Error, #{e.class}: #{e.message}"
    end
  end
end
