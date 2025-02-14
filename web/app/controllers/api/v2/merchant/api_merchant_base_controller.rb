# frozen_string_literal: true

module Api
  module V2
    module Merchant
      class ApiMerchantBaseController < ActionController::API
        before_action :allow_cors

        protected
        def allow_cors
          response.headers['Access-Control-Allow-Origin'] = '*'
          response.headers['Access-Control-Allow-Credentials'] = 'true'
          response.headers['Access-Control-Allow-Headers'] = 'accept, content-type'
          response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH'
        end

        def find_shop
          if params[:shop].present?
            @icushop = Shop.find_by(shopify_domain: params['shop'])
          else
            @icushop = Shop.find(params['shop_id'])
          end
        end

        def ensure_plan
          if (!@icushop.in_trial_period? && (@icushop.plan.present? && @icushop.plan.internal_name == 'trial_plan')) || @icushop&.plan.nil?
            @icushop.plan = Plan.find_by(:internal_name => 'free_plan')
            @icushop.subscription.update_attribute(:free_plan_after_trial, false)
            @icushop.unpublish_extra_offers
          end

          if @icushop.subscription.status == 'pending_charge_approval'
            @icushop.subscription.shopify_subscription_status
          end

          return true if @admin || (@icushop.in_trial_period?) || (@icushop.plan.present? && @icushop.subscription.status == 'approved')
        end

      end
    end
  end
end
