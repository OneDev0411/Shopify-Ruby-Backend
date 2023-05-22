# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'home#index'

  mount ShopifyApp::Engine, at: '/api'
  get '/api', to: redirect(path: '/') # Needed because our engine root is /api but that breaks FE routing

  # If you are adding routes outside of the /api path, remember to also add a proxy rule for
  # them in web/frontend/vite.config.js

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

    # API V1
  namespace :api do
    namespace :v1, defaults: { format: 'json' } do
      post 'offer_activate', to: 'offers#activate'
      post 'offers_list', to: 'offers#offers_list'
    end

    namespace :v2, defaults: { format: 'json' } do
      post 'element_search', to: 'products#element_search'
      post 'load_offer_details', to: 'offers#load_offer_details'
      post 'offer_settings', to: 'offers#offer_settings'
      post 'shop_settings', to: 'shops#shop_settings'
      get 'shop_offers', to: 'offers#shop_offers'
      get 'get_shop', to: 'shops#get_shop'
      get '/products/shopify/:shopify_id' => 'products#shopify_details'
      get '/products/multi/:shopify_id' => 'products#details_for_multi'
    end
  end

  # Any other routes will just render the react app
  match '*path' => 'home#index', via: [:get, :post]
end
