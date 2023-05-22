import { api } from "../../api";
import { OFFER_ACTIVATE, LOAD_OFFER_DETAILS, OFFER_SETTINGS } from "../endpoints/offer";

export function offerActivate(offer_id, shop_id) {
  return api.post(OFFER_ACTIVATE, {
    offer_id: offer_id,
    shop_id: shop_id
  });
};

export function loadOfferDetails(shop_id, offer_id) {
  return api.post(LOAD_OFFER_DETAILS, {
    offer: {shop_id: shop_id, offer_id: offer_id}
  })
};

export function offerSettings(shop_id, include_sample_products) {
  return api.post(OFFER_SETTINGS, {
    offer: {shop_id: shop_id, include_sample_products: include_sample_products}
  })
}
