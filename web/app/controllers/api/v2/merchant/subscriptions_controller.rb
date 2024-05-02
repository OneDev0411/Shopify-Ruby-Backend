# frozen_string_literal: true
module Api
  module V2
    module Merchant
      class SubscriptionsController < ApiMerchantBaseController
        before_action :find_shop
        before_action :set_subscription

        # PUT api/v2/merchant/current_subscription
        def current_subscription
          render 'subscriptions/current_subscription'
        end

        # POST api/v2/merchant/is_subscription_unpaid
        def is_subscription_unpaid
          render json: { subscription_not_paid: @subscription.subscription_not_paid }
        end

        # PUT api/v2/merchant/subscription
        def update
          @plan = Plan.find_by(internal_name: subscription_params[:plan_internal_name])
          if @plan.blank?
            @message = 'Error: Plan Not Found'
            render 'subscriptions/update'
          end

          if @plan.internal_name == 'plan_based_billing' && @plan.id != 19
            new_plan = Plan.find_by(id: 19)
            @plan = new_plan if new_plan.present?
          end

          if @plan.id == @subscription.plan_id && @subscription.status == 'approved' && !@subscription.subscription_not_paid
            @message = 'Your subscription was already updated!'
            render 'subscriptions/update'
            return
          end

          if @icushop.in_trial_period? && @plan.free_plan?
            @subscription.update_attribute(:free_plan_after_trial, true)
            render 'subscriptions/update'
            return
          elsif @subscription.free_plan_after_trial == true
            @subscription.update_attribute(:free_plan_after_trial, false)
          end

          @subscription.shop = @icushop if @subscription.shop.nil?
          if @plan.requires_payment?
            @icushop.activate_session
            @redirect_url = @subscription.create_recurring_charge(@plan, @icushop,
                                                                  "#{charge_return_url}&host=#{params[:host]}&plan_key=#{params[:plan_key]}", params[:plan_key])
          else
            @subscription.remove_recurring_charge
          end
          @subscription.shop_id = @icushop.id
          if @plan.flex_plan?
            @subscription.plan_id ||= Plan.find_by(internal_name: 'trial_plan').id
          else
            @subscription.plan_id = @plan.id
            @subscription.update_subscription(@plan)
            if @subscription.plan.free_plan?

              redis_plan = PlanRedis.get_plan('Plan:Free:Free')
              ShopPlan.new(shop_id: shop.id, plan_key: redis_plan.key, plan_set: redis_plan.plan_set)

              @icushop.unpublish_extra_offers if @icushop.offers.present?
              @subscription.status = 'approved'
            end
          end

          @subscription.save

          render 'subscriptions/update'
        end

        # GET api/v2/merchant/subscription/confirm_charge
        def confirm_charge
          @icushop.activate_session
          begin
            ShopifyAPI::RecurringApplicationCharge.find(id: params[:charge_id]).activate
            @plan = Plan.find_by(id: 19)
            @subscription.status = 'approved'
            @subscription.plan = @plan
            @subscription.update_subscription(@plan)

            if @subscription.save
              # Save Shop plan redis instance
              redis_plan = PlanRedis.get_plan(params[:plan_key])
              ShopPlan.new(shop_id: @icushop.id, plan_key: redis_plan.key, plan_set: redis_plan.plan_set)
              @success = true
              if @subscription.plan.try(:id) == 19 && @subscription.bill_on.blank?
                # Shop is switching from another plan, probably the free plan.
                if @icushop.in_trial_period?
                  @subscription.update_attribute(:bill_on, @subscription.days_remaining_in_trial.days.from_now)
                else
                  # Charge 1 hour from now, to guard against quick install/uninstall
                  Sidekiq::Client.push('class' => 'ShopWorker::AddInitialChargeToSubscriptionJob',
                                       'args' => [@subscription.id], 'queue' => 'default',
                                       'at' => (Time.now + 1.hour).to_i)
                end
              end
            else
              Rollbar.error('Subscription Save Error', @subscription.errors)
              @success = false
            end
          rescue StandardError => e
            Rollbar.error('Charge Confirmation Error', e)
            @success = false
          end

          encrypted_shop_path = Base64.encode64(params[:shop]) if params[:shop]

          redirect_to(ShopifyAPI::Auth.embedded_app_url(params[:host] || encrypted_shop_path), allow_other_host: true)
        end

        # GET api/v2/merchant/subscription/load_plans
        def load_plans

          shop_plan = ShopPlan.get_one_with_id(@subscription.shop.id)

          plan_list =
            if shop_plan.present?
              PlanRedis.get_with_fields({ plan_set: shop_plan['plan_set'] })
            else
              PlanRedis.get_with_fields({ is_visible: 'true', is_active: 'true' })
            end

          plan_data = plan_list.map do |plan|
            plan if plan.key.include?(@subscription.shop.shopify_plan_name.gsub(' ', '_'))
          end.first

          render json: { plan_list: plan_list, plan_data: plan_data }
        end

        private

        # Only allow a trusted parameter "white list" through.
        def subscription_params
          params.require(:subscription).permit(:plan_id, :plan_internal_name, :plan_key)
        end

        def set_subscription
          @subscription = @icushop.subscription || Subscription.new
        end

        def charge_return_url
          api_v2_merchant_confirm_charge_url(shop: @icushop.shopify_domain)
        end

      end
    end
  end
end
