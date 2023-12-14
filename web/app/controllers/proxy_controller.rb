class ProxyController < ApplicationController
  require 'openssl'
  require 'rack/utils'

  SHARED_SECRET = ENV['SHOPIFY_APP_SECRET']

  def get_offers
    query_string = request.query_string
    query_hash = Rack::Utils.parse_query(query_string)

    shopify_domain = query_hash["shop"]
    shop = Shop.find_by(shopify_domain: shopify_domain)

    offers = [];

    shop.offers.where(active: true).each do | offer |
      offers << offer.library_json
    end

    render json: { shopify_domain: shopify_domain, offers: offers, offer_settings: shop.offer_settings }
  end

  def verifySignature
    query_string = request.query_string
    query_hash = Rack::Utils.parse_query(query_string)
    signature = query_hash.delete("signature")
    sorted_params = query_hash.collect{ |k, v| "#{k}=#{Array(v).join(',')}" }.sort.join
    calculated_signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), SHARED_SECRET, sorted_params)
    raise 'Invalid signature' unless ActiveSupport::SecurityUtils.secure_compare(signature, calculated_signature)
  end
end