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
  end

  # Any other routes will just render the react app
  match '*path' => 'home#index', via: [:get, :post]
end
