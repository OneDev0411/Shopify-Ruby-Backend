import { api } from "../api";
import { GET } from "../endpoints/partners";

export function getPartners(shop_params) {
  return api.get(GET);
}
