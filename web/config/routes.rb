# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'home#index'

  mount ShopifyApp::Engine, at: '/api'
  get '/api', to: redirect(path: '/') # Needed because our engine root is /api but that breaks FE routing

  # If you are adding routes outside of the /api path, remember to also add a proxy rule for
  # them in web/frontend/vite.config.js

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get '/confirm_from_outside', to: 'js#confirm_from_outside'
    # API V1
  namespace :api do
    namespace :v1, defaults: { format: 'json' } do
      post 'offer_activate', to: 'offers#activate'
      post 'offers_list', to: 'offers#offers_list'
    end

    namespace :merchant, defaults: { format: 'json' } do
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
      get 'subscription/confirm_charge', to: 'subscriptions#confirm_charge'
      get 'partners', to: 'partners#index'
    end
  end

  # Any other routes will just render the react app
  match '*path' => 'home#index', via: [:get, :post]
end
