(function () {
    let offer = {};
    let product = {};
    let shopifyDomain = '';
    let offerSettings = {};
    let abTestVersion = 'a';
    let cart_contents = [];
    let offerVariant = null;
    let cart_token = '';

    const getOffers = async function () {
        fetch(
            `/apps/proxy/get_offers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                if (data.length !== 0) {
                    data.offers.map(off => {

                        offer = off;
                        shopifyDomain = data.shopify_domain;
                        offerSettings = data.offer_settings;

                        if (off.uses_ab_test) {
                            abTestVersion = Math.floor(Math.random() * 2) === 0 ? 'a' : 'b';
                        }

                        createOffer();
                        fetchCart();
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    getOffers();

    const createOffer = () => {

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
        }

        if (offer.show_powered_by) {
            nudgeContainer.appendChild(createPoweredBy());
        }

        let mySiema, prev, next;

        if (offer.multi_layout === 'carousel' && document.querySelector(".offer-collection") && document.querySelector('.product-wrapper')) {
            if (mySiema) {
                mySiema.destroy(true);
            }
            mySiema = new Siema({
                selector: '.offer-collection',
                loop: true
            })

            prev = document.querySelector('.js-prev');
            prev.addEventListener('click', function () { mySiema.prev() });
            next = document.querySelector('.js-next');
            next.addEventListener('click', function () { mySiema.next() });
        }
    }

    const createContainer = () => {
        const nudgeContainer = document.createElement('div');
        nudgeContainer.className = `nudge-offer ${offer.theme} ${offer.show_product_image ? 'with-image' : ''} multi ${offer.multi_layout} ${offer.extra_css_classes || ''}`;

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
        dismissOfferTag.onclick = (e) => e.target.parentElement.remove();
        dismissOfferTag.innerHTML = '&times;';
        dismissOfferTag.href = '#';

        dismissOfferTag.style.textDecoration = 'none';
        dismissOfferTag.style.color = 'inherit';

        return dismissOfferTag;
    }

    const createTitle = () => {
        let offer_text;

        if (abTestVersion === 'b') {
            offer_text = offer.text_b;
        } else {
            offer_text = offer.text_a;
        }

        if (offer_text) {
            let offerTitle = document.createElement('div');

            if (offer.multi_layout === 'compact') {
                offerTitle.className = 'icu-offer-title';
            } else {
                offerTitle.className = 'offer-text';
            }

            if (offer.offerable_product_shopify_ids.length <= 1) {
                let productId = offer.offerable_product_shopify_ids[0];
                let product = offer.offerable_product_details.find(product => product.id === productId);

                if (product) {
                    offer_text = offer_text.replace('{{ product_title }}', product.title);
                }

                offerTitle.innerHTML = offer_text
                createTitleCss(offerTitle);

                return offerTitle;
            } else {
                offerTitle.innerHTML = offer_text;
            }

            return offerTitle;
        }

        return false;
    }

    const createTitleCss = (offerTitle) => {
        const textCss = offer.css_options.text;

        offerTitle.style.textAlign = 'center';
        offerTitle.style.fontWeight = textCss.fontWeight || 'bold';
        offerTitle.style.fontFamily = textCss.fontFamily || 'inherit';
        offerTitle.style.fontSize = textCss.fontSize || '16px';
        offerTitle.style.color = textCss.color;
    }

    const createVariantsContainerWithChildren = () => {
        const variantsContainer = document.createElement('div');

        if (offer.multi_layout === 'compact') {
            variantsContainer.className = 'icu-offer-items variants';
        } else {
            variantsContainer.className = 'offer-collection';
        }

        offer.offerable_product_details.map( prod => {
            product = prod;
            createNudgeWrapperWithChildren(variantsContainer);
        });

        return variantsContainer;
    }

    const createNudgeWrapperWithChildren = (variantsContainer) => {

        let parentWrapper;

        if (offer.multi_layout === 'compact') {

            const nudgeWrapper = document.createElement('div');
            nudgeWrapper.className = 'nudge-wrapper';
            nudgeWrapper.style.textAlign = 'center';

            parentWrapper = nudgeWrapper;
        } else {
            const productWrapper = document.createElement('div');
            productWrapper.className = 'product-wrapper';

            parentWrapper = productWrapper
        }



        if (offer.show_product_image) {
            parentWrapper.appendChild(createProductImage());
        }

        if (offer.link_to_product) {
            parentWrapper.appendChild(createProductLinkWithChildren());
        } else {
            createProductInfoElements(parentWrapper);
        }

        parentWrapper.appendChild(createAddToCart());

        variantsContainer.appendChild(parentWrapper);
    }

    const createProductImage = () => {
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

        imageEl.id = `product-image-${product.id}`
        imageEl.src = `https://${product.medium_image_url}`;
        imageEl.className = 'product-image medium';

        parentWrapper.appendChild(imageEl);

        return parentWrapper;
    }

    const createProductLinkWithChildren = () => {
        const productLinkEl = document.createElement('a');
        productLinkEl.href = `/products/${product.url}`;

        createProductInfoElements(productLinkEl);

        return productLinkEl;
    }

    const createProductInfoElements = (parentEl) => {
        if (offer.multi_layout === 'compact') {
            parentEl.appendChild(createProductTitle());
            parentEl.appendChild(createPriceEl());
        } else {
            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'details';

            detailsContainer.appendChild(createProductTitle());
            detailsContainer.appendChild(createPriceEl());
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

    const createPriceEl = () => {
        const priceContainer = document.createElement('div');

        if (offer.show_product_price) {
            if (offer.show_compare_at_price && product.available_json_variants[0].price_is_minor_than_compare_at_price) {
                const productPriceWrapper = document.createElement('span');
                productPriceWrapper.id = `product-price-wrapper-compare-${product.id}`
                productPriceWrapper.className = 'product-price-wrapper compare-at-price money';
                productPriceWrapper.innerHTML = product.available_json_variants[0].compare_at_price;

                priceContainer.appendChild(productPriceWrapper);
            }

            const productPrice = document.createElement('span');
            productPrice.id = `product-price-wrapper-${product.id}`
            productPrice.className = 'product-price-wrapper money';
            productPrice.innerHTML = product.available_json_variants[0].unparenthesized_price;

            priceContainer.appendChild(productPrice);
        }

        return priceContainer;
    }

    const createAddToCart = () => {
        const ctaContainer = document.createElement('form');

        ctaContainer.action = offer.shop.path_to_cart;

        ctaContainer.method = 'post';
        ctaContainer.className = 'variants';
        ctaContainer.id = `product-actions-${product.id}`;

        if (offer.show_custom_field) {
            ctaContainer.appendChild(createCustomFields(offer.custom_field_name, offer.custom_field_placeholder, 'icu-pcf1'));

            if (offer.custom_field_2_name) {
                ctaContainer.appendChild(createCustomFields(offer.custom_field_2_name, offer.custom_field_2_placeholder, 'icu-pcf2'));
            }

            if (offer.custom_field_3_name) {
                ctaContainer.appendChild(createCustomFields(offer.custom_field_3_name, offer.custom_field_3_placeholder, 'icu-pcf3'));
            }
        }

        ctaContainer.appendChild(createVariantsWrapper());

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

    const createVariantsWrapper = () => {

        const variantsWrapper = document.createElement('span');

        variantsWrapper.className = 'variants-wrapper';

        if (product.available_json_variants.length <= 1) {
            variantsWrapper.style.display = 'none';
        }

        const productSelect = document.createElement('select');

        productSelect.id = 'product-select';
        productSelect.onchange = ( e) => handleCollectionChange(e);

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

        variantsWrapper.appendChild(productSelect);

        return variantsWrapper;
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

            [ ...Array(10) ].map( (e, i) => {
                let option = document.createElement('option');
                option.value = i+1;
                option.innerHTML = i+1;
                quantitySelect.appendChild(option);
            });

            quantityWrapper.appendChild(quantitySelect);

            return quantityWrapper;
        } else {
            const hiddenInput = document.createElement('input');

            hiddenInput.type = 'hidden';
            hiddenInput.value = 1;
            hiddenInput.name = "quantity";

            return hiddenInput;
        }
    }

    const createSubscriptionElements = (ctaContainer) => {
        const intervalUnit = document.createElement('input');
        const intervalFrequency = document.createElement('input');
        const intervalSubscriptionId = document.createElement('input');

        intervalUnit.name = 'properties[interval_unit]';
        intervalFrequency.name = 'properties[interval_frequency]';
        intervalSubscriptionId.name = 'properties[recharge_subscription_id]';

        intervalUnit.type = 'hidden';
        intervalFrequency.type = 'hidden';
        intervalSubscriptionId.type = 'hidden';

        intervalUnit.value = offer.interval_unit;
        intervalFrequency.value = offer.interval_frequency;
        intervalSubscriptionId.value = offer.recharge_subscription_id;

        ctaContainer.appendChild(intervalUnit);
        ctaContainer.appendChild(intervalFrequency);
        ctaContainer.appendChild(intervalSubscriptionId);
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
        cartButton.onclick = (e) => acceptShopifyOffer(e);

        createCtaCSS(cartButton);

        ctaContainer.appendChild(cartButton);
    }

    const createCtaCSS = (cartButton) => {
        const buttonCSS = offer.css_options.button;

        cartButton.style.backgroundColor = buttonCSS.backgroundColor;
        cartButton.style.color = buttonCSS.color;
        cartButton.style.borderRadius = `${buttonCSS.borderRadius}px` || 0;
        cartButton.style.fontWeight = buttonCSS.fontWeight || 'bold';
        cartButton.style.fontFamily = buttonCSS.fontFamily || inherit;
        cartButton.style.fontSize = buttonCSS.fontSize || '16px';
        cartButton.style.border = buttonCSS.borderWidth ? `${buttonCSS.borderWidth}px ${buttonCSS.borderColor} ${buttonCSS.borderStyle}` : 0;
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

        poweredByLink.href = 'http://apps.shopify.com/in-cart-upsell?ref=app';
        poweredByLink.innerHTML = 'In Cart Upsell'

        poweredByContainer.innerHTML = `Offer powered by`;
        poweredByContainer.appendChild(poweredByLink);

        return poweredByContainer;
    }

    const fetchCart = (redirect) => {
        fetch(`${offer.shop.path_to_cart}.json?icu=1`)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                assignDataToCart(data, redirect);
            });
    }

    const assignDataToCart = (data, redirect) => {
        cart_contents = data.items.map((item) => {
            let p = {
                product:  item.product_id,
                variant:  item.variant_id,
                options:  item.variant_options,
                price:    item.line_price,
                quantity: item.quantity,
                vendor:   item.vendor,
            };
            if (item.properties && item.properties.subscription_id) {
                p.recharge_id = item.properties.subscription_id;
            }
            return p;
        });

        cart_total_price = data.total_price;
        cart_token       = data.token;

        if (redirect) {
            window.location.href = redirect;
        }
    }

    const acceptShopifyOffer = (e) => {
        let ctaContainer = e.target.parentElement;

        let selectedShopifyVariant = document.querySelector(`#${ctaContainer.id} #product-select` )?.value;

        if (!selectedShopifyVariant) {
            selectedShopifyVariant = document.querySelector(`#${ctaContainer.id} #product-select option:first-of-type` )?.value;
        }


        if (!customFields(ctaContainer)) {
            return true;
        }

        //Disabled the input button to prevent double click.
        let btn = document.querySelector(`#${ctaContainer.id} .bttn`);
        btn.disabled = true;

        //Optionally replace the button with a spinner
        if (offer.show_spinner) {
            showSpiner(btn);
        }

        fetch(
          "/discount/" + encodeURIComponent(offer.discount_code), {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              },
          }
        )
          .then(resp => resp.json())
          .then( () => {
              console.log('hi');
          });

        if (isProductPage() && cart_contents.length == 0) {
            firstItemFromProductWidget(selectedShopifyVariant, ctaContainer);
            return;
        }

        //record that the offer was accepted


        let opts = {
            action: "click",
            offerId: offer.id,
            offerVariant: offerVariant,  // test ab data
            selectedShopifyVariant: selectedShopifyVariant,
            cart_token: cart_token,
            page: currentPage,
            method: 'regular'
        };

        doAcceptShopifyOffer(selectedShopifyVariant, ctaContainer);
    }

    const firstItemFromProductWidget = (selectedShopifyVariant, ctaContainer) => {
        let quantityToAdd = getQuantity(ctaContainer);

        let data = {
            "quantity": quantityToAdd,
            "id": selectedShopifyVariant,
            "properties": {},
            "product-id": product.id
        };

        let is_success = false;
        let dataResult = null;

        fetch(
          `/cart/add.js?icu=1`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data),
          }
        )
          .then(resp => resp.json())
          .then(data =>  fetchCart('/cart'));


        let opts = {
            action: "click",
            offerId: offer.id,
            offerVariant: offerVariant,  // test ab data
            selectedShopifyVariant: selectedShopifyVariant,
            cart_token: cart_token,
            page: currentPage(),
            method: 'regular'
        };
    }

    const doAcceptShopifyOffer = (selectedShopifyVariant, ctaContainer) => {
        let quantityToAdd = getQuantity(ctaContainer);

        if(offer.redirect_to_product) {
            redirectToProductPage(selectedShopifyVariant);
            return;
        }

        if (isValidCheckoutPage()) {
            addVariantToCartUsingURL(selectedShopifyVariant, offer.discount_code);
            return;
        } else if (offerSettings.has_recharge && typeof(offer.recharge_subscription_id) !== "undefined") {
            let data = {
                "quantity": quantityToAdd,
                "id": selectedShopifyVariant,
                "properties[shipping_interval_frequency]": offer.interval_frequency,
                "properties[shipping_interval_unit_type]": offer.interval_unit,
                "properties[subscription_id]": offer.recharge_subscription_id
            };

            if (offer.show_custom_field) {
                let custom_fields = collectCustomFields();
                let merged_properties = {...custom_fields, ...data.properties};
                data.properties = merged_properties;
            }

            fetch(
              `/cart/add.js?icu=1`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data),
              }
            )
              .then(function(response) {
                  return response.json();
              })
              .then(function(data) {
                  fetchCart('/cart');
              });

        } else {
            let redirect = offer.checkout_after_accepted ? '/checkout' : '/cart';
            let data = {
                "quantity": quantityToAdd,
                "id": selectedShopifyVariant,
                "properties": {},
                "product-id": product.id
            };

            if (offer.show_custom_field) {
                let custom_fields = collectCustomFields();
                let merged_properties = {...custom_fields, ...data.properties};
                data.properties = merged_properties;
            }

            if (offer.discount_code === false) {
                fetch(
                  `/cart/add.js?icu=1`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(data),
                  }
                )
                  .then(function(response) {
                      return response.json();
                  })
                  .then(function(data) {
                      fetchCart(redirect);
                  });
            } else {
                      fetch(
                        `/cart/add.js?icu=1`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data),
                        }
                      )
                        .then(response => response.json())
                        .then((data) => fetchCart(redirect));
            }
        };

    };

    const redirectToProductPage = (selectedShopifyVariant) => {
        if (product) {
            let utmString = new URLSearchParams({
                utm_source: "shop",
                utm_medium: offerSettings.canonical_domain,
                utm_campaign: "upsell",
                utm_content: product.title
            });
            document.location = `/products/${product.url}?${utmString}`;
            return;
        }
    }

    const customFields = (ctaContainer) => {
        if(!offer.show_custom_field) {
            return true;
        }

        if (offer.custom_field_name && offer.custom_field_required) {
            let input_1 = document.querySelector(`#${ctaContainer.id} #icu-pcf1`);
            let customFieldValue = input_1.value;
            if (!customFieldValue) {
                return false;
            }
        }

        if (offer.custom_field_2_name && offer.custom_field_2_required) {
            let input_2 = document.querySelector(`#${ctaContainer.id} #icu-pcf2`);
            let customFieldValue = input_2.value;
            if (!customFieldValue) {
                return false;
            }
        }

        if (offer.custom_field_3_name && offer.custom_field_3_required) {
            let input_3 = document.querySelector(`#${ctaContainer.id} #icu-pcf3`);
            let customFieldValue = input_3.value;
            if (!customFieldValue) {
                return false;
            }
        }

        return true;
    };

    const collectCustomFields = () => {
        let properties = {};
        if (!offer.show_custom_field) {
            return properties;
        }
        if (offer.custom_field_name && offer.custom_field_name != '') {
            let customFieldValue = document.getElementById('#icu-pcf1')?.value;
            properties[offer.custom_field_name] = customFieldValue;
        }
        if (offer.custom_field_2_name && offer.custom_field_2_name != '') {
            let customField2Value = document.getElementById('#icu-pcf2')?.value;
            properties[offer.custom_field_2_name] = customField2Value;
        }
        if (offer.custom_field_3_name && offer.custom_field_3_name != '') {
            let customField3Value = document.getElementById('#icu-pcf3')?.value;
            properties[offer.custom_field_3_name] = customField3Value;
        }
        return properties;
    };

    const handleCollectionChange = (e) => {
        const has_shopify_multicurrency = offerSettings.has_shopify_multicurrency;

        let imgUrl;
        let altPrice;
        let variantPrice;
        let altComparePrice;
        let compareAtPrice;

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
                const productImage = document.querySelector(`#product-image-${product.id}`);
                productImage.src = `https://${imgUrl}`;
            }

            if (variantPrice && variantPrice !== '') {
                const productPrice = document.querySelector(`#product-price-wrapper-${product.id}`);
                productPrice.innerHTML = variantPrice;
            }

            if (compareAtPrice && compareAtPrice !== '') {
                const comparePrice = document.querySelector(`#product-price-wrapper-${product.id}`);
                comparePrice.innerHTML = compareAtPrice;
            }

        }
    }

    const currencyIsSet = () => {
        return Shopify && Shopify.currency && Shopify.currency.active ? true : false;
    };

    const showSpiner = (btn) => {
        let myHeight = btn.offsetHeight - parseInt(btn.style.paddingTop) - parseInt(btn.style.paddingBottom);

        if ((btn.parentElement.offsetWidth - btn.offsetWidth) >= 50) {
            const myPadding = (btn.width() - myHeight) / 2;
            btn.style.paddingLeft = `${myPadding}px`;
            btn.style.paddingRight = `${myPadding}px`;
        }

        let spiner_code = spinerCode(myHeight);
        btn.innerHTML = spiner_code;
    };

    const spinerCode = (myHeight) => {
        let strCode = `<svg style='width: ${myHeight}px; height: ${myHeight}px; vertical-align: bottom;
   animation-name: incartupsellspin; animation-duration: 2000ms; animation-iteration-count: infinite;
   animation-timing-function: linear;' aria-hidden='true' focusable='false' data-prefix='fas'
   data-icon='circle-notch' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
   <path fill='currentColor' d='M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z' class=''></path></svg>`;
        return strCode;
    };


    const currentPage = () => {
        if (isCartPage()) {
            return "cart";
        } else if (isProductPage()) {
            return "product";
        } else {
            return "ajax";
        }
    };


    const isCartPage = () => {
        return /\/cart\/?$/.test(window.location.pathname);
    };

    const isValidCheckoutPage = (can_run_on_checkout_page) => {
        return can_run_on_checkout_page && /\/\d+\/checkouts/.test(window.location.pathname);
    }

    const isProductPage = () => {
        return window.location.pathname.includes("/products/");
    };

    const getQuantity = (ctaContainer) => {
        let quantity = document.querySelector(`#${ctaContainer.id} #quantity-select`)?.value;
        return quantity || 1;
    }


    const addVariantToCartUsingURL = (variantId) => {

        let strCart = "";
        let variantAlreadyInCart = false;

        for (let i = 0; i < cart_contents.length; i++) {

            if (strCart.length > 0) { strCart += ","; }
            var qty = cart_contents[i].quantity;
            if (cart_contents[i].variant == variantId) {
                qty += 1;
                variantAlreadyInCart = true;
            }
            strCart += cart_contents[i].variant + ":" + qty;
        }
        if (!variantAlreadyInCart) {
            strCart += "," + variantId + ":1";
        }

        if (offer.discount_code === false) {
            document.location = "https://" + shopify_domain + "/cart/" + strCart;
        } else {
            fetch(
              "/discount/" + encodeURIComponent(offer.discount_code), {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json'
                  },
              }
            )
              .then(function(response) {
                  if (response.ok) {
                      document.location = "https://" + shopify_domain + "/cart/" + strCart;
                  }
              })
        }
    };

    /**
     * Hi :-) This is a class representing a Siema.
     */
    class Siema {
        /**
         * Create a Siema.
         * @param {Object} options - Optional settings object.
         */
        constructor(options) {
            // Merge defaults with user's settings
            this.config = Siema.mergeSettings(options);

            // Resolve selector's type
            this.selector = typeof this.config.selector === 'string' ? document.querySelector(this.config.selector) : this.config.selector;

            // Early throw if selector doesn't exists
            if (this.selector === null) {
                throw new Error('Something wrong with your selector 😭');
            }

            // update perPage number dependable of user value
            this.resolveSlidesNumber();

            //Not sure why we need this though!
            this.selector.style.width = this.selector.offsetWidth + "px"

            this._currrentViewWidth = window.innerWidth;

            // Create global references
            this.selectorWidth = this.selector.offsetWidth;
            this.innerElements = [].slice.call(this.selector.children);
            this.currentSlide = this.config.loop ?
              this.config.startIndex % this.innerElements.length :
              Math.max(0, Math.min(this.config.startIndex, this.innerElements.length - this.perPage));
            this.transformProperty = Siema.webkitOrNot();

            // Bind all event handlers for referencability
            ['resizeHandler', 'touchstartHandler', 'touchendHandler', 'touchmoveHandler', 'mousedownHandler', 'mouseupHandler', 'mouseleaveHandler', 'mousemoveHandler', 'clickHandler'].forEach(method => {
                this[method] = this[method].bind(this);
            });

            // Build markup and apply required styling to elements
            this.init();
        }


        /**
         * Overrides default settings with custom ones.
         * @param {Object} options - Optional settings object.
         * @returns {Object} - Custom Siema settings.
         */
        static mergeSettings(options) {
            const settings = {
                selector: '.siema',
                duration: 200,
                easing: 'ease-out',
                perPage: 1,
                startIndex: 0,
                draggable: true,
                multipleDrag: true,
                threshold: 20,
                loop: false,
                rtl: false,
                onInit: () => { },
                onChange: () => { },
            };

            const userSttings = options;
            for (const attrname in userSttings) {
                settings[attrname] = userSttings[attrname];
            }

            return settings;
        }


        /**
         * Determine if browser supports unprefixed transform property.
         * Google Chrome since version 26 supports prefix-less transform
         * @returns {string} - Transform property supported by client.
         */
        static webkitOrNot() {
            const style = document.documentElement.style;
            if (typeof style.transform === 'string') {
                return 'transform';
            }
            return 'WebkitTransform';
        }

        /**
         * Attaches listeners to required events.
         */
        attachEvents() {
            // Resize element on window resize
            window.addEventListener('resize', this.resizeHandler);

            // If element is draggable / swipable, add event handlers
            if (this.config.draggable) {
                // Keep track pointer hold and dragging distance
                this.pointerDown = false;
                this.drag = {
                    startX: 0,
                    endX: 0,
                    startY: 0,
                    letItGo: null,
                    preventClick: false,
                };

                // Touch events
                this.selector.addEventListener('touchstart', this.touchstartHandler);
                this.selector.addEventListener('touchend', this.touchendHandler);
                this.selector.addEventListener('touchmove', this.touchmoveHandler);

                // Mouse events
                this.selector.addEventListener('mousedown', this.mousedownHandler);
                this.selector.addEventListener('mouseup', this.mouseupHandler);
                this.selector.addEventListener('mouseleave', this.mouseleaveHandler);
                this.selector.addEventListener('mousemove', this.mousemoveHandler);

                // Click
                this.selector.addEventListener('click', this.clickHandler);
            }
        }


        /**
         * Detaches listeners from required events.
         */
        detachEvents() {
            window.removeEventListener('resize', this.resizeHandler);
            this.selector.removeEventListener('touchstart', this.touchstartHandler);
            this.selector.removeEventListener('touchend', this.touchendHandler);
            this.selector.removeEventListener('touchmove', this.touchmoveHandler);
            this.selector.removeEventListener('mousedown', this.mousedownHandler);
            this.selector.removeEventListener('mouseup', this.mouseupHandler);
            this.selector.removeEventListener('mouseleave', this.mouseleaveHandler);
            this.selector.removeEventListener('mousemove', this.mousemoveHandler);
            this.selector.removeEventListener('click', this.clickHandler);
        }


        /**
         * Builds the markup and attaches listeners to required events.
         */
        init() {
            this.attachEvents();

            // hide everything out of selector's boundaries
            this.selector.style.overflow = 'hidden';

            // rtl or ltr
            this.selector.style.direction = this.config.rtl ? 'rtl' : 'ltr';

            // build a frame and slide to a currentSlide
            this.buildSliderFrame();

            this.config.onInit.call(this);
        }


        /**
         * Build a sliderFrame and slide to a current item.
         */
        buildSliderFrame() {
            const widthItem = this.selectorWidth / this.perPage;
            const itemsToBuild = this.config.loop ? this.innerElements.length + (2 * this.perPage) : this.innerElements.length;

            // Create frame and apply styling
            this.sliderFrame = document.createElement('div');
            this.sliderFrame.style.width = `${widthItem * itemsToBuild}px`;
            this.enableTransition();

            if (this.config.draggable) {
                this.selector.style.cursor = '-webkit-grab';
            }

            // Create a document fragment to put slides into it
            const docFragment = document.createDocumentFragment();

            // Loop through the slides, add styling and add them to document fragment
            if (this.config.loop) {
                for (let i = this.innerElements.length - this.perPage; i < this.innerElements.length; i++) {
                    const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true));
                    docFragment.appendChild(element);
                }
            }
            for (let i = 0; i < this.innerElements.length; i++) {
                const element = this.buildSliderFrameItem(this.innerElements[i]);
                docFragment.appendChild(element);
            }
            if (this.config.loop) {
                for (let i = 0; i < this.perPage; i++) {
                    const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true));
                    docFragment.appendChild(element);
                }
            }

            // Add fragment to the frame
            this.sliderFrame.appendChild(docFragment);

            // Clear selector (just in case something is there) and insert a frame
            this.selector.innerHTML = '';
            this.selector.appendChild(this.sliderFrame);

            // Go to currently active slide after initial build
            this.slideToCurrent();
        }

        buildSliderFrameItem(elm) {
            const elementContainer = document.createElement('div');
            elementContainer.style.cssFloat = this.config.rtl ? 'right' : 'left';
            elementContainer.style.float = this.config.rtl ? 'right' : 'left';
            elementContainer.style.width = `${this.config.loop ? 100 / (this.innerElements.length + (this.perPage * 2)) : 100 / (this.innerElements.length)}%`;
            elementContainer.appendChild(elm);
            return elementContainer;
        }


        /**
         * Determinates slides number accordingly to clients viewport.
         */
        resolveSlidesNumber() {
            if (typeof this.config.perPage === 'number') {
                this.perPage = this.config.perPage;
            }
            else if (typeof this.config.perPage === 'object') {
                this.perPage = 1;
                for (const viewport in this.config.perPage) {
                    if (window.innerWidth >= viewport) {
                        this.perPage = this.config.perPage[viewport];
                    }
                }
            }
        }


        /**
         * Go to previous slide.
         * @param {number} [howManySlides=1] - How many items to slide backward.
         * @param {function} callback - Optional callback function.
         */
        prev(howManySlides = 1, callback) {
            // early return when there is nothing to slide
            if (this.innerElements.length <= this.perPage) {
                return;
            }

            const beforeChange = this.currentSlide;

            if (this.config.loop) {
                const isNewIndexClone = this.currentSlide - howManySlides < 0;
                if (isNewIndexClone) {
                    this.disableTransition();

                    const mirrorSlideIndex = this.currentSlide + this.innerElements.length;
                    const mirrorSlideIndexOffset = this.perPage;
                    const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
                    const offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
                    const dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;

                    this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
                    this.currentSlide = mirrorSlideIndex - howManySlides;
                }
                else {
                    this.currentSlide = this.currentSlide - howManySlides;
                }
            }
            else {
                this.currentSlide = Math.max(this.currentSlide - howManySlides, 0);
            }

            if (beforeChange !== this.currentSlide) {
                this.slideToCurrent(this.config.loop);
                this.config.onChange.call(this);
                if (callback) {
                    callback.call(this);
                }
            }
        }


        /**
         * Go to next slide.
         * @param {number} [howManySlides=1] - How many items to slide forward.
         * @param {function} callback - Optional callback function.
         */
        next(howManySlides = 1, callback) {
            // early return when there is nothing to slide
            if (this.innerElements.length <= this.perPage) {
                return;
            }

            const beforeChange = this.currentSlide;

            if (this.config.loop) {
                const isNewIndexClone = this.currentSlide + howManySlides > this.innerElements.length - this.perPage;
                if (isNewIndexClone) {
                    this.disableTransition();

                    const mirrorSlideIndex = this.currentSlide - this.innerElements.length;
                    const mirrorSlideIndexOffset = this.perPage;
                    const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
                    const offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
                    const dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;

                    this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
                    this.currentSlide = mirrorSlideIndex + howManySlides;
                }
                else {
                    this.currentSlide = this.currentSlide + howManySlides;
                }
            }
            else {
                this.currentSlide = Math.min(this.currentSlide + howManySlides, this.innerElements.length - this.perPage);
            }
            if (beforeChange !== this.currentSlide) {
                this.slideToCurrent(this.config.loop);
                this.config.onChange.call(this);
                if (callback) {
                    callback.call(this);
                }
            }
        }


        /**
         * Disable transition on sliderFrame.
         */
        disableTransition() {
            this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
            this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;
        }


        /**
         * Enable transition on sliderFrame.
         */
        enableTransition() {
            this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
            this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
        }


        /**
         * Go to slide with particular index
         * @param {number} index - Item index to slide to.
         * @param {function} callback - Optional callback function.
         */
        goTo(index, callback) {
            if (this.innerElements.length <= this.perPage) {
                return;
            }
            const beforeChange = this.currentSlide;
            this.currentSlide = this.config.loop ?
              index % this.innerElements.length :
              Math.min(Math.max(index, 0), this.innerElements.length - this.perPage);
            if (beforeChange !== this.currentSlide) {
                this.slideToCurrent();
                this.config.onChange.call(this);
                if (callback) {
                    callback.call(this);
                }
            }
        }


        /**
         * Moves sliders frame to position of currently active slide
         */
        slideToCurrent(enableTransition) {
            const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
            const offset = (this.config.rtl ? 1 : -1) * currentSlide * (this.selectorWidth / this.perPage);

            if (enableTransition) {
                // This one is tricky, I know but this is a perfect explanation:
                // https://youtu.be/cCOL7MC4Pl0
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        this.enableTransition();
                        this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
                    });
                });
            }
            else {
                this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
            }
        }


        /**
         * Recalculate drag /swipe event and reposition the frame of a slider
         */
        updateAfterDrag() {
            const movement = (this.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX);
            const movementDistance = Math.abs(movement);
            const howManySliderToSlide = this.config.multipleDrag ? Math.ceil(movementDistance / (this.selectorWidth / this.perPage)) : 1;

            const slideToNegativeClone = movement > 0 && this.currentSlide - howManySliderToSlide < 0;
            const slideToPositiveClone = movement < 0 && this.currentSlide + howManySliderToSlide > this.innerElements.length - this.perPage;

            if (movement > 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
                this.prev(howManySliderToSlide);
            }
            else if (movement < 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
                this.next(howManySliderToSlide);
            }
            this.slideToCurrent(slideToNegativeClone || slideToPositiveClone);
        }


        /**
         * When window resizes, resize slider components as well
         */
        resizeHandler() {
            if(Math.abs(window.innerWidth - this._currrentViewWidth) === 0) {
                return;
            }

            this._currrentViewWidth = window.innerWidth;

            // update perPage number dependable of user value
            this.resolveSlidesNumber();

            // relcalculate currentSlide
            // prevent hiding items when browser width increases
            if (this.currentSlide + this.perPage > this.innerElements.length) {
                this.currentSlide = this.innerElements.length <= this.perPage ? 0 : this.innerElements.length - this.perPage;
            }

            this.selectorWidth = this.selector.offsetWidth;

            this.buildSliderFrame();
        }


        /**
         * Clear drag after touchend and mouseup event
         */
        clearDrag() {
            this.drag = {
                startX: 0,
                endX: 0,
                startY: 0,
                letItGo: null,
                preventClick: this.drag.preventClick
            };
        }


        /**
         * touchstart event handler
         */
        touchstartHandler(e) {
            // Prevent dragging / swiping on inputs, selects and textareas
            const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1;
            if (ignoreSiema) {
                return;
            }

            e.stopPropagation();
            this.pointerDown = true;
            this.drag.startX = e.touches[0].pageX;
            this.drag.startY = e.touches[0].pageY;
        }


        /**
         * touchend event handler
         */
        touchendHandler(e) {
            e.stopPropagation();
            this.pointerDown = false;
            this.enableTransition();
            if (this.drag.endX) {
                this.updateAfterDrag();
            }
            this.clearDrag();
        }


        /**
         * touchmove event handler
         */
        touchmoveHandler(e) {
            e.stopPropagation();

            if (this.drag.letItGo === null) {
                this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX);
            }

            if (this.pointerDown && this.drag.letItGo) {
                e.preventDefault();
                this.drag.endX = e.touches[0].pageX;
                this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
                this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

                const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
                const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
                const dragOffset = (this.drag.endX - this.drag.startX);
                const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
                this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`;
            }
        }


        /**
         * mousedown event handler
         */
        mousedownHandler(e) {
            // Prevent dragging / swiping on inputs, selects and textareas
            const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1;
            if (ignoreSiema) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            this.pointerDown = true;
            this.drag.startX = e.pageX;
        }


        /**
         * mouseup event handler
         */
        mouseupHandler(e) {
            e.stopPropagation();
            this.pointerDown = false;
            this.selector.style.cursor = '-webkit-grab';
            this.enableTransition();
            if (this.drag.endX) {
                this.updateAfterDrag();
            }
            this.clearDrag();
        }


        /**
         * mousemove event handler
         */
        mousemoveHandler(e) {
            e.preventDefault();
            if (this.pointerDown) {
                // if dragged element is a link
                // mark preventClick prop as a true
                // to detemine about browser redirection later on
                if (e.target.nodeName === 'A') {
                    this.drag.preventClick = true;
                }

                this.drag.endX = e.pageX;
                this.selector.style.cursor = '-webkit-grabbing';
                this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
                this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

                const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
                const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
                const dragOffset = (this.drag.endX - this.drag.startX);
                const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
                this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`;
            }
        }


        /**
         * mouseleave event handler
         */
        mouseleaveHandler(e) {
            if (this.pointerDown) {
                this.pointerDown = false;
                this.selector.style.cursor = '-webkit-grab';
                this.drag.endX = e.pageX;
                this.drag.preventClick = false;
                this.enableTransition();
                this.updateAfterDrag();
                this.clearDrag();
            }
        }


        /**
         * click event handler
         */
        clickHandler(e) {
            // if the dragged element is a link
            // prevent browsers from folowing the link
            if (this.drag.preventClick) {
                e.preventDefault();
            }
            this.drag.preventClick = false;
        }


        /**
         * Remove item from carousel.
         * @param {number} index - Item index to remove.
         * @param {function} callback - Optional callback to call after remove.
         */
        remove(index, callback) {
            if (index < 0 || index >= this.innerElements.length) {
                throw new Error('Item to remove doesn\'t exist 😭');
            }

            // Shift sliderFrame back by one item when:
            // 1. Item with lower index than currenSlide is removed.
            // 2. Last item is removed.
            const lowerIndex = index < this.currentSlide;
            const lastItem = this.currentSlide + this.perPage - 1 === index;

            if (lowerIndex || lastItem) {
                this.currentSlide--;
            }

            this.innerElements.splice(index, 1);

            // build a frame and slide to a currentSlide
            this.buildSliderFrame();

            if (callback) {
                callback.call(this);
            }
        }


        /**
         * Insert item to carousel at particular index.
         * @param {HTMLElement} item - Item to insert.
         * @param {number} index - Index of new new item insertion.
         * @param {function} callback - Optional callback to call after insert.
         */
        insert(item, index, callback) {
            if (index < 0 || index > this.innerElements.length + 1) {
                throw new Error('Unable to inset it at this index 😭');
            }
            if (this.innerElements.indexOf(item) !== -1) {
                throw new Error('The same item in a carousel? Really? Nope 😭');
            }

            // Avoid shifting content
            const shouldItShift = index <= this.currentSlide > 0 && this.innerElements.length;
            this.currentSlide = shouldItShift ? this.currentSlide + 1 : this.currentSlide;

            this.innerElements.splice(index, 0, item);

            // build a frame and slide to a currentSlide
            this.buildSliderFrame();

            if (callback) {
                callback.call(this);
            }
        }


        /**
         * Prepernd item to carousel.
         * @param {HTMLElement} item - Item to prepend.
         * @param {function} callback - Optional callback to call after prepend.
         */
        prepend(item, callback) {
            this.insert(item, 0);
            if (callback) {
                callback.call(this);
            }
        }


        /**
         * Append item to carousel.
         * @param {HTMLElement} item - Item to append.
         * @param {function} callback - Optional callback to call after append.
         */
        append(item, callback) {
            this.insert(item, this.innerElements.length + 1);
            if (callback) {
                callback.call(this);
            }
        }


        /**
         * Removes listeners and optionally restores to initial markup
         * @param {boolean} restoreMarkup - Determinants about restoring an initial markup.
         * @param {function} callback - Optional callback function.
         */
        destroy(restoreMarkup = false, callback) {
            this.detachEvents();

            this.selector.style.cursor = 'auto';

            if (restoreMarkup) {
                const slides = document.createDocumentFragment();
                for (let i = 0; i < this.innerElements.length; i++) {
                    slides.appendChild(this.innerElements[i]);
                }
                this.selector.innerHTML = '';
                this.selector.appendChild(slides);
                this.selector.removeAttribute('style');
            }

            if (callback) {
                callback.call(this);
            }
        }
    }
})();

