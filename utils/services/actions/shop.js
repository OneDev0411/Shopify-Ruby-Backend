import { api } from "../api";
import { CURRENT_SHOP } from "../endpoints/shop";

export function getShop(shopify_domain) {
  return api.get(CURRENT_SHOP, {
    params:{
      shop: shopify_domain
    }
  });
}
