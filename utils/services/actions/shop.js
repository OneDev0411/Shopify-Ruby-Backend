import { api } from "../api";
import { CURRENT_SHOP, UPDATE_ACTIVATION } from "../endpoints/shop";

export function getShop(shopify_domain) {
  return api.get(CURRENT_SHOP, {
    params:{
      shop: shopify_domain
    }
  });
}

export function toggleActivation(shopify_domain) {
  return api.get(UPDATE_ACTIVATION, {
    params:{
      shop: shopify_domain
    }
  });
}