# frozen_string_literal: true
module Api
  module V2
    module Merchant
      class PlansController < ApiMerchantBaseController
        before_action :find_shop, only: %i[index view create duplicate update destroy]

        # ADMIN - Listing all plans READY TO TEST
        def index
          return unless @admin

          plan_list = PlanRedis.all
          render json: plan_list
        end

        # ADMIN -  Viewing a plan READY TO TEST
        def view
          return unless @admin

          @redis_plan = PlanRedis.get_plan(params[:key])
          render @redis_plan
        end

        def create
          return unless @admin

          @redis_plan = PlanRedis.new(key: plan_params['key'], price: plan_params['price'],
                                      plan_set: plan_params['plan_set'], features: plan_params['features'])
          render json: @redis_plan, status: :created
        end

        # ADMIN -  Cloning a plan
        def duplicate
          return unless @admin

          new_plan = PlanRedis.duplicate(plan_params['key'])
          render json: new_plan, status: :created
        end

        # ADMIN -  Updating a plan
        def update
          return unless @admin

          @redis_plan = PlanRedis.get_plan(params[:key])
          @redis_plan.update(plan_params)
          head :no_content
        end

        def destroy
          head :no_content
        end

        # Fetch plans based on different keys
        def filter
        # plans by shop

          plans_list = PlanRedis.get_with_fields(plan_filter_params)

          render json: plans_list, status: :ok
        end

        private

        def plan_params
          params.require('plan').permit('key', 'price', 'plan_set', 'features', 'is_active', 'is_visible')
        end

        def plan_filter_params
          params.require('plan').permit('key', 'price', 'plan_set', 'is_active', 'is_visible')
        end

        def set_admin
          @admin = params.key?(:admin) ? true : false
        end

      end
    end
  end
end

