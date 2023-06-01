# frozen_string_literal: true
module Api
  module V2
    class OffersController < ApiMerchantBaseController
      before_action :set_offer, only: [:load_offer_details]
      before_action :find_shop, only: [:offer_settings]

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


      private

      def set_offer
        @offer = Offer.find(params[:offer][:offer_id])
      end

      def set_shop
        @icushop = Shop.find(params[:offer][:shop_id])
      end

    end
  end
end



