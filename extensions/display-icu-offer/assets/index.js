(async function () {
    let offers = [];
    let offer = {};
    let product = {};
    let shopifyDomain = '';
    let offerSettings = {};
    let abTestVersion = 'a';
    let itemsInCart = [];
    let slideIndex = 1;
    let cFields = [];
    let customerTags = [];
    let cartTotalPrice = 0.0;
    let in_collection_page = false;
    let collections = [];
    let customerCountryCode = '';
    let isAnAjaxCall = false;
    let cartToken = '';

    const statsURL = 'https://stats-rails.incartupsell.com';

    const isCartPage = () => {
        return /\/cart\/?$/.test(window.location.pathname);
    };

    const isProductPage = () => {
        return window.location.pathname.includes("/products/");
    };

    const isCollectionsPage = () => {
        return window.location.pathname.includes("/collections/");
    };

    const checkoutButton = document.querySelector('.cart__checkout-button') || document.querySelector('[name="checkout"]');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (offers.length > 0) {
                trackEvent('checkout', offers[0].id);
            }
        });
    }

    const trackEvent = (action, offerId, selectedShopifyVariant) => {  // send marketing data

        let url = statsURL + "/stats/create_stats?icu=1";

        let opts = {
            action: action,
            offerId: offerId,
            offerVariant: abTestVersion,
            page: currentPage(),
            method: isAnAjaxCall ? 'ajax' : 'regular'
        }

        if (selectedShopifyVariant) {
            opts.selectedShopifyVariant = selectedShopifyVariant;
            opts.cart_token = cartToken;
        }

        fetch(
          url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({stat: opts}),
          }
        )
          .then(response => {
              return response.json();
          })
          .catch((error) => {
              console.error('Error:', error);
          });
    };

    const currentPage = ()  =>  {
        if (isCartPage()) {
            return "cart";
        } else if (isProductPage()) {
            return "product";
        } else if (isCollectionsPage()) {
            return "collection";
        } else {
            return "ajax";
        }
    };

    const pageSatisfiesOfferConditions = async () => {
        return (!isOfferDismissed() &&
          !(offer.stop_showing_after_accepted && isOfferAlreadyAccepted() && await doesCartContainOffer()) &&
          ((offer.in_cart_page && isCartPage()) || (offer.in_product_page && isProductPage()) || (in_collection_page && isCollectionsPage())))
    }

    const pageSatisfiesRule = async (rule) => {
        const ruleSelector = rule.rule_selector;
        const itemType = rule.item_type;
        const itemShopifyID = rule.item_shopify_id;
        const itemName = rule.item_name;

        if (ruleSelector === "on_product_this_product_or_in_collection")           return await visibleOnProductOrColRule(itemType, itemShopifyID, true);
        if (ruleSelector === "on_product_not_this_product_or_not_in_collection")   return await visibleOnProductOrColRule(itemType, itemShopifyID, false);

        if (ruleSelector === "url_contains")                                       return visibleIfUrlRule(itemName, true);
        if (ruleSelector === "url_does_not_contain")                               return visibleIfUrlRule(itemName, false);

        return true;
    };

    const cartSatisfiesRule = async (rule) => {
        const ruleSelector = rule.rule_selector;
        const itemType = rule.item_type;
        const itemShopifyID = rule.item_shopify_id;
        const ruleQuantity = parseInt(rule.quantity);
        const itemName = rule.item_name;
        const ruleAmount = rule.amount;

        if (ruleSelector === "cart_at_least")                                      return await visibleIfCartQuantityRule(itemType, itemShopifyID, ruleQuantity, true);
        if (ruleSelector === "cart_at_most")                                       return await visibleIfCartQuantityRule(itemType, itemShopifyID, ruleQuantity, false);

        if (ruleSelector === "cart_exactly")                                       return await visibleIfCartEqualsRule(itemType, itemShopifyID, ruleQuantity);

        if (ruleSelector === "cart_does_not_contain")                              return await visibleIfCartDoesNotContainRule(itemType, itemShopifyID, ruleQuantity);

        if (ruleSelector === "cart_contains_variant")                              return itemsInCart.some(item => item.variantID === itemShopifyID);
        if (ruleSelector === "cart_does_not_contain_variant")                      return !itemsInCart.some(item => item.variantID === itemShopifyID);

        if (ruleSelector === "cart_contains_item_from_vendor")                     return itemsInCart.some(item => item.vendor === itemName);
        if (ruleSelector === "cart_does_not_contain_item_from_vendor")             return !itemsInCart.some(item => item.vendor === itemName);

        if (ruleSelector === "total_at_least")                                     return cartTotalPrice >= parseFloat(ruleAmount);
        if (ruleSelector === "total_at_most")                                      return cartTotalPrice <= parseFloat(ruleAmount);

        if (ruleSelector === "cookie_is_set")                                      return hasCookie(itemName);
        if (ruleSelector === "cookie_is_not_set")                                  return !hasCookie(itemName);

        if (ruleSelector === "customer_is_tagged")                                 return customerTags.includes(itemName);
        if (ruleSelector === "customer_is_not_tagged")                             return !customerTags.includes(itemName);

        if (ruleSelector === "in_location")                                        return customerCountryCode === itemName;
        if (ruleSelector === "not_in_location")                                    return !customerCountryCode === itemName;

        if (ruleSelector === "cart_contains_recharge")                             return itemsInCart.some(item => item?.rechargeID === itemName);
        if (ruleSelector === "cart_does_not_contain_recharge")                     return !itemsInCart.some(item => item?.rechargeID === itemName);

        return true;
    }

    const visibleOnProductOrColRule = async (itemType, itemShopifyID, isEqualRule) => {
        let isVisible = false;

        if (itemType === 'product' && isProductPage()) {

            let currentProductID = await currentProductPageProductID();
            isVisible = itemShopifyID === currentProductID

        } else if (itemType === 'collection' && isCollectionsPage()) {
            in_collection_page = true;
            await getCollection();

            let pathName = window.location.pathname.replace('/collections/', '');

            isVisible = collections.some(col => col.handle === pathName);
        }

        return isEqualRule ? isVisible : !isVisible;
    }

    const visibleIfCartQuantityRule = async (itemType, itemShopifyID, ruleQuantity, isEqualRule) => {

        if (itemType === "product") {
            let productInCart = itemsInCart.find(item => item.productID === itemShopifyID);

            if (productInCart) {
                return isEqualRule ? productInCart.quantity >= ruleQuantity : productInCart.quantity <= ruleQuantity;
            } else {
                return !isEqualRule ;
            }

        } else if (itemType === "collection") {
            let quantity = await getCollectionProductsQuantityInCart(itemShopifyID);

            return isEqualRule ? quantity >= ruleQuantity : quantity <= ruleQuantity ;
        } else {
            return !isEqualRule;
        }

    }

    const visibleIfCartEqualsRule = async (itemType, itemShopifyID, ruleQuantity) => {
        if (itemType === 'product') {

            let productInCart = itemsInCart.find(item => item.productID === itemShopifyID);

            if (productInCart) {
                return productInCart.quantity === ruleQuantity;
            } else {
                return false;
            }

        } else if (itemType === 'collection') {
            let quantity = await getCollectionProductsQuantityInCart(itemShopifyID);
            return quantity === ruleQuantity;
        } else {
            return false
        }
    }

    const visibleIfCartDoesNotContainRule = async (itemType, itemShopifyID, ruleQuantity) => {
        if (itemType === 'product') {
            return !itemsInCart.some(item => item.productID === itemShopifyID);
        } else if (itemType === 'collection') {
            let quantity = await getCollectionProductsQuantityInCart(itemShopifyID);
            return quantity === ruleQuantity;
        } else {
            return false
        }
    }

    const visibleIfUrlRule = (itemName, isEqualRule) => {
        let currentURL = window.location.href.toLowerCase();
        let ruleURL = itemName.toLowerCase();
        let isVisible = currentURL.includes(ruleURL);

        return isEqualRule ? isVisible : !isVisible;
    }
    const getCollectionProductsQuantityInCart = async (itemShopifyID) => {
        await getCollection();

        let quantity = 0;

        itemsInCart.map(item => {
            let productID = item.productID;

            let collection = collections.some(col => col.shopify_id === itemShopifyID && col.collects_json.includes(productID));

            if (collection) {
                quantity = quantity + item.quantity;
            }
        })

        return quantity;
    }

    const currentProductPageProductID = () => {
        return fetch(`${window.location.pathname}.js`)
          .then(response => response.json())
          .then(productData => productData.id);
    }

    const getCollection = () => {

        return fetch(`/apps/proxy/shop_collections`)
          .then(response => response.json())
          .then(collectionData => {
              collections = collectionData.collection;
          });
    }

    const checkPageRules = async () => {
        let pageRulesResults = [];

        for (let rule of offer?.rules) {
            let ruleResult = await pageSatisfiesRule(rule);
            pageRulesResults.push(ruleResult);
        }

        if (pageRulesResults.length > 0) {
            if (await pageSatisfiesOfferConditions()) {
                if ((offer.ruleset_type === "or" && pageRulesResults.includes(true)) ||
                  (offer.ruleset_type === "and" && !pageRulesResults.includes(false)))  {
                    return true;
                }
            }
        } else {
            return true
        }

        return false
    }

    const checkCartRules = async (offer) => {

        let cartRulesResults = [];

        for (let rule of offer?.rules) {
            let ruleResult = await cartSatisfiesRule(rule);
            cartRulesResults.push(ruleResult);
        }

        if (cartRulesResults.length > 0) {
            if ((offer.ruleset_type === "or" && !cartRulesResults.includes(true)) ||
              (offer.ruleset_type === "and" && cartRulesResults.includes(false)))  {
                return false;
            } else if ((offer.ruleset_type === "or" && cartRulesResults.includes(true)) ||
              (offer.ruleset_type === "and" && !cartRulesResults.includes(false)))  {
                return true;
            }
        } else {
            return true
        }

        return false

    }

    const isOfferDismissed = () => {
        let dismissedOffers = localStorage.getItem("ignored_offers");

        if (dismissedOffers) {
            dismissedOffers = JSON.parse(dismissedOffers);

            return dismissedOffers.includes(`${offer.id}`);
        }

        return false;
    }

    const fetchCart = () => {
        if (offerSettings.uses_customer_tags) { // shops needs a height paid plan to activate this option.
            return fetch('/apps/in-cart-upsell')
              .then(resp => resp.json())
              .then( data => {
                  let begin = data.indexOf("<!--INCARTUPSELLSTART");
                  let end   = data.indexOf("INCARTUPSELLEND-->", begin);
                  customerTags = data.substring(begin + 21, end).split(",");

                  return getCurrentCartItems();
              });
        } else {
            return getCurrentCartItems();
        }
    }

    const getCurrentCartItems = () => {
        return fetch(
          `${window.Shopify.routes.root}cart.js?icu=1`)
          .then(resp => resp.json())
          .then(cartData => {
              itemsInCart = cartData.items.map( item => {
                  let cartProduct = {
                      productID:  item.product_id,
                      variantID:  item.variant_id,
                      variantOptions:  item.variant_options,
                      price:    item.line_price,
                      quantity: item.quantity,
                      vendor:   item.vendor,
                      lineKey: item.key
                  };

                  if (item.properties && item.properties.subscription_id) {
                      cartProduct.rechargeID = item.properties.subscription_id;
                  }

                  return cartProduct;
              });

              cartTotalPrice = cartData.total_price;
              cartToken = cartData.token;
          });
    }

    const doesCartContainOffer = async () => {

        let cartProductIDs = itemsInCart.map(cartItem => cartItem.productID);

        return offer.offerable_product_shopify_ids.some(productID => cartProductIDs.includes(productID));
    };

    const isOfferAlreadyAccepted = () => {
        let accepted_offers = localStorage.getItem("accepted_offers");

        if (accepted_offers) {
            accepted_offers = JSON.parse(accepted_offers);
            return accepted_offers.includes(`${offer.id}`);
        } else {
            return false;
        }

    }

    const setGlobalVariables = (off, shop, settings) => {
        offer = off;
        shopifyDomain = shop;
        offerSettings = settings;

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

    const setGeoOffers = () => {
        const locallyStoredCountry = localStorage.getItem('country');

        if (locallyStoredCountry) {
            fetch('https://spcdn.incartupsell.com/country')
              .then(response => {
                  return response.json();
              })
              .then( locationData => {
                  customerCountryCode = locationData.country_code;
                  localStorage.setItem('country', customerCountryCode);
              })
              .catch((error) => {
                  console.error('Error:', error);
              });
        } else {
            customerCountryCode = locallyStoredCountry
        }
    }

    const hasCookie = (cookieName) => {
        let decodedCookie = decodeURIComponent(document.cookie);
        let cookies = decodedCookie.split(';');

        return cookies.some( cookie => {
            let trimmedCookie = cookie.trimStart();

            return trimmedCookie.startsWith(`${cookieName}=`);
        })
    };

    const removeInvalidOffers = (offersToRemoveFromCart) => {
        let updates = {};

        offersToRemoveFromCart.map( off => {

            off.offerable_product_details.map( productDetails => {

                if (itemsInCart.some(item => item.productID === productDetails.id)) {

                    productDetails.available_json_variants.map( jsonVariant => {
                        let productLine = itemsInCart.find(item => item.variantID === jsonVariant.id);
                        if (productLine) {
                            updates[productLine.lineKey] = 0;
                        }
                    })
                }
            });
        });

        if (Object.keys(updates).length > 0) {
            fetch(
              `${window.Shopify.routes.root}cart/update.js?icu=1`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({updates}),
              }
            )
              .then(response => {
                  return response.json()
              })
              .then( () => {
                  window.location.reload();
              })
              .catch((error) => {
                  console.error('Error:', error);
              });
        }
    };

    const createOffer = async () => {
        const nudgeContainer = createContainer();

        if (offer.show_nothanks) {
            nudgeContainer.appendChild(createDismissOffer());
        }

        let offer_title = createTitle();
        if (offer_title) nudgeContainer.appendChild(offer_title);

        nudgeContainer.appendChild( createVariantsContainerWithChildren() );

        const nudgeParent = document.querySelector('#nudge-offer-list');
        if (nudgeParent) nudgeParent.appendChild(nudgeContainer);


        if (offer.multi_layout === 'carousel') {
            createCarouselArrows(nudgeContainer);
            showSlides(1);
        }

        if (offer.show_powered_by) {
            nudgeContainer.appendChild(createPoweredBy());
        }
    }
    const createAjaxOffer = async () => {
        const ajaxNudgeContainer = createContainer(true);

        if (offer.show_nothanks) {
            ajaxNudgeContainer.appendChild(createDismissOffer());
        }

        let offer_title = createTitle();
        if (offer_title) ajaxNudgeContainer.appendChild(offer_title);

        ajaxNudgeContainer.appendChild( createVariantsContainerWithChildren(true) );

        const cartForms = document.querySelectorAll('[action="/cart"]:not([id*="product-actions"]):not(main [action="/cart"])');

        cartForms.forEach( form => {
            form.after(ajaxNudgeContainer);
        })

        if (offer.multi_layout === 'carousel') {
            createCarouselArrows(nudgeContainer);
            showSlides(1);
        }

        if (offer.show_powered_by) {
            ajaxNudgeContainer.appendChild(createPoweredBy());
        }
    }


    const checkOffersWhenPageUpdates = async () => {
        await fetchCart();

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

                if (await checkPageRules()) {
                    if (!offerOnPage) {
                        if (
                          (offer.in_product_page && isProductPage()) ||
                          (offer.in_cart_page && isCartPage()) ||
                          (offer.in_collection_page && isCartPage())
                        ) {
                            await createOffer();
                        }
                    }

                    if (off.in_ajax_cart && !ajaxOfferOnPage) {
                        await createAjaxOffer();
                    }

                    in_collection_page = false;


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
        fetch(`/apps/proxy/all_offers`)
          .then( response => response.json())
          .then(async (data) => {
              if (data.length !== 0) {
                  offers = data.offers;

                  let offersToRemoveFromCart = [];
                  await fetchCart();

                  for (let off of data.offers) {
                      if (await checkCartRules(off)) {

                          setGlobalVariables(off, data.shopify_domain, data.offer_settings);

                          if (offerSettings.has_geo_offers) {
                              setGeoOffers();
                          }

                          if (await checkPageRules()) {

                              if (off.offerable_type === 'auto') { // offer is autopilot
                                  updateOfferWithAutopilotData();
                              }

                              if (offerSettings.has_shopify_multicurrency) {
                                  offer.active_currency = currencyIsSet() ? Shopify.currency.active : "USD";
                                  offer.offerable_product_details = setProductsCurrency();
                              }

                              if (
                                (offer.in_product_page && isProductPage()) ||
                                (offer.in_cart_page && isCartPage()) ||
                                (offer.in_collection_page && isCartPage())
                              ) {
                                  await createOffer();
                              }

                              if (off.in_ajax_cart) {
                                  await createAjaxOffer();
                              }

                              // only on the cart page
                              if (isCartPage() && off.must_accept && (!(await doesCartContainOffer() ) || !isOfferAlreadyAccepted())) {
                                  disableCta();
                              }

                              trackEvent('show', offer.id);
                              in_collection_page = false;
                          }
                      } else if (off.remove_if_no_longer_valid) {
                          offersToRemoveFromCart.push(off);
                      }

                  }

                  removeInvalidOffers(offersToRemoveFromCart);
              }
          })
          .catch(error => console.log(error))
    }

    listenForCartRequests();
    getOffers();


    const setProductsCurrency = () => {
        let productDetails = offer.offerable_product_details;

        if (currencyIsSet() && productDetails.length > 0) {

           return productDetails.map(currentProduct => {

                currentProduct.available_json_variants.map(jsonVariant => {

                    let actualCurrency = jsonVariant.currencies.filter(currency => currency.label === Shopify.currency.active);

                    if (actualCurrency.length) {
                        let validCurrency = actualCurrency.shift();

                        jsonVariant.currencies = actualCurrency;
                        jsonVariant.price = validCurrency.price;
                        jsonVariant.unparenthesized_price = validCurrency.price;
                        jsonVariant.compare_at_price = validCurrency.compare_at_price;
                    }

                    return jsonVariant;
                });
                return currentProduct;
            });
        }

        return productDetails;
    };

    const disableCta = () => {

        getFormsOnCartPage().map(oneForm => {
            // Check the form is not inside the #nudge-offer element

            oneForm.addEventListener("submit", (e) => {
                e.preventDefault();
            });

            let buttons = [...oneForm.getElementsByTagName('button')]
              .concat([...oneForm.querySelectorAll('input[type=submit]')], [...oneForm.querySelectorAll('button[type=submit]')]);

            buttons.forEach(oneButton => {
                oneButton.setAttribute('disabled', true);
                oneButton.setAttribute('value', ' ... ');
                oneButton.setAttribute('title', 'Accept the offer above to continue');
                oneButton.innerText = 'Must accept offer';
            });
        });
    };

    const getFormsOnCartPage = () => {
        return [...document.querySelectorAll('form')].filter(oneForm => {
            let actionStr = oneForm.action;
            let isOfferForm = oneForm?.id.includes('product-actions')
            if (actionStr.endsWith('/cart') && !isOfferForm) {
                return oneForm;
            }
        })
    }

    const updateOfferWithAutopilotData = ()  => {
        let offeredAutoProducts = [];
        let inStockProductIds   = offer.offerable_product_details.map(productDetails => productDetails.id);
        let cartItemProductIds = itemsInCart.map(item => item.productID);

        let weightedAutoProducts = weightedAutopilotProducts(cartItemProductIds);

        let trimmed = [];

        for (let i = 0; i < weightedAutoProducts.length; i++) {
            let weightedProduct = weightedAutoProducts[i][0];

            if (!cartItemProductIds.includes(weightedProduct) && (inStockProductIds.includes(weightedProduct))) {
                trimmed.push(weightedAutoProducts[i]);
            }
        }

        trimmed.sort(autopilotSortByWeight);
        trimmed.splice(offer.autopilot_quantity);

        for (let i = 0; i < trimmed.length; i++) {
            offeredAutoProducts.push(trimmed[i][0]);
        }

        // We have more autopilot_quantity than offered_auto_products
        if (offeredAutoProducts.length < offer.autopilot_quantity) {

            for (let i = 0; i < offer.autopilot_data.bestsellers.length; i++) {

                let currentProductId = offer.autopilot_data.bestsellers[i];

                if (!offeredAutoProducts.includes(currentProductId) && !cartItemProductIds.includes(currentProductId) &&
                    inStockProductIds.includes(currentProductId)) {

                    offeredAutoProducts.push(currentProductId);
                    if (offeredAutoProducts.length >= offer.autopilot_quantity) {
                        break;
                    }
                }
            }
        }

        let autoProductDetails = [];
        let productFound;

        for (let i = 0; i < offeredAutoProducts.length; i++) {
            productFound = false;

            for (let j = 0; j < offer.offerable_product_details.length; j++) {

                if (offer.offerable_product_details[j].id === offeredAutoProducts[i]) {
                    productFound = offer.offerable_product_details[j];
                    break;
                }
            }

            if (productFound) {
                autoProductDetails.push(productFound);
            }
        }

        offer.offerable_product_details = autoProductDetails;
        offer.offerable = offer.offerable_product_details[0];
    };

    const weightedAutopilotProducts = (cartItemProductIds) => {

        let weightedAutoProducts = [];
        let autoCompanions = offer.autopilot_data.companions;

        for (let i = 0; i < autoCompanions.length; i++) {
            if (cartItemProductIds.includes(autoCompanions[i][0])) {
                let autoProducts = weightedAutoProducts.map((a) => a[0]);

                for (let j = 0; j < autoCompanions[i][1].length; j++) {
                    let pos = autoProducts.indexOf(autoCompanions[i][1][j][0]);

                    if (pos !== -1) {
                        //change the weight
                        if (weightedAutoProducts[pos][1] < autoCompanions[i][1][j][1]){
                            weightedAutoProducts[pos][1] = autoCompanions[i][1][j][1];
                        }
                    } else {
                        weightedAutoProducts.push(autoCompanions[i][1][j]);
                    }
                }

            }

        }
        return weightedAutoProducts;
    };

    const autopilotSortByWeight = (a, b) => {
        if (a[1] === b[1]) {
            return 0;
        } else {
            return (a[1] > b[1]) ? -1 : 1;
        }
    };

    const createContainer = (addAjax) => {
        const nudgeContainer = document.createElement('div');
        nudgeContainer.className = `nudge-offer ${offer.theme} ${offer.show_product_image ? 'with-image' : ''} multi ${offer.multi_layout} ${offer.extra_css_classes || ''}`;
        nudgeContainer.id = `${addAjax ? 'nudge-ajax-' : '' }nudge-offer-${offer.id}`;

        createContainerCSS(nudgeContainer);

        return nudgeContainer;
    }

    const createContainerCSS = (nudgeContainer) => {
        const mainCss = offer.css_options.main;

        nudgeContainer.style.backgroundColor = mainCss.backgroundColor;
        nudgeContainer.style.color = mainCss.color;
        nudgeContainer.style.marginTop = mainCss.marginTop || 0;
        nudgeContainer.style.marginBottom = mainCss.marginBottom || 0;
        nudgeContainer.style.border = mainCss.borderWidth ? `${mainCss.borderWidth}px ${mainCss.borderColor} ${mainCss.borderStyle}` : 0;
        nudgeContainer.style.borderRadius = `${mainCss.borderRadius}px` || 0;

        if (offer?.selectedView === 'mobile') {
            nudgeContainer.style.width = '320px';
        }
    }

    const createDismissOffer = () => {
        const dismissOfferTag = document.createElement('a');

        dismissOfferTag.className = 'dismiss-button';
        dismissOfferTag.onclick = (e) => {
            e.target.parentElement.remove();
            addDismissedOfferToLocalStorage(e.target.parentElement);
        };
        dismissOfferTag.innerHTML = '&times;';
        dismissOfferTag.href = '#';

        dismissOfferTag.style.textDecoration = 'none';
        dismissOfferTag.style.color = 'inherit';

        return dismissOfferTag;
    }

    const addDismissedOfferToLocalStorage = (offerContainer) => {
        let dismissedOffers = localStorage.getItem("ignored_offers") || [];

        if (typeof dismissedOffers === 'string') {
            dismissedOffers = JSON.parse(dismissedOffers);
        }

        dismissedOffers.push(offerContainer.id.replace('nudge-offer-', ''));

        localStorage.setItem("ignored_offers", JSON.stringify(dismissedOffers));
    }

    const createTitle = () => {
        let offer_text;

        if (abTestVersion === 'b') {
            offer_text = offer.text_b;
        } else {
            offer_text = offer.text_a;
        }

        if (offer_text && offer_text.length !== 0) {
            let offerTitle = document.createElement('div');

            if (offer.multi_layout === 'compact') {
                offerTitle.className = 'icu-offer-title';
            } else {
                offerTitle.className = 'offer-text';
            }

            if (offer.offerable_product_shopify_ids.length <= 1) {
                replaceLiquidOfferTag(offer_text, offerTitle);
                createTitleCss(offerTitle);

                return offerTitle;
            } else {
                offerTitle.innerHTML = offer_text;
            }

            return offerTitle;
        }

        return false;
    }

    const replaceLiquidOfferTag = (offer_text, offerTitle) => {
        let productID = offer.offerable_product_shopify_ids[0];
        let productFound = offer.offerable_product_details.find(prod => prod.id === productID);

        if (productFound) {
            offer_text = offer_text.replace('{{ product_title }}', productFound.title);
        }

        offerTitle.innerHTML = offer_text
    }

    const createTitleCss = (offerTitle) => {
        const textCss = offer.css_options.text;

        offerTitle.style.textAlign = 'center';
        offerTitle.style.fontWeight = textCss.fontWeight || 'bold';
        offerTitle.style.fontFamily = textCss.fontFamily || 'inherit';
        offerTitle.style.fontSize = textCss.fontSize || '16px';
        offerTitle.style.color = textCss.color;
    }

    const createVariantsContainerWithChildren = (addAjax) => {
        const variantsContainer = document.createElement('div');

        if (offer.multi_layout === 'compact') {
            variantsContainer.className = 'icu-offer-items variants';
        } else {
            variantsContainer.className = 'offer-collection';
        }

        offer.offerable_product_details.map( prod => {
            product = prod;
            createNudgeWrapperWithChildren(variantsContainer, addAjax);
        });

        return variantsContainer;
    }

    const createNudgeWrapperWithChildren = (variantsContainer, addAjax) => {

        let parentWrapper;

        if (offer.multi_layout === 'compact') {

            const nudgeWrapper = document.createElement('div');
            nudgeWrapper.className = 'nudge-wrapper';
            nudgeWrapper.style.textAlign = 'center';

            parentWrapper = nudgeWrapper;
        } else {
            const productWrapper = document.createElement('div');
            productWrapper.className = 'product-wrapper fade';

            parentWrapper = productWrapper
        }

        if (offer.show_product_image) {
            parentWrapper.appendChild(createProductImage(addAjax));
        }

        if (offer.link_to_product) {
            parentWrapper.appendChild(createProductLinkWithChildren(addAjax));
        } else {
            createProductInfoElements(parentWrapper, addAjax);
        }

        parentWrapper.appendChild(createAddToCart(addAjax));

        variantsContainer.appendChild(parentWrapper);
    }

    const createProductImage = (addAjax) => {
        let parentWrapper;

        if (offer.multi_layout === 'compact') {
            const productImageContainer = document.createElement('div');

            productImageContainer.style.display = 'flex';
            productImageContainer.style.justifyContent = 'center';

            parentWrapper = productImageContainer;

        } else {
            const productImageWrapper = document.createElement('div');
            productImageWrapper.className = 'product-image-wrapper';

            parentWrapper = productImageWrapper
        }


        const imageEl = document.createElement('img');

        imageEl.id = `${addAjax ? 'ajax-' : ''}product-image-${product.id}`
        imageEl.src = `https://${product.medium_image_url}`;
        imageEl.className = 'product-image medium';

        parentWrapper.appendChild(imageEl);

        return parentWrapper;
    }

    const createProductLinkWithChildren = (addAjax) => {
        const productLinkEl = document.createElement('a');
        productLinkEl.style.cursor = 'pointer';
        productLinkEl.href = `/products/${product.url}`;

        createProductInfoElements(productLinkEl, addAjax);

        return productLinkEl;
    }

    const createProductInfoElements = (parentEl, addAjax) => {
        if (offer.multi_layout === 'compact') {
            parentEl.appendChild(createProductTitle());
            parentEl.appendChild(createPriceEl(addAjax));
        } else {
            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'details';

            detailsContainer.appendChild(createProductTitle());
            detailsContainer.appendChild(createPriceEl(addAjax));
            parentEl.appendChild(detailsContainer);
        }
    }

    const createProductTitle = () => {
        const productTitleWrapper = document.createElement('div');
        const productTitle = document.createElement('span');

        productTitleWrapper.className = 'product-title-wrapper';
        productTitle.className = 'product-title';

        productTitle.innerHTML = product.title;

        productTitleWrapper.appendChild(productTitle);

        return productTitleWrapper;
    }

    const createPriceEl = (addAjax) => {
        const priceContainer = document.createElement('div');

        if (offer.show_product_price) {
            if (offer.show_compare_at_price && product.available_json_variants[0].price_is_minor_than_compare_at_price) {
                const productPriceWrapper = document.createElement('span');
                productPriceWrapper.id = `${addAjax ? 'ajax-' : ''}product-price-wrapper-compare-${product.id}`
                productPriceWrapper.className = 'product-price-wrapper compare-at-price money';
                productPriceWrapper.innerHTML = product.available_json_variants[0].compare_at_price;

                priceContainer.appendChild(productPriceWrapper);
            }

            const productPrice = document.createElement('span');
            productPrice.id = `${addAjax ? 'ajax-' : ''}product-price-wrapper-${product.id}`
            productPrice.className = 'product-price-wrapper money';
            productPrice.innerHTML = product.available_json_variants[0].unparenthesized_price;

            priceContainer.appendChild(productPrice);
        }

        return priceContainer;
    }

    const createAddToCart = (addAjax) => {
        const ctaContainer = document.createElement('form');

        ctaContainer.action = offer.shop.path_to_cart;

        ctaContainer.method = 'post';
        ctaContainer.id = `${addAjax ? 'ajax-' : ''}product-actions-${product.id}-offer-${offer.id}`;

        if (offer.show_custom_field) {
            cFields.map( cField => {
                if (cField.show_field) {
                    ctaContainer.appendChild(createCustomFields(cField.name, cField.placeholder, cField.id));
                }
            })
        }

        ctaContainer.appendChild(createVariantsWrapper(addAjax));

        if (offer.show_variant_price && product.available_json_variants.length <= 1) {
            ctaContainer.appendChild(createSingleVariant());
        }

        ctaContainer.appendChild(createQuantitySelector());

        if (offer.recharge_subscription_id) {
            createSubscriptionElements(ctaContainer);
        }

        createSpinner(ctaContainer);

        return ctaContainer;
    }

    const createCustomFields = (fieldName, placeholder, id) => {

        const customFieldInput = document.createElement('input');
        customFieldInput.className = `custom-field ${product.available_json_variants.length > 1 ? 'inline' : '' }`;
        customFieldInput.type = 'text';
        customFieldInput.name= `properties[${fieldName}]`;
        customFieldInput.id = id;
        customFieldInput.placeholder = placeholder;

        return customFieldInput
    }

    const createVariantsWrapper = (addAjax) => {

        const variantsWrapper = document.createElement('span');

        variantsWrapper.className = 'variants-wrapper';

        if (product.available_json_variants.length <= 1) {
            variantsWrapper.style.display = 'none';
        }

        const productSelect = document.createElement('select');

        productSelect.id = `${addAjax ? 'ajax-' : ''}product-select-${product.id}`;
        productSelect.onchange = ( e) => handleCollectionChange(e, addAjax);

        generateVariants(productSelect);

        variantsWrapper.appendChild(productSelect);

        return variantsWrapper;
    }

    const generateVariants = (productSelect) => {
        product.available_json_variants.map( jsonVariant => {
            let option = document.createElement('option');

            option.value = jsonVariant.id;

            option.setAttribute('data-image-url', jsonVariant.image_url);
            option.setAttribute('data-variant-compare-at-price', jsonVariant.compare_at_price);
            option.setAttribute('data-variant-price', jsonVariant.unparenthesized_price);

            jsonVariant.currencies.map( currency => {
                option.setAttribute(`data-variant-price-${currency.label}`, currency.price);
                option.setAttribute(`data-variant-compare-at-price-${currency.label}`, currency.compare_at_price);
            });

            option.innerHTML = `${jsonVariant.title} ${offer.show_variant_price ? jsonVariant.price : '' }`;

            productSelect.appendChild(option);
        });

    }

    const createSingleVariant = () => {
        const singleVariant = document.createElement('span');

        singleVariant.className = 'single-variant-price money';
        singleVariant.innerHTML = product.available_json_variants[0].price;

        return singleVariant;
    }

    const createQuantitySelector = () => {

        if (offer.show_quantity_selector) {
            const quantityWrapper = document.createElement('span');
            const quantitySelect = document.createElement('select');

            quantityWrapper.className = 'quantity-wrapper';
            quantitySelect.id = "quantity-select";
            quantitySelect.onchange = (e) => e.stopImmediatePropagation();

            [ ...Array(10) ].map( (e, i) => {
                let option = document.createElement('option');
                option.value = `${i+1}`;
                option.innerHTML = `${i+1}`;
                quantitySelect.appendChild(option);
            });

            quantityWrapper.appendChild(quantitySelect);

            return quantityWrapper;
        } else {
            const hiddenInput = document.createElement('input');

            hiddenInput.type = 'hidden';
            hiddenInput.value = `1`;
            hiddenInput.name = "quantity";

            return hiddenInput;
        }
    }

    const createSubscriptionElements = (ctaContainer) => {
        const intervalUnit = document.createElement('input');
        const intervalFrequency = document.createElement('input');
        const intervalSubscriptionID = document.createElement('input');

        intervalUnit.name = 'properties[interval_unit]';
        intervalFrequency.name = 'properties[interval_frequency]';
        intervalSubscriptionID.name = 'properties[recharge_subscription_id]';

        intervalUnit.type = 'hidden';
        intervalFrequency.type = 'hidden';
        intervalSubscriptionID.type = 'hidden';

        intervalUnit.value = offer.interval_unit;
        intervalFrequency.value = offer.interval_frequency;
        intervalSubscriptionID.value = offer.recharge_subscription_id;

        ctaContainer.appendChild(intervalUnit);
        ctaContainer.appendChild(intervalFrequency);
        ctaContainer.appendChild(intervalSubscriptionID);
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
        cartButton.onclick =  async (e) => await addToCart(e);

        createCtaCSS(cartButton);

        ctaContainer.appendChild(cartButton);
    }

    const createCtaCSS = (cartButton) => {
        const buttonCSS = offer.css_options.button;

        cartButton.style.backgroundColor = buttonCSS.backgroundColor;
        cartButton.style.color = buttonCSS.color;
        cartButton.style.borderRadius = `${buttonCSS.borderRadius}px` || 0;
        cartButton.style.fontWeight = buttonCSS.fontWeight || 'bold';
        cartButton.style.fontFamily = buttonCSS.fontFamily || 'inherit';
        cartButton.style.fontSize = buttonCSS.fontSize || '16px';
        cartButton.style.border = buttonCSS.borderWidth ? `${buttonCSS.borderWidth}px ${buttonCSS.borderColor} ${buttonCSS.borderStyle}` : 0;
        cartButton.style.cursor = 'pointer';
        cartButton.style.height = 'inherit';
    }

    const createCarouselArrows = (nudgeContainer) => {
        const leftArrow = document.createElement('div');
        const rightArrow = document.createElement('div');

        const leftIcon =  document.createElement('i');
        const rightIcon =  document.createElement('i');

        leftArrow.className= 'js-prev';
        rightArrow.className= 'js-next';

        leftIcon.className = 'arrow left';
        rightIcon.className = 'arrow right';

        leftArrow.appendChild(leftIcon);
        rightArrow.appendChild(rightIcon)

        leftArrow.onclick = () => plusSlides(-1);
        rightArrow.onclick = () => plusSlides(1);

        nudgeContainer.appendChild(leftArrow);
        nudgeContainer.appendChild(rightArrow);
    }

    const createPoweredBy = () => {
        const poweredByContainer = document.createElement('div');
        const poweredByLink = document.createElement('a');

        poweredByContainer.style.textAlign = 'right';
        poweredByContainer.style.color = offer.powered_by_text_color;
        poweredByContainer.style.fontWeight = 'normal';
        poweredByContainer.style.fontSize = '11px';
        poweredByContainer.style.position = 'absolute';
        poweredByContainer.style.bottom = '0';
        poweredByContainer.style.right = '5px';

        poweredByLink.style.color = offer.powered_by_link_color;
        poweredByLink.style.display = 'inline !important;';

        poweredByLink.href = 'https://apps.shopify.com/in-cart-upsell?ref=app';
        poweredByLink.innerHTML = 'In Cart Upsell'

        poweredByContainer.innerHTML = `Offer powered by`;
        poweredByContainer.appendChild(poweredByLink);

        return poweredByContainer;
    }

    const addToCart = async (e) => {
        let custom_fields = {};
        let ctaContainer = e.target.parentElement;
        let quantityToAdd = getQuantity(ctaContainer);
        let selectedShopifyVariant = getSelectedVariant(ctaContainer);
        let redirect =  '/cart'; // For future checkout extension purposes maybe

        let ctaContainerIDSplit = ctaContainer.id.split('-offer-');
        let offerID = ctaContainerIDSplit[1];

        if (offerID) {
            let currentOffer = offers.find(off => off.id === parseInt(offerID));

            let cartItems = {
                items: [{
                    id: selectedShopifyVariant,
                    quantity: quantityToAdd,
                    properties: {}
                }]
            };

            if (currentOffer.show_custom_field) {
                if (areCustomFieldsEmpty(ctaContainer.id).includes(true)) {
                    return false;
                }

                custom_fields = buildPropertiesFromCustomFields(ctaContainer.id);
                cartItems.items[0].properties = {...custom_fields };
            }

            disableButtonShowSpinner(ctaContainer);

            if (currentOffer.discount_code) {
                await addDiscountToCart(currentOffer.discount_code);
            }

            if (offerSettings.has_recharge && typeof(currentOffer.recharge_subscription_id) !== "undefined") {
                cartItems.items[0].properties.shipping_interval_frequency = currentOffer.interval_frequency;
                cartItems.items[0].properties.shipping_interval_unit_type = currentOffer.interval_unit;
                cartItems.items[0].properties.subscription_id = currentOffer.recharge_subscription_id;
            }

            trackEvent('click', currentOffer.id, selectedShopifyVariant)

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

                  if (currentOffer.has_redirect_to_product && isProductPage()) {
                      window.location.reload();
                  } else {
                      window.location.href = redirect;
                  }
              });
        }
    }

    const getSelectedVariant = (ctaContainer) => {
        let variant = document.querySelector(`#${ctaContainer.id} [id*="product-select"]` )?.value;

        if (!variant) {
            variant = document.querySelector(`#${ctaContainer.id} [id*="product-select"] option:first-of-type` )?.value;
        }

        return variant;
    }

    const areCustomFieldsEmpty = (ctaContainerID) => {
        let requiredFields = [];
        let cFieldValue = '';

        cFields.map( cField => {
            if (cField.show_field) {
                cFieldValue = document.querySelector(`#${ctaContainerID} #${cField.id}`)?.value;

                if (cField.required && !cFieldValue) {
                    requiredFields.push(true);
                }
            }
        })

        return requiredFields;
    }

    const buildPropertiesFromCustomFields = (ctaContainerID) => {
        let properties = {};

        cFields.map( cField => {
            properties['Custom Text'] = document.querySelector(`#${ctaContainerID} #${cField.id}`)?.value;
        })

        return properties;
    };

    const disableButtonShowSpinner = (ctaContainer) => {
        //Disabled the input button to prevent double click.
        let btn = document.querySelector(`#${ctaContainer.id} .bttn`);
        btn.disabled = true;

        //Optionally replace the button with a spinner
        if (offerSettings.show_spinner) {
            showSpinner(btn);
        }
    }

    const addDiscountToCart = (discount_code) => {
        return fetch(
          "/discount/" + encodeURIComponent(discount_code), {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              },
          }
        ).catch(error => console.error(error));
    }


    const handleCollectionChange = (e, addAjax) => {
        e.stopImmediatePropagation();
        const has_shopify_multicurrency = offerSettings.has_shopify_multicurrency;

        let imgUrl;
        let altPrice;
        let variantPrice;
        let altComparePrice;
        let compareAtPrice;
        let currentProductID = e.target.id.split('-select-')[1]

        let option = Array.from(e.target.childNodes).find( child => child.value === e.target.value);

        if (option) {
            imgUrl = option.getAttribute('data-image-url');
            variantPrice = option.getAttribute('data-variant-price');
            compareAtPrice = option.getAttribute('data-variant-compare-at-price');

            if (currencyIsSet() && has_shopify_multicurrency) {
                altPrice = option.getAttribute(`data-variant-price-${Shopify.currency.active.toLowerCase()}`);
                altComparePrice = option.getAttribute(`data-variant-compare-at-price-${Shopify.currency.active.toLowerCase()}`);

                if (altPrice) {
                    variantPrice = altPrice;
                }

                if (altComparePrice) {
                    compareAtPrice = altComparePrice;
                }
            }

            if (imgUrl && imgUrl !== '') {
                const productImage = document.querySelector(`#${addAjax ? 'ajax-' : '' }product-image-${currentProductID}`);
                productImage.src = `https://${imgUrl}`;
            }

            if (variantPrice && variantPrice !== '') {
                const productPrice = document.querySelector(`#${addAjax ? 'ajax-' : '' }product-price-wrapper-${currentProductID}`);
                productPrice.innerHTML = variantPrice;
            }

            if (compareAtPrice && compareAtPrice !== '') {
                const comparePrice = document.querySelector(`#${addAjax ? 'ajax-' : '' }product-price-wrapper-compare-${currentProductID}`);
                comparePrice.innerHTML = compareAtPrice;
            }

        }
    }

    const currencyIsSet = () => {
        return !!(Shopify && Shopify.currency && Shopify.currency.active);
    };

    const showSpinner = (btn) => {
        let myHeight = btn.offsetHeight - parseInt(btn.style.paddingTop) - parseInt(btn.style.paddingBottom);

        if ((btn.parentElement.offsetWidth - btn.offsetWidth) >= 50) {
            const myPadding = (btn.width() - myHeight) / 2;
            btn.style.paddingLeft = `${myPadding}px`;
            btn.style.paddingRight = `${myPadding}px`;
        }

        btn.innerHTML = spinnerCode(myHeight);
    };

    const spinnerCode = (myHeight) => {
        return `<svg style='width: ${myHeight}px; height: ${myHeight}px; vertical-align: bottom;
   animation-name: incartupsellspin; animation-duration: 2000ms; animation-iteration-count: infinite;
   animation-timing-function: linear;' aria-hidden='true' focusable='false' data-prefix='fas'
   data-icon='circle-notch' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
   <path fill='currentColor' d='M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z' class=''></path></svg>`;
    };

    const getQuantity = (ctaContainer) => {
        let quantity = document.querySelector(`#${ctaContainer.id} #quantity-select`)?.value;
        return quantity || 1;
    }

    // Next/previous controls
    function plusSlides(slideNum) {
        showSlides(slideIndex + slideNum);
    }

    function showSlides(nextSlideIndex) {
        let slides = document.getElementsByClassName("product-wrapper");

        let oldSlideIndex = slideIndex;

        if (nextSlideIndex !== slideIndex) {
            slideIndex = nextSlideIndex;

            if (nextSlideIndex < oldSlideIndex) {

                if (nextSlideIndex < 1) {
                    slideIndex = slides.length;
                    slides[0].style.marginLeft = `-${100 * (slideIndex - 1)}%`;
                } else {
                    slides[0].style.marginLeft = `-${100 * (nextSlideIndex - 1)}%`;
                }
            } else if (nextSlideIndex > oldSlideIndex) {
                if (nextSlideIndex > slides.length) {
                    slideIndex = 1;
                    slides[0].style.marginLeft = 0;
                } else {
                    slides[0].style.marginLeft = `-${100 * (oldSlideIndex)}%`;
                }
            }
        }

    }
})();

