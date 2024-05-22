export const isCartPage = () => {
  return /\/cart\/?$/.test(window.location.pathname);
};

export const isProductPage = () => {
  return window.location.pathname.includes("/products/");
};

export const isCollectionsPage = () => {
  return window.location.pathname.includes("/collections/");
};

export const currentPage = ()  =>  {
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

export const setProductsCurrency = (offer) => {
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


export const addDiscountToCart = (discount_code) => {
  return fetch(
    "/discount/" + encodeURIComponent(discount_code), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
  ).catch(error => console.log(error));
}

export const currencyIsSet = () => {
  return !!(Shopify && Shopify.currency && Shopify.currency.active);
};

export const getQuantity = (ctaContainer) => {
  let quantity = document.querySelector(`#${ctaContainer.id} #quantity-select`)?.value;
  if (quantity) {
    quantity = parseInt(quantity)
  }
  return quantity || 1;
}

export const trackEvent = (action, offerId, abTestVersion, isAnAjaxCall) => {  // send marketing data
  const statsURL = 'https://stats-rails.incartupsell.com';

  let url = statsURL + "/stats/create_stats?icu=1";

  let opts = {
    action: action,
    offerId: offerId,
    offerVariant: abTestVersion,
    page: currentPage(),
    method: isAnAjaxCall ? 'ajax' : 'regular'
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
      console.log('Error:', error);
    });
};

export const redirectToProductPage = (currentOffer, selectedShopifyVariant) => {
  let current_product;
  let products = currentOffer.offerable_product_details

  for (let productDetails of products) {
    for (let jsonVariant of productDetails.available_json_variants) {
      if (parseInt(jsonVariant.id) === parseInt(selectedShopifyVariant)) {
        current_product = productDetails;
        break;
      }
    }
  }

  if (current_product) {
    document.location = `/products/${current_product.url}`;
  }
};

export const getSelectedVariant = (ctaContainer) => {
  let variant = document.querySelector(`#${ctaContainer.id} [id*="product-select"]` )?.value;

  if (!variant) {
    variant = document.querySelector(`#${ctaContainer.id} [id*="product-select"] option:first-of-type` )?.value;
  }

  return variant;
}

export const areCustomFieldsEmpty = (ctaContainerID, cFields) => {
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

export const buildPropertiesFromCustomFields = (ctaContainerID, cFields) => {
  let properties = {};

  cFields.map( cField => {
    properties['Custom Text'] = document.querySelector(`#${ctaContainerID} #${cField.id}`)?.value;
  })

  return properties;
};