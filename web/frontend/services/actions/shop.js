import { api } from "../api";
import { CURRENT_SHOP, UPDATE_ACTIVATION, UPDATE_SHOP_SETTINGS } from "../endpoints/shop";

export function getShop(shopify_domain) {
  return api.get(CURRENT_SHOP, {
    params:{
      shopify_domain: shopify_domain
    }
  });
}

export function setShopSettings(shop_params, shop_id) {
  return api.patch(UPDATE_SHOP_SETTINGS, {
    shopify_domain: shop_params,
    shop_id: shop_id
  });
}

export function toggleShopActivation(shopify_domain) {
  return api.get(UPDATE_ACTIVATION, {
    params:{
      shopify_domain: shopify_domain
    }
  });
}