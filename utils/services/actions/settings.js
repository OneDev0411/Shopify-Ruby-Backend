import { api } from "../api";
import { UPDATE_SHOP_SETTINGS } from "../endpoints/settings";

export function setShopSettings(shop_params) {
  return api.patch(UPDATE_SHOP_SETTINGS, {
    shop: shop_params,
    shop_id: 1
  });
}
