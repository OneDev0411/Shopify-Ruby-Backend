import { api } from "../../api";
import { OFFER_ACTIVATE } from "../endpoints/offer";

export function offerActivate(offer_id, shop_id) {
  return api.post(OFFER_ACTIVATE, {
    offer_id: offer_id,
    shop_id: shop_id
  });
};