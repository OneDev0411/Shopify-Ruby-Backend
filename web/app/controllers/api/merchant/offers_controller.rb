# frozen_string_literal: true
module Api
  module Merchant
    class OffersController < ApiMerchantBaseController
      before_action :find_shop, only: [:offer_settings, :update_from_builder, :offers_list, :activate, :deactivate, :duplicate, :destroy]
      before_action :set_offer, only: [:load_offer_details, :shopify_ids_from_rule]

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
            @icushop.publish_async

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
            @icushop.publish_async
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
          @icushop.publish_async
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
        @icushop.publish_async
        render json: { message: "Offer Deleted", offers: @icushop.offer_data_with_stats}
      end

      def shopify_ids_from_rule   
        filtered_items = @offer.rules_json.select { |item| item["rule_selector"] == params[:rule_selector] && item["item_type"] == params[:item_type] }
        item_shopify_ids = filtered_items.map { |item| item["item_shopify_id"] }
        render json: {item_shopify_ids: item_shopify_ids}
      end

      private

      def offer_params
        params.require('offer').permit('offer_id', 'shop_id', 'include_sample_products', offers_ids: [])
      end

      def set_offer
        @offer = Offer.find(offer_params[:offer_id])
      end
    end
  end
end



