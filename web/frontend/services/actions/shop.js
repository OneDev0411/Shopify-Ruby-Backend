import { api } from "../api";
import { CURRENT_SHOP, UPDATE_ACTIVATION, UPDATE_SHOP_SETTINGS, SHOP_OFFERS_STATS } from "../endpoints/shop";

export function getShop(shopify_domain) {
  return api.get(CURRENT_SHOP, {
    params:{
      shopify_domain: shopify_domain
    }
  });
}

export function setShopSettings(shop_params, shop_id) {
  return api.patch(UPDATE_SHOP_SETTINGS, {
    shop: shop_params,
    shop_id: shop_id
  });
}

export function toggleShopActivation(shopify_domain) {
  return api.get(UPDATE_ACTIVATION, {
    params:{
      shopify_domain: shopify_domain
    }
  });
}

export const getShopOffersStats = async (shopify_domain, period) => {
  try {
    const response = await api.post(SHOP_OFFERS_STATS, {
      shop: shopify_domain,
      period: period,
    });
    return response;
    } catch (error) {
      console.log('An error occurred while making the API call:', error);
      return null; 
    }
}