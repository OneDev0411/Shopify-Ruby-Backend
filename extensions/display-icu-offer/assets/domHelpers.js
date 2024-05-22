import { currencyIsSet } from "./helpers.js";
import { getItemsInCart } from "./rules.js";

let slideIndex = 1;

export const disableCta = () => {

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

export const updateOfferWithAutopilotData = (offer)  => {
  let offeredAutoProducts = [];
  let inStockProductIds   = offer.offerable_product_details.map(productDetails => productDetails.id);
  let cartItemProductIds = getItemsInCart().map(item => item.productID);

  let weightedAutoProducts = weightedAutopilotProducts(cartItemProductIds, offer);

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

const weightedAutopilotProducts = (cartItemProductIds, offer) => {

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

export const createContainer = (offer, addAjax) => {
  const nudgeContainer = document.createElement('div');
  nudgeContainer.className = `nudge-offer ${offer.theme} ${offer.show_product_image ? 'with-image' : ''} 
        multi ${offer.multi_layout} ${addAjax ? 'nudge-ajax' : '' } 
         ${offer.extra_css_classes || ''} ${Shopify.designMode ? 'preview-stack': ''}`;
  nudgeContainer.id = `${addAjax ? 'nudge-ajax-' : '' }nudge-offer-${offer.id}`;

  createContainerCSS(nudgeContainer, offer);

  return nudgeContainer;
}

const createContainerCSS = (nudgeContainer, offer) => {
  const css_options = checkCSSOptions(offer);
  const mainCss = css_options.main;

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

export const createDismissOffer = () => {
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

export const createTitle = (offer, abTestVersion) => {
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
      replaceLiquidOfferTag(offer_text, offerTitle, offer);
      createTitleCss(offerTitle, offer);

      return offerTitle;
    } else {
      offerTitle.innerHTML = offer_text;
    }

    return offerTitle;
  }

  return false;
}

const replaceLiquidOfferTag = (offer_text, offerTitle, offer) => {
  let productID = offer.offerable_product_shopify_ids[0];
  let productFound = offer.offerable_product_details?.find(prod => prod.id === productID);

  if (productFound) {
    offer_text = offer_text.replace('{{ product_title }}', productFound.title);
  }

  offerTitle.innerHTML = offer_text
}

const createTitleCss = (offerTitle, offer) => {
  const css_options = checkCSSOptions(offer);
  const textCss = css_options.text;

  offerTitle.style.textAlign = 'center';
  offerTitle.style.fontWeight = textCss.fontWeight || 'bold';
  offerTitle.style.fontFamily = textCss.fontFamily || 'inherit';
  offerTitle.style.fontSize = textCss.fontSize || '16px';
  offerTitle.style.color = textCss.color;
}


export const createProductImage = (offer, product, addAjax) => {
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

export const createProductLinkWithChildren = (product, addAjax, offer, parentWrapper) => {
  const productLinkEl = document.createElement('a');
  productLinkEl.style.cursor = 'pointer';
  productLinkEl.href = `/products/${product.url}`;

  createProductInfoElements(parentWrapper, addAjax, offer, product);

  if (offer.multi_layout === 'carousel') {
    productLinkEl.style.display = 'table-cell';
    productLinkEl.style.verticalAlign = 'middle';
  }

  return productLinkEl;
}

export const createProductInfoElements = (parentEl, addAjax, offer, product) => {
  if (offer.multi_layout === 'compact') {
    parentEl.appendChild(createProductTitle(product));
    parentEl.appendChild(createPriceEl(addAjax, offer, product));
  } else if (offer.multi_layout === 'carousel') {
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'details';

    let productWrapper = createProductTitle(product);
    detailsContainer.appendChild(createPriceEl(addAjax, offer, product, productWrapper));
    parentEl.appendChild(detailsContainer);
  } else {
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'details';

    detailsContainer.appendChild(createProductTitle(product));
    detailsContainer.appendChild(createPriceEl(addAjax, offer, product));
    parentEl.appendChild(detailsContainer);
  }
}

const createProductTitle = (product) => {
  const productTitleWrapper = document.createElement('div');
  const productTitle = document.createElement('span');

  productTitleWrapper.className = 'product-title-wrapper';
  productTitle.className = 'product-title';

  productTitle.innerHTML = product.title;

  productTitleWrapper.appendChild(productTitle);

  return productTitleWrapper;
}

const createPriceEl = (addAjax, offer, product, productWrapper) => {
  let priceContainer = '';

  if (!productWrapper) {
    priceContainer = document.createElement('div');
  }

  if (offer.show_product_price) {
    if (offer.show_compare_at_price && product.available_json_variants[0].price_is_minor_than_compare_at_price) {
      const productPriceWrapper = document.createElement('span');
      productPriceWrapper.id = `${addAjax ? 'ajax-' : ''}product-price-wrapper-compare-${product.id}`
      productPriceWrapper.className = 'product-price-wrapper compare-at-price money';
      productPriceWrapper.innerHTML = product.available_json_variants[0].compare_at_price;

      if (productWrapper) {
        productWrapper.appendChild(productPriceWrapper)
      } else {
        priceContainer.appendChild(productPriceWrapper);
      }
    }

    const productPrice = document.createElement('span');
    productPrice.id = `${addAjax ? 'ajax-' : ''}product-price-wrapper-${product.id}`
    productPrice.className = 'product-price-wrapper money';
    productPrice.innerHTML = product.available_json_variants[0].unparenthesized_price;

    if (productWrapper) {
      productWrapper.appendChild(productPrice)
    } else {
      priceContainer.appendChild(productPrice);
    }
  }

  if (productWrapper) {
    return productWrapper
  } else {
    return priceContainer;
  }
}

export const createCustomFields = (fieldName, placeholder, id, product) => {

  const customFieldInput = document.createElement('input');
  customFieldInput.className = `custom-field ${product.available_json_variants.length > 1 ? 'inline' : '' }`;
  customFieldInput.type = 'text';
  customFieldInput.name= `properties[${fieldName}]`;
  customFieldInput.id = id;
  customFieldInput.placeholder = placeholder;

  return customFieldInput
}

export const createVariantsWrapper = (addAjax, offer, product, offerSettings) => {

  const variantsWrapper = document.createElement('span');

  variantsWrapper.className = 'variants-wrapper';

  if (product.available_json_variants.length <= 1) {
    variantsWrapper.style.display = 'none';
  }

  const productSelect = document.createElement('select');

  productSelect.id = `${addAjax ? 'ajax-' : ''}product-select-${product.id}`;
  productSelect.onchange = ( e) => handleCollectionChange(e, addAjax, offerSettings);

  generateVariants(productSelect, offer, product);

  variantsWrapper.appendChild(productSelect);

  return variantsWrapper;
}

const generateVariants = (productSelect, offer, product) => {
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

export const createSingleVariant = (product) => {
  const singleVariant = document.createElement('span');

  singleVariant.className = 'single-variant-price money';
  singleVariant.innerHTML = product.available_json_variants[0].price;

  return singleVariant;
}

export const createQuantitySelector = (offer) => {

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

export const createSubscriptionElements = (ctaContainer, offer) => {
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


export const createCtaCSS = (cartButton, offer) => {
  const css_options = checkCSSOptions(offer);
  const buttonCSS = css_options.button;

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

export const createCarouselArrows = (nudgeContainer) => {
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

export const createPoweredBy = (offer) => {
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

export const disableButtonShowSpinner = (ctaContainer, offerSettings) => {
  //Disabled the input button to prevent double click.
  let btn = document.querySelector(`#${ctaContainer.id} .bttn`);
  btn.disabled = true;

  //Optionally replace the button with a spinner
  if (offerSettings.show_spinner) {
    showSpinner(btn);
  }
}

// Next/previous controls
const plusSlides = (slideNum) => {
  showSlides(slideIndex + slideNum);
}

export const showSlides = (nextSlideIndex) => {
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

  if (slides[oldSlideIndex-1].classList.contains('active')) {
    slides[oldSlideIndex-1].classList.remove('active')
  }
  if (!slides[slideIndex-1].classList.contains('active')) {
    slides[slideIndex-1].classList.add('active')
  }
}

export const addCSSToPage = (offer, offerSettings) => {
  const styleFound = document.getElementById('InCartUpsellCSS');

  if (styleFound) {
    styleFound.remove();
  }

  const head = document.head || document.getElementsByTagName('head')[0];

  let style = document.createElement('style');
  style.id = 'InCartUpsellCSS';
  style.appendChild(document.createTextNode(offer.custom_css));

  if (offerSettings.offer_css) {
    style.appendChild(document.createTextNode(offerSettings.offer_css));
  }

  head.appendChild(style);

  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = "https://fonts.googleapis.com/css2?family=Caveat&family=Comfortaa&family=EB+Garamond&family=Lexend&family=Lobster&family=Lora&family=Merriweather&family=Montserrat&family=Oswald&family=Pacifico&family=Playfair+Display&family=Roboto&family=Spectral&display=swap";
  head.appendChild(linkElement);
};

const handleCollectionChange = (e, addAjax, offerSettings) => {
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

const showSpinner = (btn) => {
  let myHeight = btn.offsetHeight - parseInt(btn.style.paddingTop) - parseInt(btn.style.paddingBottom);

  if ((btn.parentElement.offsetWidth - btn.offsetWidth) >= 50) {
    const myPadding = (btn.offsetWidth - myHeight) / 2;
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

const checkCSSOptions = (offer) => {
  if (Object.keys(offer.css_options).length === 0) {
    return {
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
      }
    }
  } else {
    return offer.css_options
  }
}
