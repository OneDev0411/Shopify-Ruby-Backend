# frozen_string_literal: true


class OffersController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  protect_from_forgery with: :null_session
  before_action :set_shop, only: [:update_from_builder, :create_from_builder, :duplicate, :destroy]

  # POST   /offers/:shop_id/builder(.:format)
  # The current offer create  method
  def create_from_builder
    offer = Offer.new(offer_params.except('publish_status'))
    offer.shop_id = @icushop.id
    offer.offerable_type = 'multi'
    offer.rules_json = offer_params['rules_json']
    if offer_params['publish_status'] == 'published'
      offer.published_at = Time.now.utc
      offer.active = true
    end

    if offer_params['save_as_default_setting']
      @icushop.offers.where.not(id: params[:id]).update(save_as_default_setting: false)

      advanced_placement_setting = offer_params[:advanced_placement_setting_attributes]

      @icushop.custom_product_page_dom_selector = advanced_placement_setting[:custom_product_page_dom_selector]
      @icushop.custom_product_page_dom_action = advanced_placement_setting[:custom_product_page_dom_action]
      @icushop.custom_cart_page_dom_selector = advanced_placement_setting[:custom_cart_page_dom_selector]
      @icushop.custom_cart_page_dom_action = advanced_placement_setting[:custom_cart_page_dom_action]
      @icushop.custom_ajax_dom_selector = advanced_placement_setting[:custom_ajax_dom_selector]
      @icushop.custom_ajax_dom_action = advanced_placement_setting[:custom_ajax_dom_action]
      @icushop.save
    end

    if offer.save
      $customerio.track(@icushop.id, 'offer created')

      if @icushop.theme_version != '2.0'
        @icushop.publish_async
      else
        @icushop.force_purge_cache
      end

      render json: { message: 'success', offer_id: offer.id, offer: offer.library_json }
    else
      render json: { message: 'could not save', errors: offer.errors }
    end
  end

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

    if offer_params['save_as_default_setting']
      @icushop.offers.where.not(id: params[:id]).update(save_as_default_setting: false)

      advanced_placement_setting = my_params[:advanced_placement_setting_attributes]

      @icushop.custom_product_page_dom_selector = advanced_placement_setting[:custom_product_page_dom_selector]
      @icushop.custom_product_page_dom_action = advanced_placement_setting[:custom_product_page_dom_action]
      @icushop.custom_cart_page_dom_selector = advanced_placement_setting[:custom_cart_page_dom_selector]
      @icushop.custom_cart_page_dom_action = advanced_placement_setting[:custom_cart_page_dom_action]
      @icushop.custom_ajax_dom_selector = advanced_placement_setting[:custom_ajax_dom_selector]
      @icushop.custom_ajax_dom_action = advanced_placement_setting[:custom_ajax_dom_action]
      @icushop.save
    end

    if offer.update(my_params)

      if @icushop.theme_version != '2.0'
        @icushop.publish_async
      else
        @icushop.force_purge_cache
      end

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

    if @icushop.theme_version != '2.0'
      @icushop.publish_async
    else
      @icushop.force_purge_cache
    end

    render json: { message: "Offer Deleted", offers: @icushop.offer_data_with_stats}
  end


  private

  def set_shop
    @icushop = Shop.find(params[:shop_id]) if params[:shop_id]
    @icushop = Shop.find_by(shopify_domain: params['shop']) if params['shop']
  end

  def offer_params
    params.require(:offer).permit(:title, :theme, :published_at, :show_product_image, :autopilot_quantity,
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
                                  :discount_allocation_method, :shop_id, :offer_id, :custom_css, :save_as_default_setting,
                                  rules_json: [:item_type, :uuid, :item_shopify_id, :rule_type,
                                               :item_shopify_title, :quantity, :item_name,
                                               :rule_selector, :item_type_name, :_destroy],
                                  included_variants: {}, css_options: {},
                                  offerable_product_shopify_ids: [],
                                  products_to_remove: [],
                                  placement_setting_attributes: [:default_product_page, :default_cart_page, :default_ajax_cart,
                                                                 :template_product_id, :template_cart_id, :template_ajax_id],
                                  advanced_placement_setting_attributes: [:id, :custom_product_page_dom_selector, :custom_product_page_dom_action,
                                                                         :custom_cart_page_dom_selector, :custom_cart_page_dom_action,
                                                                         :custom_ajax_dom_selector, :custom_ajax_dom_action,
                                                                         :advanced_placement_setting_enabled]).to_h
  end

end
