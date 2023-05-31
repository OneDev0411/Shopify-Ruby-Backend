import { api } from "../api";
import { PUT_SUBSCRIPTION, CONFIRM_CHARGE, CURRENT_SUBSCRIPTION } from "../endpoints/subscription";

export function getSubscription(shopify_domain) {
  return api.get(CURRENT_SUBSCRIPTION, {
    params:{
      shop: shopify_domain
    }
  });
}

export function updateSubscription(plan_internal_name, shopify_domain) {
  return api.put(PUT_SUBSCRIPTION, {
    subscription: {
      plan_internal_name: plan_internal_name
    },
    shop: shopify_domain,
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

export function isSubscriptionActive(subscription){
  return subscription?.status === "approved"
}