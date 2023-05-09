import { api } from "../api";
import { PUT, CONFIRM_CHARGE } from "../endpoints/subscription";

export function updateSubscription(plan_internal_name, shop, shop_id) {
  return api.put(PUT, {
    subscription: {
      plan_internal_name: plan_internal_name
    },
    shop: shop,
    shop_id: shop_id
  });
}

export function confirmCharge(shop, charge_id){
  return api.get(CONFIRM_CHARGE, {
    params:{
      shop: shop,
      charge_id: charge_id
    }
  });
}
