# frozen_string_literal: true


class OffersController < AuthenticatedController

  before_action :offer_params, only: [:update_from_builder]
  before_action :set_shop, only: [:update_from_builder]

  # POST  api/offers/:id/update/:shop_id(.:format)
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

  def set_shop
    @icushop = Shop.find(params[:shop_id])
  end

  def offer_params
    params.permit(:title, :theme, :published_at, :show_product_image, :autopilot_quantity,
                                  :product_id, :offer_text, :custom_field_required, :custom_field_2_name,
                                  :custom_field_2_placeholder, :custom_field_2_required, :custom_field_3_name,
                                  :custom_field_3_placeholder, :custom_field_3_required, :discount_code,
                                  :multi_layout, :publish_status, :redirect_to_product,
                                  :show_product_title, :show_product_price, :show_compare_at_price,
                                  :show_nothanks, :show_quantity_selector, :in_cart_page, :in_ajax_cart,
                                  :in_product_page, :offer_css, :offer_cta,
                                  :offer_cta_alt, :offer_text_alt, :active, :offerable_type,
                                  :offerable_id, :show_variant_price, :collection_layout, :excluded_tags,
                                  :stop_showing_after_accepted, :ruleset_type, :link_to_product,
                                  :interval_unit, :id,
                                  :interval_frequency, :checkout_after_accepted, :recharge_subscription_id,
                                  :remove_if_no_longer_valid, :use_bigger_image, :use_huge_image,
                                  :offerable_shopify_id, :offerable_shopify_title, :cart_page,
                                  :ajax_cart, :checkout_page, :must_accept, :product_image_size,
                                  :show_custom_field, :custom_field_name, :custom_field_placeholder,
                                  :discount_target_type, :discount_value, :discount_value_type,
                                  :discount_target_selection, :discount_prerequisite_quantity,
                                  :discount_allocation_method, :shop_id, :offer_id,
                                  rules_json: [:item_type, :uuid, :item_shopify_id, :rule_type,
                                               :item_shopify_title, :quantity, :item_name,
                                               :rule_selector, :item_type_name, :_destroy],
                                  included_variants: {},
                                  offerable_product_shopify_ids: [],
                                  products_to_remove: []).to_h
  end
 
end
