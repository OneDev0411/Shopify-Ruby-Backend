# frozen_string_literal: true
module Api
  module V2
    class OffersController < ApiV2BaseController
      before_action :set_offer, only: [:load_offer_details]
      before_action :set_shop, only: [:offer_settings, :update_from_builder]

      # GET /api/v2/shop_offers
      def shop_offers
        shop_id = params[:shop_id].to_i
        offers = Offer.where(shop_id: shop_id)
        render json: offers
      end

      # POST /api/v2/load_offer_details
      def load_offer_details
        library_json = @offer.library_json
        library_json[:publish_status] = @offer.active ? 'published' : 'draft'

        render json: library_json
      end

      # POST /api/v2/offer_settings
      # Load the generic offer settings ( the whole shop config stuff )
      def offer_settings
        render json: @icushop.offer_settings(include_sample_products: params[:offer][:include_sample_products] == 1)
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


      private

      def offer_params
        params.require('offer').permit('offer_id', 'shop_id', 'include_sample_products', offers_ids: [])
      end

      def set_offer
        @offer = Offer.find(offer_params[:offer_id])
      end

      def set_shop
        @icushop = Shop.find(offer_params[:shop_id])
      end

    end
  end
end



