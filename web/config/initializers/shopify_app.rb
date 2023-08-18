ShopifyApp.configure do |config|
  config.application_name = 'ICU and Cross-Sell App'
  config.api_key = ENV['SHOPIFY_APP_API_KEY']
  config.secret = ENV['SHOPIFY_APP_SECRET']
  config.old_secret = ''
  config.scope = 'read_orders,read_products,write_script_tags,read_themes'
  config.reauth_on_access_scope_changes = true
  config.embedded_app = true
  config.after_authenticate_job = false
  config.api_version = '2022-10'
  config.shop_session_repository = 'Shop'

  if defined? Rails::Server
    raise('Missing SHOPIFY_API_KEY. ') unless config.api_key
    raise('Missing SHOPIFY_API_SECRET. ') unless config.secret
  end
end

Rails.application.config.after_initialize do
  if ShopifyApp.configuration.api_key.present? && ShopifyApp.configuration.secret.present?
    ShopifyAPI::Context.setup(
      api_key: ShopifyApp.configuration.api_key,
      api_secret_key: ShopifyApp.configuration.secret,
      api_version: ShopifyApp.configuration.api_version,
      host_name: URI(ENV.fetch('DOMAIN_URL', '')).host || '',
      scope: ShopifyApp.configuration.scope,
      is_private: !ENV.fetch('SHOPIFY_APP_PRIVATE_SHOP', '').empty?,
      is_embedded: ShopifyApp.configuration.embedded_app,
      session_storage: ShopifyApp::SessionRepository,
      logger: Rails.logger,
      private_shop: ENV.fetch('SHOPIFY_APP_PRIVATE_SHOP', nil),
      user_agent_prefix: "ShopifyApp/#{ShopifyApp::VERSION}"
    )

  end
end
