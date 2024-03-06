import { useAuthenticatedFetch } from "./useAuthenticatedFetch.js";
import { useSelector } from "react-redux";

export const useShopSettings = () => {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const authFetch = useAuthenticatedFetch(shopAndHost.host);

  const fetchShopSettings = async (shopAttr) => {
    const response = await authFetch(`/api/merchant/shop_settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({shopAttr, shop: shopAndHost.shop})
    })
    return response;
  };


  const updateShopSettings = async (shopAttr) => {
    const response = await authFetch('/api/merchant/update_shop_settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shopAttr, shop: shopAndHost.shop, admin: shopAttr.admin, json: true }),
    })
    return response;
  };

  return { fetchShopSettings, updateShopSettings }
}