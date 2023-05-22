module Api
  module V2
    class ShopsController < ApiV2BaseController
      before_action :set_shop, only: [:shop_settings]

      # GET /api/v2/get_shop
      def get_shop
        shop = Shop.find_by(name: params["shop"])
        return render json: {message: "no shop found"} if shop.nil?
        render json: {shop: shop}
      end
<<<<<<< Updated upstream

      # POST /api/v1/shop_settings
    def shop_settings
      render json: @icushop.shop_settings(@admin)
    end


      private

      def set_shop
        @icushop = Shop.find(params[:shop][:shop_id])
      end

=======
>>>>>>> Stashed changes
    end
  end
end
