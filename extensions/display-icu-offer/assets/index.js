import {
    isCartPage,
    isProductPage,
    trackEvent,
    currencyIsSet,
    setProductsCurrency,
    getQuantity,
    getSelectedVariant,
    redirectToProductPage,
    areCustomFieldsEmpty,
    buildPropertiesFromCustomFields, addDiscountToCart,
} from "./helpers.js";
import {
    checkCartRules,
    checkPageRules,
    doesCartContainOffer,
    fetchCart,
    isOfferAlreadyAccepted,
    pageSatisfiesOfferConditions,
    removeInvalidOffers,
    setGeoOffers
} from "./rules.js";

import {
    disableCta,
    updateOfferWithAutopilotData,
    createContainer,
    createDismissOffer,
    createTitle,
    createCarouselArrows,
    createPoweredBy,
    addCSSToPage,
    showSlides,
    disableButtonShowSpinner,
    createSubscriptionElements,
    createProductImage,
    createProductLinkWithChildren,
    createProductInfoElements,
    createCustomFields,
    createVariantsWrapper,
    createSingleVariant,
    createQuantitySelector,
    createCtaCSS,
} from './domHelpers.js';

(async function () {
    let offers = [];
    let offer = {};
    let shopifyDomain = '';
    let offerSettings = {};
    let abTestVersion = 'a';
    let cFields = [];
    let isAnAjaxCall = false;
    let page = 1;
    let product = {};
    let offerShown = false;
    let ajaxOfferShown = false;
    let offerShownID = -1;
    let ajaxOfferShownID = -1

    const checkoutButton = document.querySelector('.cart__checkout-button') || document.querySelector('[name="checkout"]');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (offers.length > 0) {
                trackEvent('checkout', offers[0].id, abTestVersion, isAnAjaxCall);
            }
        });
    }

    const setGlobalVariables = (off, shop, settings) => {
        offer = off;
        shopifyDomain = shop;
        offerSettings = settings;

        // localStorage.setItem('shopifyDomain', shopifyDomain)

        if (offer.uses_ab_test) {
            abTestVersion = Math.floor(Math.random() * 2) === 0 ? 'a' : 'b';
        }

        cFields = [
            {
                name: offer.custom_field_name,
                id:  'icu-pcf1',
                placeholder: offer.custom_field_placeholder,
                show_field: offer.show_custom_field,
                required: offer.custom_field_required
            },
            // {
            //     name: offer.custom_field_2_name,
            //     id:  'icu-pcf2',
            //     placeholder: offer.custom_field_2_placeholder,
            //     show_field: offer.custom_field_2_name,
            //     required: offer.custom_field_2_required
            // },
            // {
            //     name: offer.custom_field_3_name,
            //     id:  'icu-pcf3',
            //     placeholder: offer.custom_field_3_placeholder,
            //     show_field: offer.custom_field_3_name,
            //     required: offer.custom_field_3_required
            // }
        ]
    };

    const createOffer = async () => {
        const nudgeContainer = createContainer(offer);

        if (offer.show_nothanks) {
            nudgeContainer.appendChild(createDismissOffer());
        }

        let offer_title = createTitle(offer, abTestVersion);
        if (offer_title) nudgeContainer.appendChild(offer_title);

        nudgeContainer.appendChild( createVariantsContainerWithChildren() );

        addCSSToPage(offer, offerSettings);

        let nudgeOfferList = document.createElement('div');
        nudgeOfferList.id='nudge-offer-list';

        let customNudgeParent;

        if (block_selector && block_action) {
            customNudgeParent = document.querySelector(block_selector);
            if (customNudgeParent) {
                const icuNotice = document.querySelector('.icu-notice');

                if (icuNotice) {
                    nudgeOfferList.appendChild(icuNotice)
                }

                nudgeOfferList.appendChild(nudgeContainer)
                customNudgeParent[block_action](nudgeOfferList)
            }

        }

        let nudgeParent = document.querySelector('#nudge-offer-listings');

        if (!customNudgeParent){
            nudgeOfferList.appendChild(nudgeContainer);
            if (nudgeParent) nudgeParent.appendChild(nudgeOfferList);
        }

        if (offer.multi_layout === 'carousel') {
            createCarouselArrows(nudgeContainer);
            showSlides(1);
        }

        if (offer.show_powered_by) {
            nudgeContainer.appendChild(createPoweredBy(offer));
        }
    }

    const createAjaxOffer = async () => {
        const ajaxNudgeContainer = createContainer(offer,true);

        if (offer.show_nothanks) {
            ajaxNudgeContainer.appendChild(createDismissOffer());
        }

        let offer_title = createTitle(offer, abTestVersion);
        if (offer_title) ajaxNudgeContainer.appendChild(offer_title);

        ajaxNudgeContainer.appendChild( createVariantsContainerWithChildren(true) );

        addCSSToPage(offer, offerSettings);

        const cartForms = document.querySelectorAll('[action="/cart"]:not([id*="product-actions"]):not(main [action="/cart"])');

        if (ajax_selector && ajax_action) {
            const customNudgeParent = document.querySelector(ajax_selector);
            if (customNudgeParent) {
                customNudgeParent[ajax_action](ajaxNudgeContainer)
            }
        } else {
            cartForms.forEach( form => {
                form.appendChild(ajaxNudgeContainer);
            })
        }


        if (offer.multi_layout === 'carousel') {
            createCarouselArrows(ajaxNudgeContainer);
            showSlides(1);
        }

        if (offer.show_powered_by) {
            ajaxNudgeContainer.appendChild(createPoweredBy(offer));
        }
    }

    const checkOffersWhenPageUpdates = async () => {
        await fetchCart(offerSettings);

        let offersToRemoveFromCart = [];

        for (let off of offers) {
            if (!(await checkCartRules(off))) {
                document.getElementById(`nudge-offer-${off.id}`)?.remove();

                if (off.remove_if_no_longer_valid) {
                    offersToRemoveFromCart.push(off);
                }
            } else {
                let offerOnPage = document.getElementById( `nudge-offer-${off.id}`);
                let ajaxOfferOnPage = document.getElementById( `nudge-ajax-nudge-offer-${off.id}`);

                offer = off;

                if (await checkPageRules(offer) && await pageSatisfiesOfferConditions(offer)) {
                    if (!offerOnPage) {
                        if (
                          (offer.in_product_page && isProductPage()) ||
                          (offer.in_cart_page && isCartPage())
                        ) {
                            if (offerShownID === offer.id || offerShownID === -1) {
                                if (offerShownID  === -1) offerShownID = offer.id
                                offerShown = true
                                await createOffer();
                            }
                        }
                    }

                    if (off.in_ajax_cart && !ajaxOfferOnPage) {
                        if (ajaxOfferShownID === offer.id || ajaxOfferShownID === -1) {
                            if (ajaxOfferShownID  === -1) ajaxOfferShownID = offer.id
                            ajaxOfferShown = true
                            await createAjaxOffer();
                        }
                    }
                }
            }
        }

        removeInvalidOffers(offersToRemoveFromCart);
    };

    const listenForCartRequests = () => {
        (function(open) {
            XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
                this.addEventListener("readystatechange", function() {
                    if (this.readyState === 4 && this.status === 200) {
                        let parser = document.createElement('a');
                        parser.href = this.responseURL || this._url;
                        let path = parser.pathname;
                        if (path[0] !== "/") { path = "/" + path; }
                        if (path.includes('/cart') && parser.search.indexOf("icu") === -1 ) {
                            isAnAjaxCall = true;
                            checkOffersWhenPageUpdates();
                        }
                    }
                }, false);
                open.call(this, method, url, async, user, pass);
            };
        })(XMLHttpRequest.prototype.open);

        (function (ns, fetch) {
            if (typeof fetch !== 'function') return;
            ns.fetch = function () {
                let out   = fetch.apply(this, arguments);
                let _args = arguments;
                out.then(function(_response) {
                    let parser = document.createElement('a');
                    parser.href = _args[0];
                    let path = parser.pathname;
                    if (path[0] !== "/") { path = "/" + path; }
                    if (path.includes('/cart') && parser.search.indexOf("icu") === -1 ) {
                        isAnAjaxCall = true;
                        checkOffersWhenPageUpdates();
                    }
                });
                return out;
            };
        }(window, window.fetch));  // Immediately-invoked Function Expression
    }

    const getOffers = () => {
        fetch(`/apps/in-cart-upsell/all_offers?page=${page}`)
          .then( response => response.json())
          .then(async (data) => {

              if (data?.offers?.length !== 0) {
                  if (data?.pagy?.page > 1) {
                      offers.push(data.offers)
                  } else {
                      offers = data.offers;
                  }

                  localStorage.setItem('offerSettings', JSON.stringify(data.offer_settings));

                  let offersToRemoveFromCart = [];
                  await fetchCart(data.offer_settings);

                  for (let off of data.offers) {
                      if (await checkCartRules(off)) {

                          setGlobalVariables(off, data.shopify_domain, data.offer_settings);

                          if (offerSettings.has_geo_offers) {
                              setGeoOffers();
                          }

                          if (await checkPageRules(offer) && await pageSatisfiesOfferConditions(offer)) {

                              if (off.offerable_type === 'auto') { // offer is autopilot
                                  updateOfferWithAutopilotData(off);
                              }

                              if (offerSettings.has_shopify_multicurrency) {
                                  offer.active_currency = currencyIsSet() ? Shopify.currency.active : "USD";
                                  offer.offerable_product_details = setProductsCurrency(off);
                              }

                              if (
                                (offer.in_product_page && isProductPage()) ||
                                (offer.in_cart_page && isCartPage())
                              ) {
                                  if (!offerShown) {
                                      offerShown = true
                                      offerShownID = offer.id
                                      await createOffer();
                                  }
                              }

                              if (off.in_ajax_cart) {
                                  if (!ajaxOfferShown) {
                                      ajaxOfferShown = true
                                      ajaxOfferShownID = offer.id
                                      await createAjaxOffer();
                                  }
                              }

                              // only on the cart page
                              if (isCartPage() && off.must_accept && (!(await doesCartContainOffer(offer) ) || !isOfferAlreadyAccepted(off))) {
                                  disableCta();
                              }

                              trackEvent('show', offer.id, abTestVersion, isAnAjaxCall);
                          }
                      } else if (off.remove_if_no_longer_valid) {
                          offersToRemoveFromCart.push(off);
                      }

                  }

                  if (Shopify.designMode) {
                      let offers_for_product_pages = data.offers.filter( off => off.in_product_page).length;
                      let offers_for_cart_page =  data.offers.filter( off => off.in_cart_page).length;

                      if ((offers_for_product_pages === 0 && isProductPage()) || (offers_for_cart_page === 0 && isCartPage())) {
                          offer = {
                              theme: 'custom',
                              show_product_image: true,
                              multi_layout: 'stack',
                              id: 1,
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
                              show_product_price: true,
                              show_nothanks: false,
                              text_a: 'Would you like to add a Test Product?',
                              link_to_product: false,
                              show_compare_at_price: false,
                              offerable_product_shopify_ids: [],
                              show_quantity_selector: true,
                              show_spinner: false,
                              cta_a: 'Add to Cart',
                              shop: {
                                  path_to_cart: '/'
                              },
                              offerable_product_details: [
                                  {
                                      id: 1,
                                      title: 'Test Product',
                                      medium_image_url: 'https://assets.incartupsell.com/images/billing-ICU-Logo-Small.png',
                                      available_json_variants: [
                                          {
                                              unparenthesized_price: '$99.99',
                                              currencies: [
                                                  {
                                                      label: 'USD',
                                                      price: '99.99',
                                                      compare_at_price: '99.99'
                                                  }
                                              ]
                                          }
                                      ]
                                  }
                              ]
                          }
                          await createOffer();
                      }
                  }


                  removeInvalidOffers(offersToRemoveFromCart);
              } else {
                  if (Shopify.designMode) {
                      offer = {
                          theme: 'custom',
                          show_product_image: true,
                          multi_layout: 'stack',
                          id: 1,
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
                          show_product_price: true,
                          show_nothanks: false,
                          text_a: 'Would you like to add a Test Product?',
                          link_to_product: false,
                          show_compare_at_price: false,
                          offerable_product_shopify_ids: [],
                          show_quantity_selector: true,
                          show_spinner: false,
                          cta_a: 'Add to Cart',
                          shop: {
                              path_to_cart: '/'
                          },
                          offerable_product_details: [
                              {
                                  id: 1,
                                  title: 'Test Product',
                                  medium_image_url: 'https://assets.incartupsell.com/images/billing-ICU-Logo-Small.png',
                                  available_json_variants: [
                                      {
                                          unparenthesized_price: '$99.99',
                                          currencies: [
                                              {
                                                  label: 'USD',
                                                  price: '99.99',
                                                  compare_at_price: '99.99'
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      }
                      await createOffer();
                  }
              }

              if (data?.pagy?.next) {
                  page = data?.pagy?.next
                  getOffers();
              }
          })
          .catch(error => console.log(error))
    }

    fetch(`/apps/in-cart-upsell/theme_app_completed`)
      .then( response => response.json())
      .then( (data) => {
          if (data.theme_app_completed && (data.activated === null || data.activated)) {
              if (Shopify.designMode) {
                  fetch(`/apps/in-cart-upsell/theme_app_check`, {
                      method: "GET",
                      headers: {
                          "Content-Type": "application/json",
                      }})
                    .then( () => {
                        console.log('InCartUpsell Loaded');
                        listenForCartRequests();
                        getOffers();
                    })
              } else {
                  console.log('InCartUpsell Loaded');
                  listenForCartRequests();
                  getOffers();
              }
          } else {
              if (Shopify.designMode) {
                  fetch(`/apps/in-cart-upsell/theme_app_check`, {
                      method: "GET",
                      headers: {
                          "Content-Type": "application/json",
                      }})
                    .then( () => {
                        console.log('InCartUpsell Loaded Theme Check');
                        listenForCartRequests();
                        getOffers();
                    })
              }
          }
      })

    const createVariantsContainerWithChildren = (addAjax) => {
        const variantsContainer = document.createElement('div');

        if (offer.multi_layout === 'compact') {
            variantsContainer.className = 'icu-offer-items variants';
        } else {
            variantsContainer.className = 'offer-collection';
        }

        offer.offerable_product_details.map( (prod, prodIndex) => {
            product = prod;
            createNudgeWrapperWithChildren(variantsContainer, addAjax, prodIndex);
        });

        return variantsContainer;
    }


    const createNudgeWrapperWithChildren = (variantsContainer, addAjax, prodIndex) => {

        let parentWrapper;

        if (offer.multi_layout === 'compact') {

            const nudgeWrapper = document.createElement('div');
            nudgeWrapper.className = 'nudge-wrapper';
            nudgeWrapper.style.textAlign = 'center';

            parentWrapper = nudgeWrapper;
        } else {
            const productWrapper = document.createElement('div');

            if (prodIndex === 0) {
                productWrapper.className = 'product-wrapper fade active';
            } else {
                productWrapper.className = 'product-wrapper fade';
            }

            parentWrapper = productWrapper
        }

        if (offer.show_product_image) {
            parentWrapper.appendChild(createProductImage(offer, product, addAjax));
        }

        if (offer.link_to_product) {
            parentWrapper.appendChild(createProductLinkWithChildren(product, addAjax, offer, parentWrapper));
        } else {
            createProductInfoElements(parentWrapper, addAjax, offer, product);
        }

        if (offer.multi_layout !== 'compact') {
            let detailsContainer = parentWrapper.querySelector('.details');

            if (detailsContainer) detailsContainer.appendChild(createAddToCart(addAjax))
        } else {
            parentWrapper.appendChild(createAddToCart(addAjax));
        }

        variantsContainer.appendChild(parentWrapper);
    }


    const createAddToCart = (addAjax) => {
        const ctaContainer = document.createElement('form');

        ctaContainer.action = offer.shop.path_to_cart;

        ctaContainer.method = 'post';
        ctaContainer.id = `${addAjax ? 'ajax-' : ''}product-actions-${product.id}-offer-${offer.id}`;

        if (offer.show_custom_field) {
            cFields.map( cField => {
                if (cField.show_field) {
                    ctaContainer.appendChild(createCustomFields(cField.name, cField.placeholder, cField.id, product));
                }
            })
        }

        ctaContainer.appendChild(createVariantsWrapper(addAjax, offer, product, offerSettings));

        if (offer.show_variant_price && product.available_json_variants.length <= 1) {
            ctaContainer.appendChild(createSingleVariant(product));
        }

        ctaContainer.appendChild(createQuantitySelector(offer));

        if (offer.recharge_subscription_id) {
            createSubscriptionElements(ctaContainer, offer);
        }

        createSpinner(ctaContainer);

        return ctaContainer;
    }

    const createSpinner = (ctaContainer) => {
        let cartButton;

        if (offer.show_spinner) {
            cartButton = document.createElement('button');

            if (abTestVersion === 'b') {
                cartButton.innerHTML = offer.cta_b;
            } else {
                cartButton.innerHTML = offer.cta_a;
            }

        } else {
            cartButton = document.createElement('input');

            if (abTestVersion === 'b') {
                cartButton.value = offer.cta_b;
            } else {
                cartButton.value = offer.cta_a;
            }
        }

        cartButton.type = 'submit';
        cartButton.name = 'add';
        cartButton.className = 'bttn product-price';

        if (Shopify.designMode) {
            cartButton.onclick =  (e) => e.preventDefault();
        } else {
            cartButton.onclick =  async (e) => await addToCart(e, abTestVersion, offers);
        }

        createCtaCSS(cartButton, offer);

        ctaContainer.appendChild(cartButton);
    }

    const addToCart = async (e) => {
        let custom_fields = {};
        let ctaContainer = e.target.parentElement;
        let quantityToAdd = getQuantity(ctaContainer);
        let selectedShopifyVariant = getSelectedVariant(ctaContainer);

        let ctaContainerIDSplit = ctaContainer.id.split('-offer-');
        let offerID = ctaContainerIDSplit[1];

        if (offerID) {
            let currentOffer = offers.find(off => off.id === parseInt(offerID));
            let redirect = currentOffer.checkout_after_accepted ? '/checkout' : '/cart';

            if (currentOffer.redirect_to_product) {
                redirectToProductPage(currentOffer, selectedShopifyVariant);
            } else {
                let cartItems = {
                    items: [{
                        id: selectedShopifyVariant,
                        quantity: quantityToAdd,
                        properties: {}
                    }]
                };

                if (currentOffer.show_custom_field) {
                    if (areCustomFieldsEmpty(ctaContainer.id, cFields).includes(true)) {
                        return false;
                    }

                    custom_fields = buildPropertiesFromCustomFields(ctaContainer.id, cFields);
                    cartItems.items[0].properties = {...custom_fields };
                }

                disableButtonShowSpinner(ctaContainer, offerSettings);

                if (currentOffer.discount_code) {
                    await addDiscountToCart(currentOffer.discount_code);
                }

                if (offerSettings.has_recharge && typeof(currentOffer.recharge_subscription_id) !== "undefined") {
                    cartItems.items[0].properties.shipping_interval_frequency = currentOffer.interval_frequency;
                    cartItems.items[0].properties.shipping_interval_unit_type = currentOffer.interval_unit;
                    cartItems.items[0].properties.subscription_id = currentOffer.recharge_subscription_id;
                }

                trackEvent('click', currentOffer.id, abTestVersion, isAnAjaxCall)

                fetch(
                  `${window.Shopify.routes.root}cart/add.js?icu=1`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(cartItems),
                  }
                )
                  .then(resp => resp.json())
                  .then(() => {
                      let acceptedOffers = localStorage.getItem("accepted_offers");

                      if (acceptedOffers) {
                          acceptedOffers = JSON.parse(acceptedOffers);
                      } else {
                          acceptedOffers = [];
                      }

                      if (!acceptedOffers.includes(offerID)) {
                          acceptedOffers.push(offerID);
                          localStorage.setItem("accepted_offers", JSON.stringify(acceptedOffers));
                      }

                      if (!offerSettings || Object.keys(offerSettings).length === 0) {
                          const storedOfferSettings = localStorage.getItem('offerSettings');

                          if (storedOfferSettings) {
                              offerSettings = JSON.parse(storedOfferSettings);
                          }
                      }

                      if (offerSettings.ajax_refresh_code?.length > 0 && !isCartPage()) {
                          try {
                              const ajaxCleaned = offerSettings.ajax_refresh_code.replace('InCartUpsell.prototype.findOfferWhenReady();');

                              eval(ajaxCleaned)
                          } catch(err) {
                              window.location.href = redirect;
                          }
                      } else {
                          window.location.href = redirect;
                      }
                  });
            }
        }
    }
})();
