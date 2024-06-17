# frozen_string_literal: true
ShopifyApp.configure do |config|
  config.application_name = "ICU and Cross-Sell App"
  config.old_secret = ""
  config.scope = 'read_orders,read_products,write_script_tags,read_themes' # See shopify.app.toml for scopes
  # Consult this page for more scope options: https://shopify.dev/api/usage/access-scopes
  config.embedded_app = true
  config.after_authenticate_job = false
  config.api_version = ShopifyAPI::AdminVersions::LATEST_SUPPORTED_ADMIN_VERSION
  config.shop_session_repository = "Shop"
  config.reauth_on_access_scope_changes = true
  # DOMAIN_URL = ENV['DOMAIN_URL']
  # config.root_url = "#{DOMAIN_URL}/api"
  # config.login_url = "#{DOMAIN_URL}/api/auth"
  # config.login_callback_url = "#{DOMAIN_URL}/api/auth/callback"
  # config.embedded_redirect_url = '/ExitIframe'
  config.root_url = "/api"
  config.login_url = "/api/auth"
  config.login_callback_url = "/api/auth/callback"
  config.embedded_redirect_url = "/ExitIframe"
  # You may want to charge merchants for using your app. Setting the billing configuration will cause the Authenticated
  # controller concern to check that the session is for a merchant that has an active one-time payment or subscription.
  # If no payment is found, it starts off the process and sends the merchant to a confirmation URL so that they can
  # approve the purchase.
  #
  # Learn more about billing in our documentation: https://shopify.dev/apps/billing
  # config.billing = ShopifyApp::BillingConfiguration.new(
  #   charge_name: "My app billing charge",
  #   amount: 5,
  #   interval: ShopifyApp::BillingConfiguration::INTERVAL_ANNUAL,
  #   currency_code: "USD", # Only supports USD for now
  # )
  config.api_key = ENV['SHOPIFY_APP_API_KEY']
  config.secret = ENV['SHOPIFY_APP_SECRET']
  config.myshopify_domain = nil
  if defined? Rails::Server
    raise("Missing SHOPIFY_API_KEY. See https://github.com/Shopify/shopify_app#requirements") unless config.api_key
    raise("Missing SHOPIFY_API_SECRET. See https://github.com/Shopify/shopify_app#requirements") unless config.secret
  end
end
Rails.application.config.after_initialize do
  if ShopifyApp.configuration.api_key.present? && ShopifyApp.configuration.secret.present?
    ShopifyAPI::Context.setup(
      api_key: ShopifyApp.configuration.api_key,
      api_secret_key: ShopifyApp.configuration.secret,
      api_version: ShopifyApp.configuration.api_version,
      host_name: URI(ENV['DOMAIN_URL']).host || "",
      scope: ShopifyApp.configuration.scope,
      is_private: !ENV.fetch("SHOPIFY_APP_PRIVATE_SHOP", "").empty?,
      is_embedded: ShopifyApp.configuration.embedded_app,
      logger: Rails.logger,
      log_level: :info,
      private_shop: ENV.fetch("SHOPIFY_APP_PRIVATE_SHOP", nil),
      user_agent_prefix: "ShopifyApp/#{ShopifyApp::VERSION}",
    )
  end
end
