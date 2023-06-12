# frozen_string_literal: true

module Api
  module Merchant
    class ApiMerchantBaseController < ActionController::API
      before_action :allow_cors
  
      protected
      def allow_cors
        response.headers['Access-Control-Allow-Origin'] = ENV['FRONTEND_URL']
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = 'accept, content-type'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH'
      end

      def find_shop
        if params[:shopify_domain].present? && params[:shopify_domain].class == String
          @icushop = Shop.find_by(shopify_domain: params['shopify_domain'])
        else
          @icushop = Shop.find(params['shop_id'])
        end
      end

      def ensure_plan
        return true if @admin || (@icushop.in_trial_period?) || (@icushop.plan.present? &&
                                  @icushop.subscription.status == 'approved')
    
        @message = if @icushop&.plan.nil?
                    'Please Choose A Plan'
                  else
                    'Your subscription is not active - please re-confirm your plan on this page.'
                  end
        render "shops/ensure_plan"
      end
  
    end # class ends
  end
end
