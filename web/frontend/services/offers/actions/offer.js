import { api } from "../../api";
import { OFFER_ACTIVATE, LOAD_OFFER_DETAILS, OFFER_SETTINGS } from "../endpoints/offer";

export function offerActivate(offer_id, shop_id) {
  return api.post(OFFER_ACTIVATE, {
    offer_id: offer_id,
    shop_id: shop_id
  });
};

export function loadOfferDetails(shopify_domain, offer_id) {
  return api.post(LOAD_OFFER_DETAILS, {
    offer: { offer_id: offer_id},
    shop: shopify_domain
  })
};

export function getOfferSettings(shopify_domain, include_sample_products) {
  return api.post(OFFER_SETTINGS, {
    offer: {include_sample_products: include_sample_products},
    shop: shopify_domain
  })
}
