import {createContext, useState} from 'react';

export default function OfferProvider({ children }) {
  const [offer, setOffer] = useState({
  offerId: undefined,
  ajax_cart: '',
  calculated_image_url: 'placebear.com/125/125',
  cart_page: '',
  checkout_page: '',
  checkout_after_accepted: false,
  css: '',
  cta_a: 'Add To Cart',
  cta_b: '',
  custom_field_name: '',
  custom_field_placeholder: '',
  custom_field_required: false,
  discount_code: '',
  discount_target_type: 'none',
  hide_variants_wrapper: '',
  id: null,
  link_to_product: true,
  multi_layout: 'compact',
  must_accept: false,
  offerable: {},
  offerable_type: 'multi',
  offerable_product_shopify_ids: [],
  offerable_product_details: [],
  included_variants: {},
  page_settings: '',
  product_image_size: 'medium',
  publish_status: 'draft',
  products_to_remove: [],
  powered_by_text_color: null,
  powered_by_link_color: null,
  remove_if_no_longer_valid: false,
  rules_json: [],
  ruleset_type: 'and',
  redirect_to_product: null,
  shop: {},
  show_product_image: true,
  show_variant_price: false,
  show_product_price: true,
  show_product_title: true,
  show_spinner: null,
  show_nothanks: false,
  show_quantity_selector: true,
  show_custom_field: false,
  show_compare_at_price: true,
  uses_ab_test: null,
  stop_showing_after_accepted: false,
  recharge_subscription_id: null,
  interval_unit: null,
  interval_frequency: null,
  text_a: 'Would you like to add a {{ product_title }}?',
  text_b: '',
  theme: 'custom',
  title: '',
  in_cart_page: true,
  in_ajax_cart: true,
  in_product_page: true,
  show_powered_by: false,
  custom_field_2_name: '',
  custom_field_2_placeholder: '',
  custom_field_2_required: '',
  custom_field_3_name: '',
  custom_field_3_placeholder: '',
  custom_field_3_required: '',
  css_options: {
    main: {
      color: "#2B3D51",
      backgroundColor: "#ECF0F1",
      marginTop: '0px',
      marginBottom: '0px',
      borderStyle: 'none',
      borderWidth: 0,
      borderRadius: 0,
    },
    text: {
      fontFamily: "Arial",
      fontSize: '16px',
    },
    button: {
      color: "#FFFFFF",
      backgroundColor: "#2B3D51",
      fontFamily: "Arial",
      fontSize: "16px",
      borderRadius: 0,
    },
  },
  custom_css: '',
  placement_setting: {
    default_product_page: true,
    default_cart_page: true,
    default_ajax_cart: true,
  },
  advanced_placement_setting: {
    custom_product_page_dom_selector: "[class*='description']",
    custom_product_page_dom_action: 'after',
    custom_cart_page_dom_selector: "form[action^='/cart']",
    custom_cart_page_dom_action: 'prepend',
    custom_ajax_dom_selector: ".ajaxcart__row:first",
    custom_ajax_dom_action: 'prepend',
  },
});

  //Called whenever the offer changes in any child component
  function updateOffer(updatedKey, updatedValue) {
    setOffer(previousState => {
      return {...previousState, [updatedKey]: updatedValue};
    });
  }

  // Called to update offerable_product_details and offerable_product_shopify_ids of offer
  function updateProductsOfOffer(data) {
    setOffer(previousState => {
      return {...previousState, offerable_product_details: [...previousState.offerable_product_details, data],};
    });
    setOffer(previousState => {
      return {
        ...previousState,
        offerable_product_shopify_ids: [...previousState.offerable_product_shopify_ids, data.id],
      };
    });
  }
  const test = "test from context"
  return (
    <OfferContext.Provider
      value={{offer, setOffer, updateOffer, updateProductsOfOffer, test}}
    >
      {children}
    </OfferContext.Provider>
  );
}

export const OfferContext = createContext({});