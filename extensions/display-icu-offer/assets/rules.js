import {
  isCartPage,
  isProductPage
} from "./helpers.js";

let customerTags = [];
let customerCountryCode = '';
let itemsInCart = [];
let cartTotalPrice = 0.0;
let cartToken = '';
let collections = [];

export const checkPageRules = async (offer) => {
  let pageRulesResults = [];

  if (offer?.rules) {
    for (let rule of offer.rules) {
      let ruleResult = await pageSatisfiesRule(rule);
      pageRulesResults.push(ruleResult);
    }
  }

  if (pageRulesResults.length > 0) {
    if ((offer.ruleset_type === "or" && pageRulesResults.includes(true)) ||
      (offer.ruleset_type === "and" && !pageRulesResults.includes(false)))  {
      return true;
    }
  } else {
    return true
  }

  return false
}

export const checkCartRules = async (offer) => {

  let cartRulesResults = [];

  if (offer?.rules) {
    for (let rule of offer.rules) {
      let ruleResult = await cartSatisfiesRule(rule);
      cartRulesResults.push(ruleResult);
    }
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

export const pageSatisfiesOfferConditions = async (offer) => {
  return (!isOfferDismissed(offer) &&
    !(offer.stop_showing_after_accepted && isOfferAlreadyAccepted(offer) && await doesCartContainOffer(offer)) &&
    ((offer.in_cart_page && isCartPage()) || (offer.in_product_page && isProductPage()) || offer.in_ajax_cart))
}

const isOfferDismissed = (offer) => {
  let dismissedOffers = localStorage.getItem("ignored_offers");

  if (dismissedOffers) {
    dismissedOffers = JSON.parse(dismissedOffers);

    return dismissedOffers.includes(`${offer.id}`);
  }

  return false;
}

export const isOfferAlreadyAccepted = (offer) => {
  let accepted_offers = localStorage.getItem("accepted_offers");

  if (accepted_offers) {
    accepted_offers = JSON.parse(accepted_offers);
    return accepted_offers.includes(`${offer.id}`);
  } else {
    return false;
  }

}

const pageSatisfiesRule = async (rule) => {
  const ruleSelector = rule.rule_selector;
  const itemType = rule.item_type;
  const itemShopifyID = rule.item_shopify_id;
  const itemName = rule.item_name;

  if (ruleSelector.includes('customer')) {
    await fetchCustomerTags();
  }

  if (ruleSelector === "on_product_this_product_or_in_collection")           return await visibleOnProductOrColRule(itemType, itemShopifyID, true);
  if (ruleSelector === "on_product_not_this_product_or_not_in_collection")   return await visibleOnProductOrColRule(itemType, itemShopifyID, false);

  if (ruleSelector === "url_contains")                                       return visibleIfUrlRule(itemName, true);
  if (ruleSelector === "url_does_not_contain")                               return visibleIfUrlRule(itemName, false);

  if (ruleSelector === "cookie_is_set")                                      return hasCookie(itemName);
  if (ruleSelector === "cookie_is_not_set")                                  return !hasCookie(itemName);

  if (ruleSelector === "customer_is_tagged")                                 return customerTags.includes(itemName);
  if (ruleSelector === "customer_is_not_tagged")                             return !customerTags.includes(itemName);

  if (ruleSelector === "in_location")                                        return customerCountryCode === itemName;
  if (ruleSelector === "not_in_location")                                    return !customerCountryCode === itemName;

  return true;
};

const fetchCustomerTags = () => {
  return fetch('/apps/in-cart-upsell/customer_tags')
    .then(resp => resp.json())
    .then( data => {
      customerTags = data
    });
}

export const setGeoOffers = () => {
  const locallyStoredCountry = localStorage.getItem('country');

  if (!locallyStoredCountry) {
    fetch('https://get.geojs.io/v1/ip/country.json')
      .then(response => {
        return response.json();
      })
      .then( locationData => {
        customerCountryCode = locationData.country;
        localStorage.setItem('country', customerCountryCode);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  } else {
    customerCountryCode = locallyStoredCountry
  }
}

const cartSatisfiesRule = async (rule) => {
  let ruleSelector = rule.rule_selector;
  const itemType = rule.item_type;
  const itemShopifyID = rule.item_shopify_id;
  const ruleQuantity = parseInt(rule.quantity);
  const itemName = rule.item_name;
  let ruleAmount = rule.amount;

  if (!rule.amount) {
    if (typeof itemName === 'string') {
      ruleAmount = parseInt(itemName);
    } else {
      ruleAmount = itemName
    }
  }

  if (ruleSelector === "cart_at_least")                                      return await visibleIfCartQuantityRule(itemType, itemShopifyID, ruleQuantity, true);
  if (ruleSelector === "cart_at_most")                                       return await visibleIfCartQuantityRule(itemType, itemShopifyID, ruleQuantity, false);

  if (ruleSelector === "cart_exactly")                                       return await visibleIfCartEqualsRule(itemType, itemShopifyID, ruleQuantity);

  if (ruleSelector === "cart_does_not_contain")                              return await visibleIfCartDoesNotContainRule(itemType, itemShopifyID, ruleQuantity);

  if (ruleSelector === "cart_contains_variant")                              return itemsInCart.some(item => item.variantID === itemShopifyID);
  if (ruleSelector === "cart_does_not_contain_variant")                      return !itemsInCart.some(item => item.variantID === itemShopifyID);

  if (ruleSelector === "cart_contains_item_from_vendor")                     return itemsInCart.some(item => item.vendor === itemName);
  if (ruleSelector === "cart_does_not_contain_item_from_vendor")             return !itemsInCart.some(item => item.vendor === itemName);

  if (ruleSelector === "total_at_least")                                     return cartTotalPrice >= ruleAmount;
  if (ruleSelector === "total_at_most")                                      return cartTotalPrice <= ruleAmount;

  if (ruleSelector === "cart_contains_recharge")                             return itemsInCart.some(item => item?.rechargeID === itemName);
  if (ruleSelector === "cart_does_not_contain_recharge")                     return !itemsInCart.some(item => item?.rechargeID === itemName);

  return true;
}

const visibleOnProductOrColRule = async (itemType, itemShopifyID, isEqualRule) => {
  let isVisible = false;

  if (itemType === 'product') {
    let currentProductID = await currentProductPageProductID();
    isVisible = itemShopifyID === currentProductID
  } else if (itemType === 'collection') {
    await getCollection();
    isVisible = collections.some(col => col.collects_json.includes(itemShopifyID));
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

const hasCookie = (cookieName) => {
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookies = decodedCookie.split(';');

  return cookies.some( cookie => {
    let trimmedCookie = cookie.trimStart();

    return trimmedCookie.startsWith(`${cookieName}=`);
  })
};

export const fetchCart = (offerSettings) => {
  if (offerSettings.uses_customer_tags) {
    return fetch('/apps/in-cart-upsell/customer_tags')
      .then(resp => resp.json())
      .then( data => {
        customerTags = data

        return getCurrentCartItems();
      });
  } else {
    return getCurrentCartItems();
  }
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

export const getCurrentCartItems = () => {
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

export const doesCartContainOffer = async (offer) => {

  let cartProductIDs = itemsInCart.map(cartItem => cartItem.productID);

  return offer.offerable_product_shopify_ids.some(productID => cartProductIDs.includes(productID));
};

export const removeInvalidOffers = (offersToRemoveFromCart) => {
  let updates = {};

  offersToRemoveFromCart.map( off => {

    off.offerable_product_details.map( productDetails => {

      if (itemsInCart.some(item => item.productID === productDetails.id)) {

        productDetails.available_json_variants.map( jsonVariant => {
          let productLine = itemsInCart.find(item => parseInt(item.variantID) === parseInt(jsonVariant.id));
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
        console.log('Error:', error);
      });
  }
};

const getCollection = () => {
  return fetch(`/apps/in-cart-upsell/shop_collections`)
    .then(response => response.json())
    .then(collectionData => {
      collections = collectionData.collection;
    });
}

export const getItemsInCart = () => {
  return itemsInCart;
}

const currentProductPageProductID = () => {
  return fetch(`${window.location.pathname}.js`)
    .then(response => response.json())
    .then(productData => productData.id);
}