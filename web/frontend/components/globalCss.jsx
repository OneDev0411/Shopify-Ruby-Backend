import {TextField} from "@shopify/polaris";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useAuthenticatedFetch, useShopSettings} from "../hooks/index.js";
import {useShopState} from "../contexts/ShopContext.jsx";
import {LoadingSpinner} from "./atoms/index.js";

export default function GlobalCss() {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const { shopSettings, setShopSettings, updateShopSettingsAttributes } = useShopState();
  const { fetchShopSettings } = useShopSettings();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchShopSettings({admin: null})
      .then((response) => response.json() )
      .then((data) => {
        setShopSettings(data.shop_settings);
        setIsLoading(false)
      })
  }, [])

 return (
   isLoading ?
     <LoadingSpinner />
   :
     <TextField
       value={shopSettings?.offer_css}
       onChange={(offer_css) => updateShopSettingsAttributes(offer_css, 'offer_css')}
       multiline={6}
       autoComplete={'off'}
       label={''}
     />
 )
}