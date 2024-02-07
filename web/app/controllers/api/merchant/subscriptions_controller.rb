# frozen_string_literal: true
module Api
  module Merchant
    class SubscriptionsController < ApiMerchantBaseController
      before_action :find_shop
      before_action :set_subscription

      # PUT api/merchant/current_subscription
      def current_subscription
        render "subscriptions/current_subscription"
      end

      # PUT api/merchant/subscription
      def update
        @plan = Plan.find_by(internal_name: subscription_params[:plan_internal_name])
        if @plan.blank?
          redirect_to edit_subscription_path, notice: 'Error: Plan Not Found'
          return
        end

        if @plan.internal_name == 'plan_based_billing' && @plan.id != 19
          new_plan = Plan.find_by(id: 19)
          @plan = new_plan if new_plan.present?
        end

        if @plan.id == @subscription.plan_id && @subscription.status == 'approved'
          redirect_to root_path, notice: 'Your subscription was already updated!' and return
        end

        if @icushop.in_trial_period? && @plan.free_plan?
          @subscription.update_attribute(:free_plan_after_trial, true)
          render "subscriptions/update"
          return
        elsif @subscription.free_plan_after_trial == true
          @subscription.update_attribute(:free_plan_after_trial, false)
        end

        @subscription.shop = @icushop if @subscription.shop.nil?
        if @plan.requires_payment?
          @icushop.activate_session
          @redirect_url = @subscription.create_recurring_charge(@plan, @icushop, charge_return_url+'&host='+params[:host])
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
            @icushop.unpublish_extra_offers if @icushop.offers.present?
            @subscription.status = 'approved'
          end
        end

        @subscription.save

        render "subscriptions/update"
      end

      # GET api/merchant/subscription/confirm_charge
      def confirm_charge
        @icushop.activate_session
        begin
          ShopifyAPI::RecurringApplicationCharge.find(id: params[:charge_id]).activate
          @plan = Plan.find_by(id: 19)
          @subscription.status = 'approved'
          @subscription.plan = @plan
          @subscription.update_subscription(@plan)

          if @subscription.save
            @success = true
            if @subscription.plan.try(:id) == 19 && @subscription.bill_on.blank?
              # Shop is switching from another plan, probably the free plan.
              if @icushop.in_trial_period?
                @subscription.update_attribute(:bill_on, @subscription.days_remaining_in_trial.days.from_now)
              else
                # Charge 1 hour from now, to guard against quick install/uninstall
                Sidekiq::Client.push('class' => 'ShopWorker::AddInitialChargeToSubscriptionJob', 'args' => [@subscription.id], 'queue' => 'default', 'at' => (Time.now + 1.hour).to_i)
              end
            end
          else
            Rollbar.error('Subscription Save Error', @subscription.errors)
            @success = false
          end
        rescue Exception => e
          Rollbar.error('Charge Confirmation Error', e)
          @success = false
        end
        
        encrypted_shop_path = Base64.encode64(params[:shop]) if params[:shop]

        redirect_to(ShopifyAPI::Auth.embedded_app_url(params[:host] || encrypted_shop_path), allow_other_host: true)
      end

      private
      # Only allow a trusted parameter "white list" through.
      def subscription_params
        params.require(:subscription).permit(:plan_id, :plan_internal_name)
      end

      def set_subscription
        @subscription = @icushop.subscription || Subscription.new
      end

      def charge_return_url
        api_merchant_confirm_charge_url(shop: @icushop.shopify_domain)
      end

    end
  end
end
