# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'splash#index'

  mount ShopifyApp::Engine, at: '/api'
  get '/api', to: redirect(path: '/') # Needed because our engine root is /api but that breaks FE routing

  # If you are adding routes outside of the /api path, remember to also add a proxy rule for
  # them in web/frontend/vite.config.js

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get ShopifyApp.configuration.login_url, to: 'shopify_app/sessions#new', as: :login

  get '/confirm_from_outside', to: 'js#confirm_from_outside'

  post 'api/v2/offers/create/:shop_id', to: 'offers#create_from_builder'
  patch 'api/v2/offers/:id/update/:shop_id', to: 'offers#update_from_builder'

    # API V1
  namespace :api do
    namespace :v2 do
      namespace :merchant, defaults: { format: 'json' } do
        #Session Storage Endpoints Routes
        resources :sessions, only: [:create, :show, :destroy] do
          collection do
            post :store_session, action: :create
            delete :delete_sessions, action: :delete_multiple
            get :find_by_shop, action: :find_sessions_by_shop
          end
          member do
            get :load_session, action: :show
            delete :delete_session, action: :delete
          end
        end
        post 'offers/load_ab_analytics', to: 'offers#ab_analytics'
        post 'element_search', to: 'products#element_search'
        post 'load_offer_details', to: 'offers#load_offer_details'
        post 'offer_settings', to: 'offers#offer_settings'
        post 'shop_settings', to: 'shops#shop_settings'
        get 'shop_banners', to: 'shops#shop_banners'
        get 'shop_offers', to: 'offers#shop_offers'
        get '/products/shopify/:shopify_id' => 'products#shopify_details'
        get '/products/multi/:shopify_id' => 'products#details_for_multi'
        patch 'update_shop_settings', to: 'shops#update_shop_settings'
        get 'current_shop', to: 'shops#current_shop'
        get 'toggle_activation', to: 'shops#toggle_activation'
        put 'subscription', to: 'subscriptions#update'
        get 'current_subscription', to: 'subscriptions#current_subscription'
        post 'is_subscription_unpaid', to: 'subscriptions#is_subscription_unpaid'
        get 'subscription/confirm_charge', to: 'subscriptions#confirm_charge', as: :confirm_charge
        get 'subscription/load_plans', to: 'subscriptions#load_plans'
        get 'partners', to: 'partners#index'
        get 'shop_info' => 'shops#shop_info'
        get 'autopilot_details', to: 'shops#autopilot_details'
        post 'enable_autopilot', to: 'shops#enable_autopilot'
        get 'enable_autopilot_status', to: 'shops#enable_autopilot_status'
        get 'ab_test_banner_page', to: 'shops#ab_test_banner_page'
        get 'ab_test_banner_click', to: 'shops#ab_test_banner_click'
        get 'single_offer', to: 'offers#single_offer'
        post 'offers_list', to: 'offers#offers_list'
        post 'offer_stats', to: 'offers#offer_stats'
        post 'offers_list_by_period', to: 'offers#offers_list_by_period'
        post 'offer_activate', to: 'offers#activate'
        post 'offer_deactivate', to: 'offers#deactivate'
        post 'shop_sale_stats', to: 'shops#shop_sale_stats'
        post 'shop_upsell_stats', to: 'shops#shop_upsell_stats'
        post 'shop_orders_stats', to: 'shops#shop_orders_stats'

        post 'shop_offers_stats_click_revenue', to: 'shops#shop_offers_stats_click_revenue'
        post 'shop_offers_stats_times_loaded', to: 'shops#shops_offers_stats_times_loaded'
        post 'shop_offers_stats_times_clicked', to: 'shops#shops_offers_stats_times_clicked'
        post 'shop_offers_stats_times_checkedout', to: 'shops#shops_offers_stats_times_checkedout'

        post 'shop_clicks_stats', to: 'shops#shop_clicks_stats'
        post '/offers/:id/duplicate', to: 'offers#duplicate'
        delete '/offers/:id', to: 'offers#destroy'
        post 'offer/shopify_ids_from_rule', to: 'offers#shopify_ids_from_rule'
        get 'active_theme_for_dafault_template', to: 'shops#active_theme_for_dafault_template'

        get 'plans', to: 'plans#index'
        get 'plans/:key', to: 'plans#view'
        post 'plans', to: 'plans#create'
        patch 'plans', to: 'plans#update'
        post 'plans/clone', to: 'plans#duplicate'
        post 'plans/filter', to: 'plans#filter'

      end
    end
  end

  # Mandatory Shopify Webhooks (don't remove them even if not used)
  post 'custom_webhooks/redact_shop', to: 'custom_webhooks#redact_shop'
  post 'custom_webhooks/request_customer', to: 'custom_webhooks#request_customer'
  post 'custom_webhooks/redact_customer', to: 'custom_webhooks#redact_customer'


  get 'js/offer/all_offers', to: 'proxy#all_offers'
  get 'js/offer/shop_collections', to: 'proxy#shop_collections'
  get 'js/offer/theme_app_completed', to: 'proxy#theme_app_completed'
  get 'js/offer/customer_tags', to: 'proxy#customer_tags'

  get '/js/offer', to: 'js#offer'

  # Any other routes will just render the react app
  match '*path' => 'splash#index', via: [:get, :post]
end
