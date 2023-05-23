import { api } from "../api";
import { CURRENT_SHOP, UPDATE_ACTIVATION, UPDATE_SHOP_SETTINGS } from "../endpoints/shop";

export function getShop(shopify_domain) {
  return api.get(CURRENT_SHOP, {
    params:{
      shop: shopify_domain
    }
  });
}

export function setShopSettings(shop_params) {
  return api.patch(UPDATE_SHOP_SETTINGS, {
    shop: shop_params,
    shop_id: 3
  });
}

export function toggleShopActivation(shopify_domain) {
  return api.get(UPDATE_ACTIVATION, {
    params:{
      shop_id: shopify_domain
    }
  });
}