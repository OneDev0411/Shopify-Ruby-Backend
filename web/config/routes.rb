# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'home#index'

  mount ShopifyApp::Engine, at: '/api'
  get '/api', to: redirect(path: '/') # Needed because our engine root is /api but that breaks FE routing

  # If you are adding routes outside of the /api path, remember to also add a proxy rule for
  # them in web/frontend/vite.config.js

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get '/confirm_from_outside', to: 'js#confirm_from_outside'
  get 'api/js/offer', to: 'js#offer'

  post 'api/offers/create/:shop_id', to: 'offers#create_from_builder'
  patch 'api/offers/:id/update/:shop_id', to: 'offers#update_from_builder'

    # API V1
  namespace :api do
    namespace :merchant, defaults: { format: 'json' } do
      post 'offers/load_ab_analytics', to: 'offers#ab_analytics'
      post 'element_search', to: 'products#element_search'
      post 'load_offer_details', to: 'offers#load_offer_details'
      post 'offer_settings', to: 'offers#offer_settings'
      post 'shop_settings', to: 'shops#shop_settings'
      get 'shop_offers', to: 'offers#shop_offers'
      get '/products/shopify/:shopify_id' => 'products#shopify_details'
      get '/products/multi/:shopify_id' => 'products#details_for_multi'
      patch 'update_shop_settings', to: 'shops#update_shop_settings'
      get 'current_shop', to: 'shops#current_shop'
      get 'toggle_activation', to: 'shops#toggle_activation'
      put 'subscription', to: 'subscriptions#update'
      get 'current_subscription', to: 'subscriptions#current_subscription'
      get 'subscription/confirm_charge', to: 'subscriptions#confirm_charge', as: :confirm_charge
      get 'partners', to: 'partners#index'
      get 'autopilot_details', to: 'shops#autopilot_details'
      post 'enable_autopilot', to: 'shops#enable_autopilot'
      get 'enable_autopilot_status', to: 'shops#enable_autopilot_status'
      
      post 'offers_list', to: 'offers#offers_list'
      post 'offer_activate', to: 'offers#activate'
      post 'offer_deactivate', to: 'offers#deactivate'
      post 'shop_sale_stats', to: 'shops#shop_sale_stats'
      post 'shop_orders_stats', to: 'shops#shop_orders_stats'
      post 'shop_offers_stats', to: 'shops#shop_offers_stats'
      post '/offers/:id/duplicate', to: 'offers#duplicate'
      delete '/offers/:id', to: 'offers#destroy'
      post 'offer/shopify_ids_from_rule', to: 'offers#shopify_ids_from_rule'
      get 'active_theme_for_dafault_template', to: 'shops#active_theme_for_dafault_template'
    end
  end

  # Mandatory Shopify Webhooks (don't remove them even if not used)
  post 'custom_webhooks/redact_shop', to: 'custom_webhooks#redact_shop'
  post 'custom_webhooks/request_customer', to: 'custom_webhooks#request_customer'
  post 'custom_webhooks/redact_customer', to: 'custom_webhooks#redact_customer'



  # Any other routes will just render the react app
  match '*path' => 'home#index', via: [:get, :post]
end
