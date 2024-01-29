# frozen_string_literal: true
module Api
  module Merchant
    class ShopsController < ApiMerchantBaseController
      before_action :find_shop
      before_action :set_admin, only: [:shop_settings, :update_shop_settings]
      before_action :ensure_plan, except: [:shop_info]

      # Get /api/merchant/current_shop
      def current_shop
        @shop = Shop.includes(:subscription).includes(:plan).find_by(shopify_domain: params[:shop]) if @icushop.present?

        if @shop.theme_app_extension.nil?
          @shop.theme_app_extension = ThemeAppExtension.new
          @shop.theme_app_extension_check
        end

        render "shops/current_shop"
      end

      def shop_info
        if @icushop.present?
          render json: {shop: @icushop, path_to_cart: @icushop.path_to_cart, canonical_domain: @icushop.canonical_domain, can_run_on_checkout_page: @icushop.can_run_on_checkout_page}
        else
          render json: {message: "no shop found"}
        end
      end

      #POST /api/merchant/shop_settings
      def shop_settings
        @shop_settings = @icushop.shop_settings(@admin)

        render "shops/shop_settings"
      end

      #PATCH /api/merchant/update_shop_settings
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
        render "shops/update_shop_settings"
      end

      #GET /api/merchant/toggle_activation
      def toggle_activation
        @icushop.update_attribute(:activated, !@icushop.activated)
        @icushop.force_purge_cache
        render "shops/toggle_activation"
      end

      #GET /api/merchant/active_theme_for_dafault_template
      def active_theme_for_dafault_template
        begin
          res = @icushop.active_theme_for_dafault_template
          if res[:result] == true
            templatesOfCurrentTheme = ThemeSettingForTemplate.where(theme_name: res[:message])
            render json: {
              themeExist: res[:result],
              shopify_theme_name: res[:message],
              templatesOfCurrentTheme: templatesOfCurrentTheme,
              theme_names_having_data: ThemeDefaultSetting.pluck(:theme_name).uniq
            }
          else
            render json: {
              themeExist: res[:result],
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



       # Gets shop sale stats. POST  /api/merchant/shops_sale_stats
      def shop_sale_stats
        begin
          @sales_stats = @icushop.sales_stats(params[:period])
          render "shops/shop_sale_stats"
        rescue StandardError => e
          Rails.logger.debug "Error Message: #{e.message}"
          Rollbar.error("Error", e)
        end
      end

      # Gets shop orders stats. POST  /api/merchant/shops_orders_stats
      def shop_orders_stats
      begin
        @orders_stats = @icushop.orders_stats(params[:period])
        render "shops/shop_orders_stats"
      rescue StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error("Error", e)
      end
    end

    # Gets total click_revenue of offers stats data.
    # POST  /api/merchant/shop_offers_stats_click_revenue
    def shop_offers_stats_click_revenue
      begin
        @stat_click_revenue = @icushop.offers_stats_click_revenue(params[:period])
        render "shops/shop_offers_stats_click_revenue"
      rescue StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error("Error", e)
      end
    end

    # Gets total times_loaded of offers stats data
    # POST /api/merchant/shop_offers_stats_times_loaded
    def shops_offers_stats_times_loaded
      begin
        @stat_times_loaded = @icushop.offers_stats_times_loaded(params[:period])
        render "shops/shop_offers_stats_times_loaded"
      rescue StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error("Error", e)
      end
    end

    # Gets total times_clicked of offers stats data
    # POST /api/merchant/shop_offers_stats_times_clicked
    def shops_offers_stats_times_clicked
      begin
        @stat_times_clicked = @icushop.offers_stats_times_clicked(params[:period])
        render "shops/shop_offers_stats_times_clicked"
      rescue StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error("Error", e)
      end
    end

    # Gets total times_checkedout of offers stats data
    # POST /api/merchant/shop_offers_stats_times_checkedout
    def shops_offers_stats_times_checkedout
      begin
        @stat_times_checkedout = @icushop.offers_stats_times_checkedout(params[:period])
        render "shops/shop_offers_stats_times_checkedout"
      rescue StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error("Error", e)
      end
    end

    # Gets all clicks stats. POST   /api/merchant/shops_clicks_stats
    def shop_clicks_stats
      begin
        @clicks_stats = @icushop.clicks_stats(params[:period])
        render "shops/shop_clicks_stats"
      rescue StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error("Error", e)
      end
    end

    # GET autopilot details of the shop GET /api/merchant/autopilot_details
    def autopilot_details
      render json:
      {
        shop_autopilot: @icushop.has_autopilot?,
        isPending: @icushop.enable_autopilot_status,
        autopilot_offer_id: @icushop&.offers&.where(offerable_type: 'auto')&.first&.id
      }
    end

    # POST  api/merchant/enable_autopilot
    def enable_autopilot
      @icushop.async_enable_autopilot
      render json: {message: 'pending'}
    end

    # GET api/merchant/enable_autopilot_status
    def enable_autopilot_status
      render json: { message: @icushop.enable_autopilot_status }
    end

      private

      def shop_params
        all_names = Shop.column_names + ['date_min', 'date_max', 'canonical_domain',
                                         'path_to_cart', 'has_branding', 'custom_theme_css',
                                         'image', 'stats_from', css_options,
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
    end
  end
end
