import { useState } from "react";
import { OFFER_CREATE_URL, OFFER_DETAILS_URL } from "../shared/constants/EditOfferOptions.js";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch.js";
import { useSelector } from "react-redux";

export const useOffer = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const shopAndHost = useSelector(state => state.shopAndHost);
  const authFetch = useAuthenticatedFetch(shopAndHost.host);

  const fetchOffer = async (offerID, shop) => {
    setIsPending(true)
    const response = await authFetch(OFFER_DETAILS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({offer: {offer_id: offerID}, shop}),
    });
    setIsPending(false)
    return await response.json();
  };

  const saveOffer = async (offer, location, shop, status) => {

    let ots = populateOTS(offer, shop.has_recharge, status)
    let responseData

    try {
      const response = await authFetch(`/api/offers/${offer.id}/update/${shop.shop_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({offer: ots, shop: shopAndHost.shop, host: shopAndHost.host})
      });
      const responseData = await response.json();
      for(let i=0; i<responseData.offer.offerable_product_details.length; i++) {
        responseData.offer.offerable_product_details[i].preview_mode = true;
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return responseData;
  };

  const populateOTS = (offer, hasRecharge, status) => {

    let placement_setting;
    let save_as_default_setting;
    if(offer.in_product_page && offer.in_cart_page) {
      placement_setting = {
        default_product_page: offer.placement_setting?.default_product_page,
        default_cart_page: offer.placement_setting?.default_cart_page,
        default_ajax_cart: true,
        template_product_id: offer.placement_setting?.template_product_id,
        template_cart_id: offer.placement_setting?.template_cart_id,
        template_ajax_id: null,
      }
    }
    else if (offer.in_ajax_cart && offer.in_cart_page) {
      placement_setting = {
        default_product_page: true,
        default_cart_page: offer.placement_setting?.default_cart_page,
        default_ajax_cart: offer.placement_setting?.default_ajax_cart,
        template_product_id: null,
        template_cart_id: offer.placement_setting?.template_cart_id,
        template_ajax_id: offer.placement_setting?.template_ajax_id,
      }
    }
    else if (offer.in_cart_page) {
      placement_setting = {
        default_product_page: true,
        default_cart_page: offer.placement_setting?.default_cart_page,
        default_ajax_cart: true,
        template_product_id: null,
        template_cart_id: offer.placement_setting?.template_cart_id,
        template_ajax_id: null,
      }
    }
    else if (offer.in_product_page) {
      placement_setting = {
        default_product_page: offer.placement_setting?.default_product_page,
        default_cart_page: true,
        default_ajax_cart: true,
        template_product_id: offer.placement_setting?.default_product_page,
        template_cart_id: null,
        template_ajax_id: null,
      }
    }
    else if (offer.in_ajax_cart) {
      placement_setting = {
        default_product_page: true,
        default_cart_page: true,
        default_ajax_cart: offer.placement_setting?.default_ajax_cart,
        template_product_id: null,
        template_cart_id: null,
        template_ajax_id: offer.placement_setting?.template_ajax_id,
      }
    }
    if(offer.advanced_placement_setting?.advanced_placement_setting_enabled) {
      save_as_default_setting = offer.save_as_default_setting;
    }
    else {
      save_as_default_setting = false;
    }
    let ots = {
      active: status,
      checkout_after_accepted: offer.checkout_after_accepted,
      custom_field_name: offer.custom_field_name,
      custom_field_placeholder: offer.custom_field_placeholder,
      custom_field_required: offer.custom_field_required,
      custom_field_2_name: offer.custom_field_2_name,
      custom_field_2_placeholder: offer.custom_field_2_placeholder,
      custom_field_2_required: offer.custom_field_2_required,
      custom_field_3_name: offer.custom_field_3_name,
      custom_field_3_placeholder: offer.custom_field_3_placeholder,
      custom_field_3_required: offer.custom_field_3_required,
      discount_target_type: offer.discount_target_type,
      discount_code: offer.discount_code,
      included_variants: offer.included_variants,
      link_to_product: offer.link_to_product,
      multi_layout: offer.multi_layout,
      must_accept: offer.must_accept,
      offerable_product_shopify_ids: offer.offerable_product_shopify_ids,
      offerable_type: offer.offerable_type,
      autopilot_quantity: offer.autopilot_quantity,
      excluded_tags: offer.excluded_tags,
      offer_css: offer.css,
      offer_cta: offer.cta_a,
      offer_cta_alt: offer.uses_ab_test ? offer.cta_b : '',
      offer_text: offer.text_a,
      offer_text_alt: offer.uses_ab_test ? offer.text_b : '',
      product_image_size: offer.product_image_size,
      products_to_remove: offer.products_to_remove,
      publish_status: status ? "published" : "draft",
      remove_if_no_longer_valid: offer.remove_if_no_longer_valid,
      redirect_to_product: offer.redirect_to_product,
      rules_json: offer.rules_json,
      ruleset_type: offer.ruleset_type,
      show_variant_price: offer.show_variant_price,
      show_product_image: offer.show_product_image,
      show_product_title: offer.show_product_title,
      show_product_price: offer.show_product_price,
      show_compare_at_price: offer.show_compare_at_price,
      show_nothanks: offer.show_nothanks,
      show_quantity_selector: offer.show_quantity_selector,
      show_custom_field: offer.show_custom_field,
      stop_showing_after_accepted: offer.stop_showing_after_accepted,
      theme: offer.theme,
      title: offer.title,
      in_cart_page: offer.in_cart_page,
      in_ajax_cart: offer.in_ajax_cart,
      in_product_page: offer.in_product_page,
      css_options: offer.css_options,
      custom_css: offer.custom_css,
      placement_setting_attributes: placement_setting,
      save_as_default_setting: save_as_default_setting,
      advanced_placement_setting_attributes: offer.advanced_placement_setting
    };

    if (hasRecharge && offer.recharge_subscription_id) {
      ots.recharge_subscription_id = offer.recharge_subscription_id;
      ots.interval_unit = offer.interval_unit;
      ots.interval_frequency = offer.interval_frequency;
    }

    return ots
  }
  const createOffer = async (offer, shop, status) => {
    let responseData = {};

    let ots = populateOTS(offer, shop.has_recharge, status)

    try {
      const response = await authFetch(`${OFFER_CREATE_URL}${shop?.shop_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({offer: ots})
      });
      responseData = await response.json();
    } catch (error) {
      console.log('Error:', error);
    }

    return responseData
  }

  return { fetchOffer, saveOffer, createOffer, isPending }
};
