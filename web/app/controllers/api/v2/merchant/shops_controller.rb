# frozen_string_literal: true
module Api
  module V2
    module Merchant
      class ShopsController < ApiMerchantBaseController
        before_action :find_shop
        before_action :set_admin, only: [:shop_settings, :update_shop_settings]
        before_action :ensure_plan, except: [:shop_info]

        # Get /api/v2/merchant/current_shop
        def current_shop
          @shop = Shop.includes(:subscription).includes(:plan).find_by(shopify_domain: params[:shop]) if @icushop.present?

          if @shop.theme_app_extension.nil?
            @shop.theme_app_extension = ThemeAppExtension.new
          end

          if ENV['SUBSCRIPTION_TEST_MODE']&.downcase == 'true'
            Sidekiq::Client.push('class' => 'ShopWorker::ThemeUpdateJob', 'args' => [@shop.shopify_domain], 'queue' => 'themes', 'at' => Time.now.to_i + 3)
          end

          render "shops/current_shop"
        end

        # Get /api/v2/merchant/theme_app_check
        def theme_app_check
          # Sidekiq::Client.push('class' => 'ShopWorker::ThemeUpdateJob', 'args' => [@shopify_domain, true], 'queue' => 'themes', 'at' => Time.now.to_i + 3)
          # Sidekiq::Client.push('class' => 'ShopWorker::ThemeUpdateJob', 'args' => [@shopify_domain, true], 'queue' => 'themes', 'at' => Time.now.to_i + 6)
          # Sidekiq::Client.push('class' => 'ShopWorker::ThemeUpdateJob', 'args' => [@shopify_domain, true], 'queue' => 'themes', 'at' => Time.now.to_i + 9)
          head :ok and return
        end

        def shop_info
          if @icushop.present?
            render json: {shop: @icushop, path_to_cart: @icushop.path_to_cart, canonical_domain: @icushop.canonical_domain, can_run_on_checkout_page: @icushop.can_run_on_checkout_page}
          else
            render json: {message: "no shop found"}
          end
        end

        #POST /api/v2/merchant/shop_settings
        def shop_settings
          @shop_settings = @icushop.shop_settings(@admin)

          render "shops/shop_settings"
        end

        #PATCH /api/v2/merchant/update_shop_settings
        def update_shop_settings
          opts = shop_params
          @icushop.custom_ajax_dom_action = opts['custom_ajax_dom_action']
          @icushop.custom_ajax_dom_selector = opts['custom_ajax_dom_selector']
          @icushop.ajax_refresh_code = opts['ajax_refresh_code']
          @icushop.uses_ajax_cart = opts['uses_ajax_cart']
          @icushop.uses_ajax_refresh = opts['uses_ajax_refresh']
          @icushop.custom_cart_page_dom_action = opts['custom_cart_page_dom_action']
          @icushop.custom_cart_page_dom_selector = opts['custom_cart_page_dom_selector']
          @icushop.custom_product_page_dom_selector = opts['custom_product_page_dom_selector']
          @icushop.custom_product_page_dom_action = opts['custom_product_page_dom_action']
          @icushop.css_options = opts['css_options']
          @icushop.custom_bg_color = opts['css_options']['main']['backgroundColor'] || opts['custom_bg_color']
          @icushop.custom_button_bg_color = opts['css_options']['button']['backgroundColor'] || opts['custom_button_bg_color']
          @icushop.custom_button_text_color = opts['css_options']['button']['color'] || opts['custom_button_text_color']
          @icushop.custom_text_color = opts['css_options']['main']['color'] || opts['custom_text_color']
          @icushop.custom_theme_template = opts['custom_theme_template']
          @icushop.offer_css = opts['offer_css']
          @icushop.tax_percentage = opts['tax_percentage']
          @icushop.money_format = opts['money_format']
          @icushop.show_spinner = opts['show_spinner']
          @icushop.stats_from = opts['stats_from'].present? ? Time.parse(opts['stats_from']) : nil
          @icushop.default_template_settings = opts['default_template_settings'].to_h

          if opts['multi_layout'].present?
            @icushop.multi_layout = opts['multi_layout']
          end

          # ADMIN OPTS
          if @admin
            @icushop.review = opts['review']
            @icushop.soft_purge_only = opts['soft_purge_only']
            @icushop.stat_provider = opts['stat_provider']
            @icushop.variant_price_format = opts['variant_price_format']
            @icushop.builder_version = opts['builder_version']
            @icushop.can_run_on_checkout_page = opts['can_run_on_checkout_page']
            @icushop.currency_units = opts['currency_units']
            @icushop.debug_mode = opts['debug_mode']
            @icushop.extra_css_classes = opts['extra_css_classes']
            @icushop.has_autopilot = opts['has_autopilot']
            @icushop.has_geo_offers = opts['has_geo_offers']
            @icushop.has_recharge = opts['has_recharge']
            @icushop.has_remove_offer = opts['has_remove_offer']
            @icushop.has_redirect_to_product = opts['has_redirect_to_product']
            @icushop.has_reviewed = opts['has_reviewed']
            @icushop.js_version = opts['js_version']
            @icushop.has_custom_rules = opts['has_custom_rules']
            @icushop.default_template_settings = opts['default_template_settings'].to_h
          end
          if @icushop.save

            @icushop.publish_or_delete_script_tag
            @message = "Shop settings saved!"
          else
            @message = @icushop.errors.full_messages.first
          end

          if opts['update_all_offers']
            @icushop.offers.update_all(css_options: opts['css_options'], multi_layout: opts['multi_layout'])
          end

          render "shops/update_shop_settings"
        end

        #GET /api/v2/merchant/toggle_activation
        def toggle_activation
          theme_app_extension_enabled = ENV['ENABLE_THEME_APP_EXTENSION']&.downcase == 'true'
          theme_app_extension_complete = @icushop.theme_app_extension&.theme_app_complete
          theme_version_is_legacy = @icushop.theme_app_extension&.theme_version != '2.0'

          if !theme_app_extension_enabled || theme_version_is_legacy ||
            (!theme_version_is_legacy && !theme_app_extension_complete)
            job = @icushop.activated ? enqueue_job('DisableJavaScriptJob') : enqueue_job('ForcePurgeCacheJob')
            @icushop.update_columns(activated: !@icushop.activated, publish_job: job)
          else
            @icushop.update_column(activated, !@icushop.activated)
          end

          render "shops/toggle_activation"
        end

        #GET /api/v2/merchant/active_theme_for_dafault_template
        def active_theme_for_dafault_template
          begin
            res = @icushop.active_theme_for_dafault_template
            if res[:result] == true
              templatesOfCurrentTheme = ThemeSettingForTemplate.where(theme_name: res[:message])
              render json: {
                themeExist: res.dig(:result),
                shopify_theme_name: res[:message],
                templatesOfCurrentTheme: templatesOfCurrentTheme,
                theme_names_having_data: ThemeDefaultSetting.pluck(:theme_name).uniq
              }
            else
              render json: {
                themeExist: res.dig(:result),
                shopify_theme_name: res[:message]
              }
            end
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            Rollbar.error("Error", e)
            render json: {
              message: "Error: #{e.message}",
              shopify_theme_name: @icushop.shopify_theme_name || ''
            }
          end
        end



        # Gets shop sale stats. POST  /api/v2/merchant/shops_sale_stats
        def shop_sale_stats
          begin
            @sales_stats = @icushop.sales_stats(params[:period], params[:mode])
            render "shops/shop_sale_stats"
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
          end
        end

        # Gets shop sale stats. POST  /api/v2/merchant/shops_upsell_stats
        def shop_upsell_stats
          begin
            upsells_stats = @icushop.upsells_stats(params[:period], params[:mode])
            render json: {upsells_stats: upsells_stats}
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
          end
        end

        # Gets shop orders stats. POST  /api/v2/merchant/shops_orders_stats
        def shop_orders_stats
          begin
            @orders_stats = @icushop.orders_stats(params[:period], params[:mode])
            render "shops/shop_orders_stats"
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
          end
        end

        # Gets total click_revenue of offers stats data.
        # POST  /api/v2/merchant/shop_offers_stats_click_revenue
        def shop_offers_stats_click_revenue
          begin
            @stat_click_revenue = @icushop.offers_stats_click_revenue(params[:period])
            render "shops/shop_offers_stats_click_revenue"
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
          end
        end

        # Gets total times_loaded of offers stats data
        # POST /api/v2/merchant/shop_offers_stats_times_loaded
        def shops_offers_stats_times_loaded
          begin
            @stat_times_loaded = @icushop.offers_stats_times_loaded(params[:period], params[:mode])
            render "shops/shop_offers_stats_times_loaded"
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
          end
        end

        # Gets total times_clicked of offers stats data
        # POST /api/v2/merchant/shop_offers_stats_times_clicked
        def shops_offers_stats_times_clicked
          begin
            @stat_times_clicked = @icushop.offers_stats_times_clicked(params[:period], params[:mode])
            render "shops/shop_offers_stats_times_clicked"
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
          end
        end

        # Gets total times_checkedout of offers stats data
        # POST /api/v2/merchant/shop_offers_stats_times_checkedout
        def shops_offers_stats_times_checkedout
          begin
            @stat_times_checkedout = @icushop.offers_stats_times_checkedout(params[:period], params[:mode])
            render "shops/shop_offers_stats_times_checkedout"
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
          end
        end

        # Gets total times_checkedout of offers stats data
        # POST /api/v2/merchant/shop_offers_stats_times_converted
        def shops_offers_stats_times_converted
          begin
            @stat_times_converted = @icushop.offers_stats_times_converted(params[:period], params[:mode])
            puts "stat_times_converted: #{@stat_times_converted}"
            render json: {stat_times_converted: @stat_times_converted}
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
          end
        end

        # Gets all clicks stats. POST   /api/v2/merchant/shops_clicks_stats
        def shop_clicks_stats
          begin
            @clicks_stats = @icushop.clicks_stats(params[:period], params[:mode])
            render "shops/shop_clicks_stats"
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
          end
        end

        # Gets any active shop banners to be shown
        def shop_banners
          begin
            banner_data = nil
            if $redis_cache.get("shop:stats:linked:#{@icushop.id}") == '1'
              banner_data = $redis_cache.get("icu:banner:stats:updated")
            else 
              if @icushop.access_scopes.include?('read_all_orders')
                banner_data = $redis_cache.get("icu:banner:scope:approved")
              else
                banner_data = $redis_cache.get("icu:banner")
              end
            end
            if !banner_data.nil?
              banner_data  = JSON.parse(banner_data)
            else 
              banner_data = { active: false }
            end
            render json: banner_data
          rescue StandardError => e
            Rails.logger.debug "Error Message: #{e.message}"
            ErrorNotifier.call(e)
            render json: { active: false }
          end
        end
        # GET autopilot details of the shop GET /api/v2/merchant/autopilot_details
        def autopilot_details
          render json:
                   {
                     shop_autopilot: @icushop.has_autopilot?,
                     isPending: @icushop.enable_autopilot_status,
                     autopilot_offer_id: @icushop&.offers&.where(offerable_type: 'auto')&.first&.id
                   }
        end

        # POST  api/v2/merchant/enable_autopilot
        def enable_autopilot
          @icushop.async_enable_autopilot
          render json: {message: 'pending'}
        end

        # GET api/v2/merchant/enable_autopilot_status
        def enable_autopilot_status
          render json: { message: @icushop.enable_autopilot_status }
        end

        # GET api/v2/merchant/ab_test_banner_page
        def ab_test_banner_page
          if @icushop.offers_limit_reached?
            page = @icushop.ab_test_banner_page
          else
            page = ""
          end
          render json: { page: page }
        end

        # GET  api/v2/merchant/ab_test_banner_click
        def ab_test_banner_click
          if @icushop.offers_limit_reached?
            @icushop.ab_test_banner_click
          end
          head :ok
        end

        private

        def shop_params
          all_names = Shop.column_names + ['date_min', 'date_max', 'canonical_domain',
                                           'path_to_cart', 'has_branding', 'custom_theme_css',
                                           'image', 'stats_from', css_options, 'update_all_offers', 'multi_layout',
                                           'default_template_settings': [:defaultSettingsForProductPage, :defaultSettingsForAjaxCart, :defaultSettingsForCartPage, :templateForProductPage, :templateForAjaxCart, :templateForCartPage]]
          params.require('shop_attr').permit(all_names)
        end

        def set_admin
          if params['shop_attr']
            @admin = shop_params['admin']
          else
            @admin = params['admin']
          end
        end

        def css_options
          opts = %w[backgroundColor color marginTop marginBottom marginLeft marginRight borderColor
                  borderStyle width paddingLeft borderRadius paddingTop paddingRight
                  paddingBottom paddingLeft fontSize fontFamily fontWeight
                  borderWidth justifyContent letterSpacing textTransform fontWeightInPixel]
          { 'css_options' => { 'main' => opts, 'button' => opts, 'text' => opts,
                               'image' => opts, 'custom' => opts } }
        end

        def css_options
          opts = %w[backgroundColor color marginTop marginBottom marginLeft marginRight borderColor
                  borderStyle width paddingLeft borderRadius paddingTop paddingRight
                  paddingBottom paddingLeft fontSize fontFamily fontWeight
                  borderWidth justifyContent letterSpacing textTransform fontWeightInPixel]
          { 'css_options' => { 'main' => opts, 'button' => opts, 'text' => opts,
                               'image' => opts, 'custom' => opts } }
        end

        def enqueue_job(title)
          Sidekiq::Client.push('class' => "ShopWorker::#{title}", 'args' => [@icushop.id], 
                               'queue' => 'shop', 'at' => Time.now.to_i)
        end

      end
    end
  end
end
