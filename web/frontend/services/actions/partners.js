import { api } from "../api";
import { GET_ALL_PARTNERS } from "../endpoints/partners";

export function getPartners(shop_params) {
  return api.get(GET_ALL_PARTNERS);
}
