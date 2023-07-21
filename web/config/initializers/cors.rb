# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

unless Rails.env.production?
  Rails.application.config.middleware.insert_before 0, Rack::Cors, debug: true, logger: Rails.logger do
    allow do
      origins '*'
      resource '/api/*', headers: :any, methods: [:get, :post, :options, :put, :patch, :delete]
      resource '/assets/*', headers: :any, methods: [:get, :options, :head]
      resource '/webpack/*', headers: :any, methods: [:get, :options, :head]
    end
  end
end
