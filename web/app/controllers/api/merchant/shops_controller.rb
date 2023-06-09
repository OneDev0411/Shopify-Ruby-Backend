# frozen_string_literal: true
module Api
  module Merchant
    class ShopsController < ApiMerchantBaseController
      before_action :find_shop
      before_action :ensure_plan

      # Get /api/merchant/current_shop
      def current_shop
        @shop = Shop.includes(:subscription).includes(:plan).find_by(shopify_domain: params[:shop]) if @icushop.present?
        render "shops/current_shop"
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
        end
        if @icushop.save
          @icushop.publish_async  # trigger update
  
          @message = "Shop Settings Saved"
        else
          @message = "Error! "
        end
        render "shops/update_shop_settings"
      end

      #GET /api/merchant/toggle_activation
      def toggle_activation
        @icushop.update_attribute(:activated, !@icushop.activated)
        @icushop.force_purge_cache
        render "shops/toggle_activation"
      end

      private

      def shop_params
        all_names = Shop.column_names + ['date_min', 'date_max', 'shop_id', 'canonical_domain',
                                         'path_to_cart', 'has_branding', 'custom_theme_css',
                                         'image', 'stats_from', css_options]
        params.require('shop_attr').permit(all_names)
      end

      def set_admin
        @admin = shop_params['admin'] || params['admin']
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
