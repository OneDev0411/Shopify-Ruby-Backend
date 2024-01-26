# frozen_string_literal: true
module Api
  module Merchant
    class OffersController < ApiMerchantBaseController
      before_action :find_shop, only: [:offer_settings, :update_from_builder, :offers_list, :offer_stats, :offers_list_by_period, :activate, :deactivate, :duplicate, :destroy, :ab_analytics]
      before_action :set_offer, only: [:load_offer_details, :shopify_ids_from_rule]
      before_action :ensure_plan, only: [:offer_settings, :update_from_builder, :offers_list, :activate, :deactivate, :duplicate, :destroy, :ab_analytics]

      # GET /api/merchant/shop_offers
      def shop_offers
        shop_id = params[:shop_id].to_i
        offers = Offer.where(shop_id: shop_id)
        render json: offers
      end

      # POST /api/merchant/offers_list
      def offers_list
        render json: { shopify_domain: @icushop.shopify_domain, offers: @icushop.offer_data_with_stats }
      end

      # POST /api/merchant/offer_stats
      def offer_stats
        offer = @icushop.offers.find_by(id: params['offer_id'])

        if !offer.nil?

          data = {
            id: offer.id,
            title: offer.title,
            status: offer.active,
            clicks: offer.total_clicks,
            views: offer.total_views,
            revenue: offer.total_revenue,
            created_at: offer.created_at.to_datetime,
            offerable_type: offer.offerable_type
          }
          render json: { shopify_domain: @icushop.shopify_domain, offer: data }
        else
          render status: :not_found
        end

      end

      # POST /api/merchant/offers_list_by_period
      def offers_list_by_period
        render json: { shopify_domain: @icushop.shopify_domain, offers: @icushop.offer_data_with_stats_by_period(params[:period]) }
      end

      # POST /api/merchant/load_offer_details
      def load_offer_details
        begin
          library_json = @offer.library_json
          library_json[:publish_status] = @offer.active ? 'published' : 'draft'

          render json: library_json
        rescue StandardError => e
          Rails.logger.debug "Error Message: #{e.message}"
          Rollbar.error('Error', e)
        end
      end

      # POST /api/merchant/offer_settings
      # Load the generic offer settings ( the whole shop config stuff )
      def offer_settings
        begin
          incsamppro = offer_params['include_sample_products'] == 1
          render json: @icushop.offer_settings(include_sample_products: incsamppro)
        rescue StandardError => e
          Rails.logger.debug "Error Message: #{e.message}"
          Rollbar.error('Error', e)
        end
      end

      def reorder_position_order
        begin
          render json: @icushop.reorder_batch_offers(offer_params[:offers_ids])
        rescue StandardError => e
          Rails.logger.debug "Error Message: #{e.message}"
          Rollbar.error('Error', e)
        end
      end

      def activate
        begin
          if @icushop.offers_limit_reached?
            render json: { message: 'Offer limit reached' }, status: :ok and return
          end

          offer = @icushop.offers.find offer_params['offer_id']

          if offer.update({ published_at: Time.now.utc, deactivated_at: nil, active: true })

            @icushop.publish_or_delete_script_tag

            render json: { message: 'Offer published', status: 'Active' }, status: :ok
          else
            render json: { message: "Error: #{offer.errors.full_messages.first}" },
                        status: :internal_server_error
          end
        rescue ActiveRecord::RecordNotFound, StandardError => e
          Rails.logger.debug "Error Message: #{e.message}"
          Rollbar.error('Error offer_activate', e)
        end
    end

      def deactivate
        begin
          offer = @icushop.offers.find(offer_params['offer_id'])
          if offer.update({ published_at: nil, active: false })

            @icushop.publish_or_delete_script_tag

            render json: { message: 'Offer Saved As Draft',  status: 'Draft' }, status: :ok
          else
            render json: { message: "Error: #{offer.errors.full_messages.first}" }, status: :internal_server_error
          end
        rescue ActiveRecord::RecordNotFound, StandardError => e
          Rails.logger.debug "Error Message: #{e.message}"
          Rollbar.error("Error", e)
        end
      end

      # POST  /offers/:id/update/:shop_id(.:format)
      # The CURRENT offer update method
      def update_from_builder
        offer = @icushop.offers.find_by(id: params[:id])
        if offer.nil?
          return render json: { message: "Offer #{params[:id]} not found for shop ##{@icushop.id}"},
                                status: :not_found
        end

        publish_status = offer_params['publish_status']
        my_params = offer_params
        my_params.delete('publish_status')
        if publish_status == 'published' && !offer.active
          if @icushop.active_offers.count >= @icushop.subscription.offers_limit
            # TODO: reject publish
            render json: { message: 'Cannot activate offer' } and return
          end

          my_params['published_at'] = Time.now.utc
          my_params['deactivated_at'] = nil
          my_params['active'] = true
        elsif publish_status == 'draft' && offer.active
          my_params['published_at'] = nil
          my_params['active'] = false
        end

        if offer.offerable_type == 'multi'
          my_params['rules_json'] = offer_params['rules_json'].map { |rule| rule.except('uuid') }
        end

        if offer.update(my_params)

          @icushop.publish_or_delete_script_tag

          render json: { offer: offer.library_json }, status: :ok
        else
          render json: offer.errors, status: :bad_request
        end
      end

      def duplicate
        offer = @icushop.offers.find(params[:id])
        if offer.duplicate
          render json: {offers: @icushop.offer_data_with_stats}
        else
          render json: {message: "Could not duplicate #{offer.id}"}, status: 400
        end
      end

      def destroy
        offer = @icushop.offers.find(params[:id])
        offer.destroy
        old_offer_ids = @icushop.old_offers || []
        old_offer_ids << params[:id]
        @icushop.update_attribute(:old_offers, old_offer_ids.uniq)

        @icushop.publish_or_delete_script_tag

        render json: { message: "Offer Deleted", offers: @icushop.offer_data_with_stats}
      end

      def shopify_ids_from_rule
        filtered_items = @offer.rules_json.select { |item| item["rule_selector"] == params[:rule_selector] && item["item_type"] == params[:item_type] }
        item_shopify_ids = filtered_items.map { |item| item["item_shopify_id"] }
        render json: {item_shopify_ids: item_shopify_ids}
      end

      def ab_analytics
        offer = @icushop.offers.find(params[:offer_id])
        version = params[:version]

        if version == 'a'
          shown = offer.total_times_shown('orig')
          clicked = offer.total_times_clicked('orig')
        elsif version == 'b'
          shown = offer.total_times_shown('alt')
          clicked = offer.total_times_clicked('alt')
        else
          shown = offer.total_times_shown
          clicked = offer.total_times_clicked
        end

        ctr_result = offer.ctr(shown, clicked)
        ctr_str_result = offer.ctr_string(shown, ctr_result)

        render 'offers/ab_analytics', locals: { ctr_result: ctr_result, ctr_str_result: ctr_str_result }
      end

      private

      def offer_params
        params.require('offer').permit('offer_id', 'shop_id', 'include_sample_products', 'version', offers_ids: [])
      end

      def set_offer
        @offer = Offer.find(offer_params[:offer_id])
      end
    end
  end
end
