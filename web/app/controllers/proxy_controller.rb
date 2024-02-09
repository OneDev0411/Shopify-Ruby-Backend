class ProxyController < ApplicationController
  require 'openssl'
  require 'rack/utils'

  SHARED_SECRET = ENV['SHOPIFY_APP_SECRET']

  before_action :verify_signature

  def all_offers
    offers = @icushop.proxy_offers
    offer_settings = @icushop.proxy_shop_settings

    render json: { shopify_domain: @shopify_domain, offers: offers, offer_settings: offer_settings }
  end

  def shop_collections
    collections = Collection.where(shop_id: @icushop.id)

    render json: { shopify_domain: @shopify_domain, collection: collections }
  end

  def theme_app_completed
    render json: { theme_app_completed: @icushop.theme_app_extension.theme_app_complete }
  end

  def customer_tags
    session = @icushop.activate_session

    customer = ShopifyAPI::Customer.find(session: session, id: @customer_id,)
    tags = []

    if customer.present?
      tags = customer.tags.split(',').map(&:strip)
    end

    tags
  end

  private

  def verify_signature
    query_string = request.query_string
    query_hash = Rack::Utils.parse_query(query_string)

    signature = query_hash.delete("signature")
    sorted_params = query_hash.collect{ |k, v| "#{k}=#{Array(v).join(',')}" }.sort.join
    calculated_signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), SHARED_SECRET, sorted_params)
    raise 'Invalid signature' unless ActiveSupport::SecurityUtils.secure_compare(signature, calculated_signature)

    query_string = request.query_string
    query_hash = Rack::Utils.parse_query(query_string)

    @shopify_domain = query_hash["shop"]
    @customer_id = query_hash["logged_in_customer_id"]
    @icushop = Shop.find_by(shopify_domain: @shopify_domain)
  end
end
