class ProxyController < ApplicationController
  require 'openssl'
  require 'rack/utils'

  SHARED_SECRET = ENV['SHOPIFY_APP_SECRET']

  before_action :verify_signature

  def all_offers
    offers = create_offers_res
    offer_settings = create_shop_settings_res

    render json: { shopify_domain: @shopify_domain, offers: offers, offer_settings: offer_settings }
  end

  def shop_collections
    collections = Collection.where(shop_id: @icushop.id)

    render json: { shopify_domain: @shopify_domain, collection: collections }
  end

  private

  def verify_signature
    query_string = request.query_string
    query_hash = Rack::Utils.parse_query(query_string)

    signature = query_hash.delete("signature")
    sorted_params = query_hash.collect{ |k, v| "#{k}=#{Array(v).join(',')}" }.sort.join
    calculated_signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), SHARED_SECRET, sorted_params)
    raise 'Invalid signature' unless ActiveSupport::SecurityUtils.secure_compare(signature, calculated_signature)

    query_string = request.query_string
    query_hash = Rack::Utils.parse_query(query_string)

    @shopify_domain = query_hash["shop"]
    @icushop = Shop.find_by(shopify_domain: @shopify_domain)
  end

  def create_offers_res
    offers = []

    @icushop.offers.where(active: true).each do | offer |
      new_offer = {
        id: offer.id,
        rules: offer.rules_json,
        text_a:  (offer.offer_text || ''),
        text_b:  (offer.offer_text_alt || ''),
        cta_a:  offer.offer_cta,
        cta_b:  offer.offer_cta_alt,
        css: offer.offer_css,
        show_product_image: offer.show_product_image,
        product_image_size: offer.product_image_size || 'medium',
        link_to_product: offer.link_to_product,
        theme: offer.theme,
        shop: {
          path_to_cart: @icushop.path_to_cart,
          extra_css_classes: @icushop.extra_css_classes,
        },
        show_nothanks: offer.show_nothanks || false,
        calculated_image_url:  offer.calculated_image_url ,
        hide_variants_wrapper: offer.offerable_type == 'product' && offer.product.available_json_variants.count == 1,
        show_variant_price: offer.show_variant_price || false,
        uses_ab_test: offer.uses_ab_test?,
        ruleset_type: offer.ruleset_type,
        offerable_type:  offer.offerable_type,
        offerable_product_shopify_ids: offer.offerable_product_shopify_ids.compact,
        offerable_product_details: offer.offerable_product_details(true, true),
        checkout_after_accepted: offer.checkout_after_accepted || false,
        discount_code:  offer.discount_target_type == 'code' ? offer.discount_code : false,
        stop_showing_after_accepted: offer.stop_showing_after_accepted || false,
        products_to_remove: offer.product_ids_to_remove,
        show_powered_by: @icushop.subscription.has_branding,
        show_spinner: @icushop.show_spinner?,
        must_accept: offer.must_accept || false,
        show_quantity_selector: offer.show_quantity_selector || false,
        powered_by_text_color: offer.powered_by_text_color,
        powered_by_link_color: offer.powered_by_link_color,
        multi_layout: offer.multi_layout || 'compact',
        show_custom_field: offer.show_custom_field || false,
        custom_field_name: offer.custom_field_name,
        custom_field_placeholder: offer.custom_field_placeholder,
        custom_field_required: offer.custom_field_required || false,
        custom_field_2_name: offer.custom_field_2_name,
        custom_field_2_placeholder: offer.custom_field_2_placeholder,
        custom_field_2_required: offer.custom_field_2_required || false,
        custom_field_3_name: offer.custom_field_3_name,
        custom_field_3_placeholder: offer.custom_field_3_placeholder,
        custom_field_3_required: offer.custom_field_3_required || false,
        show_compare_at_price: offer.show_compare_at_price?,
        redirect_to_product: @icushop.has_redirect_to_product? && offer.redirect_to_product?,
        show_product_price: offer.show_product_price?,
        show_product_title: offer.show_product_title?,
        in_cart_page:  offer.in_cart_page?,
        in_ajax_cart:  offer.in_ajax_cart?,
        in_product_page:  offer.in_product_page?,
        css_options:  offer.css_options || {},
        custom_css: offer.custom_css
      }

      if offer.winner.present?
        new_offer[:winning_version] = offer.winner
      end

      if offer.offerable_type == 'auto'
        new_offer[:autopilot_data] = @icushop.autopilot_data
        new_offer[:autopilot_quantity] = offer.autopilot_quantity || 1
      end

      if @icushop.has_recharge && offer.recharge_subscription_id.present?
        new_offer[:has_recharge]             = @icushop.has_recharge && offer.recharge_subscription_id.present?
        new_offer[:interval_unit]            = offer.interval_unit
        new_offer[:interval_frequency]       = offer.interval_frequency.to_i
        new_offer[:recharge_subscription_id] = offer.recharge_subscription_id.to_i
      end

      if @icushop.has_remove_offer
        new_offer[:remove_if_no_longer_valid] = offer.remove_if_no_longer_valid
      end

      offers << new_offer
    end

    offers
  end

  def create_shop_settings_res
    {
      ajax_refresh_code: @icushop.ajax_refresh_code,
      canonical_domain: @icushop.canonical_domain,
      has_recharge: @icushop.has_recharge,
      has_remove_offer: @icushop.has_remove_offer,
      has_geo_offers: @icushop.has_geo_offers,
      uses_ajax_cart: @icushop.uses_ajax_cart,
      has_shopify_multicurrency: @icushop.enabled_presentment_currencies.present? && @icushop.enabled_presentment_currencies.length > 0,
      show_spinner: @icushop.show_spinner?,
      uses_customer_tags: @icushop.uses_customer_tags? || false,
    }
  end

  def theme_app_completed
    render json: { theme_app_completed: @icushop.theme_app_extension.theme_app_complete }
  end
end
