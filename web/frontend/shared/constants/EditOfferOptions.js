export const AutopilotQuantityOptions = [
  { label: '1 (recommended)', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 }
];

export const QuantityArray = [
  'cart_at_least',
  'cart_at_most',
  'cart_exactly'
];

export const OrderArray = [
  'total_at_least',
  'total_at_most'
];

export const OfferThemeOptions = [
  { label: 'Cart page', value: 'cartpage' },
  { label: 'Product page', value: 'productpage' },
  { label: 'Product and cart page', value: 'cartpageproductpage' },
  { label: 'AJAX cart (slider, pop up or dropdown)', value: 'ajax' },
  { label: 'AJAX and cart page', value: 'ajaxcartpage' }
];

export const OfferNewThemeOptions = [
  { label: 'Cart page', value: 'cartpage' },
  { label: 'Product page', value: 'productpage' },
  { label: 'Product and cart page', value: 'cartpageproductpage' },
  { label: 'AJAX cart (slider, pop up or dropdown)', value: 'ajax' },
];

export const OfferStyleOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Stack', value: 'stack' },
  { label: 'Carousel', value: 'carousel' },
  { label: 'Flex', value: 'flex' },
];

export const OfferBorderOptions = [
  { label: 'No border', value: 'none' },
  { label: 'Dotted lines', value: 'dotted' },
  { label: 'Dashed line', value: 'dashed' },
  { label: 'Solid line', value: 'solid' },
  { label: 'Double line', value: 'double' },
  { label: 'Groove line', value: 'groove' },
  { label: 'Ridge line', value: 'ridge' },
  { label: 'Inset line', value: 'inset' },
  { label: 'Outset line', value: 'outset' },
  { label: 'Hidden line', value: 'hidden' },
];

export const OfferFontOptions = [
  { label: 'None', value: 'None' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Caveat', value: 'Caveat' },
  { label: 'Comfortaa', value: 'Comfortaa' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'EB Garamond', value: 'EB Garamond' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Impact', value: 'Impact' },
  { label: 'Lexend', value: 'Lexend' },
  { label: 'Lobster', value: 'Lobster' },
  { label: 'Lora', value: 'Lora' },
  { label: 'Merriweather', value: 'Merriweather' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Oswald', value: 'Oswald' },
  { label: 'Pacifico', value: 'Pacifico' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Spectral', value: 'Spectral' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS' },
  { label: 'Verdana', value: 'Verdana' },
];

export const EditOfferTabs = [
  {
    id: 'content',
    content: "Content",
    panelID: 'content',
  },
  {
    id: 'placement',
    content: 'Placement',
    panelID: 'placement',
  },
  {
    id: 'appearance',
    content: 'Appearance',
    panelID: 'appearance',
  },
  {
    id: 'advanced',
    content: 'Advanced',
    panelID: 'advanced',
  },
];

export const OFFER_DEFAULTS = {
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
      borderColor: "#000"
    },
    text: {
      fontFamily: "Arial",
      fontSize: '16px',
      color: "#000"
    },
    button: {
      color: "#FFFFFF",
      backgroundColor: "#2B3D51",
      fontFamily: "Arial",
      fontSize: "16px",
      borderRadius: 0,
      borderColor: "#000"
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
}

export const OFFER_PUBLISH = "published"
export const OFFER_DRAFT = "draft"

export const OFFER_ACTIVATE_URL = `/api/v2/merchant/offer_activate`
export const OFFER_DEACTIVATE_URL = `/api/v2/merchant/offer_deactivate`
export const OFFER_DETAILS_URL = `/api/v2/merchant/load_offer_details`
export const OFFER_CREATE_URL = `/api/v2/offers/create/`
