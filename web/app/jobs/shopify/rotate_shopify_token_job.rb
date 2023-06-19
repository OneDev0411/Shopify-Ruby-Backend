# frozen_string_literal: true

class ShopifyNotFoundError < StandardError; end
class ShopifyUnauthorizedAccessError < StandardError; end
class ShopifyResponseError < StandardError; end

module Shopify
  class RotateShopifyTokenJob < ApplicationJob
    # to run in a background job asynchronously
    def perform(params)
      performer(params)
    end
    
    # custom method to run synchronously
    def performer(params)
      @icushop = Shop.find_by(shopify_domain: params[:shopify_domain])
      return unless @icushop

      api_key = ENV['SHOPIFY_APP_API_KEY']
      api_secret = ENV['SHOPIFY_APP_SECRET']

      # Reference Documentation: https://shopify.dev/apps/auth/oauth/rotate-revoke-api-credentials
      uri = URI("https://#{@icushop.shop_domain}/oauth/access_token")
      post_data = {
        client_id: api_key,
        client_secret: api_secret,
        refresh_token: params[:refresh_token],
        access_token: @icushop.shopify_token,
      }

      response = HTTParty.get(URI('https://'+@icushop.shop_domain))
      if response.code == 200
        log_info("Shop #{@icushop.id}, #{@icushop.shopify_domain} - Found: #{response.message}")

        # no need to rotate token if current one is working
        begin
          session = @icushop.activate_session
          client = ShopifyAPI::Clients::Graphql::Admin.new(session: session)
          resp = ShopifyAPI::Webhooks::Registry.get_webhook_id(topic: "products/create", client: client)
          log_info("ShopifyAPI::Webhook.first: #{resp.present?}")
        rescue ActiveResource::UnauthorizedAccess => error
          log_error(error)
        end

      elsif response.code == 404
        log_error(not_found_error_message)
        raise ShopifyNotFoundError, "error: #{response.message}"
      end

      @response = Net::HTTP.post_form(uri, post_data)
      log_info("Response for: Shop # #{@icushop.id}, #{@icushop.shopify_domain}:")

      error = false
      # check to see if request was successful
      if !@response.is_a?(Net::HTTPSuccess) && @response.is_a?(Net::HTTPUnauthorized)
        error = true
        log_error(response_exception_error_message) 
        raise ShopifyUnauthorizedAccessError, "error: #{@response.message}"
      end

      access_token = JSON.parse(@response.body)['access_token']

      # check to see if requried access_token is returned
      unless access_token.present?
        error = true
        log_error(no_access_token_error_message) 
        raise ShopifyResponseError, "error: #{access_token.inspect}"
      end

      log_info("### VAR access_token  ###>>  #{access_token.inspect}")
      unless error
        @icushop.update shopify_token: access_token, shopify_token_updated_at: Time.now.utc
        log_info("Successfully updated shopify token for: Shop # #{@icushop.id}, #{@icushop.shopify_domain}")
      end
    end

    private
    def log_info(message)
      puts message
      Rails.logger.info(message)
    end

    def log_error(message)
      puts message
      Rails.logger.error(message)
    end

    def not_found_error_message
      "Shop: #{@icushop.shopify_domain} doesn't exist."
    end

    def no_access_token_error_message
      "RotateShopifyTokenJob response returned iNcORRECT access token for shop: #{@icushop.shopify_domain}"
    end

    def response_exception_error_message
      "RotateShopifyTokenJob failed for shop: #{@icushop.shopify_domain}." \
        "Response returned status: #{@response.code}. Error message: #{@response.message}. "
    end
  end
end

