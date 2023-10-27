import { api } from "../../api";
import { OFFER_ACTIVATE, LOAD_OFFER_DETAILS, OFFER_SETTINGS, OFFER_DEACTIVATE, OFFERS_LIST } from "../endpoints/offer";

export function offerActivate(offer_id, shop_id) {
  return api.post(OFFER_ACTIVATE, {
    offer_id: offer_id,
    shop_id: shop_id
  });
};

export const loadOfferDetails = async (offer_id, shopify_domain) => {
  try {
    const response = await api.post(LOAD_OFFER_DETAILS, {
      offer: { offer_id: offer_id},
      shop: shopify_domain,
    });
    return response;
    } catch (error) {
      throw error;
    }
}

export const activateOffer = async (offer_id, shopify_domain) => {
  try {
    const response = await api.post(OFFER_ACTIVATE, {
      offer: { offer_id: offer_id},
      shop: shopify_domain,
    });
    return response;
    } catch (error) {
      throw error;
    }
}

export const deactivateOffer = async (offer_id, shopify_domain) => {
  try {
    const response = await api.post(OFFER_DEACTIVATE, {
      offer: { offer_id: offer_id},
      shop: shopify_domain,
    });
    return response;
    } catch (error) {
      throw error; 
    }
}

export const createDuplicateOffer = async (offer_id, shopify_domain) => {
  try {
    const response = await api.post(`offers/${offer_id}/duplicate`, {
      offer_id: offer_id,
      shop: shopify_domain,
    });
    return response;
    } catch (error) {
      throw error; 
    }
}

export const deleteOffer = async (offer_id, shopify_domain) => {
  try {
    const response = await api.delete(`offers/${offer_id}`, {
      data: {
        offer_id: offer_id,
        shop: shopify_domain,
      }
    });
    return response;
  } catch (error) {
    throw error; 
  }
}

export const getOfferList = async (shopify_domain) => {
  try {
    const response = await api.post(OFFERS_LIST, {
      shop: shopify_domain,
    });
    return response;
    } catch (error) {
      throw error; 
    }
}

export const getAbAnalytics = async (offer_id, shopify_domain, version) => {
  try {
    const response = await api.post('offers/load_ab_analytics', {
      offer_id: offer_id,
      shop: shopify_domain,
      version: version
    });
    return response;
    } catch (error) {
      throw error; 
    }
}

export function getOfferSettings(shopify_domain, include_sample_products) {
  return api.post(OFFER_SETTINGS, {
    offer: {include_sample_products: include_sample_products},
    shop: shopify_domain
  })
}
