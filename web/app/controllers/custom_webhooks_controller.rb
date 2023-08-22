# THIS IS A DUMMY FILE, our real webhooks are in other git repo and other heroku app in order
# to balance the app's charge. But Shopify requires this webhooks:
# https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
# they just return a HTTP 200 message. Don't remove this file and its routes from the routes.rb file.

class CustomWebhooksController < ApplicationController
  include ShopifyApp::WebhookVerification
  skip_before_action :set_host
  skip_before_action :set_shopify_api_key

  # before_action :verify_webhook

  # No shops use this anymore, but we return the 200 status anyway
  # just in case Shopify sends the request for any reason
  def shop_uninstalled
    params.permit!
    head :no_content
  end

  # No shops use this anymore, but we return the 200 status anyway
  # just in case Shopify sends the request for any reason
  def product_deleted
    params.permit!
    head :no_content
  end

  # No shops use this anymore, but we return the 200 status anyway
  # just in case Shopify sends the request for any reason
  def product_created
    params.permit!
    head :no_content
  end

  #No shops use this anymore, but we return the 200 status anyway
  # just in case Shopify sends the request for any reason
  def order_created
    params.permit!
    head :no_content
  end

  # Shopify required webhooks.  We don't store any customer data, so we just return a success message
  def redact_shop
    params.permit!
    head :no_content
  end

  # Shopify required webhooks.  We don't store any customer data, so we just return a success message
  def request_customer
    params.permit!
    head :no_content
  end

  # Shopify required webhooks.  We don't store any customer data, so we just return a success message
  def redact_customer
    params.permit!
    head :no_content
  end

  private
    def webhook_params
      params.except(:controller, :action, :type)
    end

    # we use this methods to test the payload locally
    def verify_webhook
      data = request.body.read.to_s
      hmac_header = request.headers['HTTP_X_SHOPIFY_HMAC_SHA256']
      digest  = OpenSSL::Digest.new('sha256')
      calculated_hmac = Base64.encode64(OpenSSL::HMAC.digest(digest, ENV['SHOPIFY_APP_SECRET'], data)).strip
      unless calculated_hmac == hmac_header
        Rollbar.info('Denied Webhook', { calculated: calculated_hmac, actual: hmac_header, request: request})
        return render text: 'Not Authorized', status: :unauthorized, layout: false
      end
      request.body.rewind
    end
end
