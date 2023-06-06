module Api
  module V2
    class ProductsController < ApiV2BaseController
      before_action :set_shop, only: [:element_search]

      # POST /api/merchant/element_search
      def element_search
        result = product_params['type'] == 'product' ? product_search : collection_search
        render json: result
      end


      # GET       /products/shopify/:shopify_id(.:format)
      # Fetch current details about a product from Shopify API
      def shopify_details
       shop = Shop.find params[:shop_id]
       shop.activate_session

       # res = ShopifyAPI::Product.find(3995784710).attrs
       res = ShopifyAPI::Product.find(id: params[:shopify_id])
       render json: res
      end

      # GET       /products/multi/:shopify_id(.:format)
      # Get product details for builder
      def details_for_multi
        prod = Product.find_or_create_by(shop_id: params[:shop_id], shopify_id: params[:shopify_id])
        prod.update_from_shopify_new
        my_variants = prod.available_variants_for_handlebars
        render json: {
                id: prod.shopify_id,
                title: prod.title,
                url: prod.url,
                price: prod.price,
                medium_image_url: prod.medium_image_url,
                available_json_variants: my_variants,
                hide_variants_wrapper: my_variants.count <= 1,
                show_single_variant_wrapper: my_variants.count == 1
              }
      end

      private

      # Never trust parameters from the scary internet, only allow the white list.
      def product_params
        allowed = %w[id shop_id include_sample_products type query]
        params.require('product').permit(allowed)
      end

      def set_shop
        @icushop = Shop.find(product_params['shop_id'])
      end

      def product_search
        @icushop.shopify_graphql_product_search(product_params['query'])
      end

      def collection_search
        @icushop.shopify_graphql_collection_search(product_params['query'])
      end
    end
  end
end
