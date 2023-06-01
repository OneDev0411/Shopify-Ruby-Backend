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
        render json: @icushop.shop_settings(@admin)
      end

      #PATCH /api/merchant/update_shop_settings
      def update_shop_settings
        opts = shop_params
        @icushop.custom_ajax_dom_action = opts['custom_ajax_dom_action']
        @icushop.custom_ajax_dom_selector = opts['custom_ajax_dom_selector']
        @icushop.custom_cart_page_dom_action = opts['custom_cart_page_dom_action']
        @icushop.custom_cart_page_dom_selector = opts['custom_cart_page_dom_selector']
        @icushop.custom_product_page_dom_selector = opts['custom_product_page_dom_selector']
        @icushop.custom_product_page_dom_action = opts['custom_product_page_dom_action']
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
      end

      private

      def shop_params
        all_names = Shop.column_names + ['date_min', 'date_max', 'shop_id', 'canonical_domain',
                                         'path_to_cart', 'has_branding', 'custom_theme_css',
                                         'image', 'stats_from']
        params.require('shop').permit(all_names)
      end

      def set_admin
        @admin = shop_params['admin'] || params['admin']
      end

    end
  end
end
