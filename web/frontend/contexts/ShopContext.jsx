import { createContext, useState } from 'react';
import { OFFER_DEFAULTS } from "./shared/constants/EditOfferOptions.js";

const SETTINGS_DEFAULTS = {
  shop_id: undefined,
  offer_css: '',
  css_options: {
    main: {},
    text: {},
    button: {},
  }
}
export default function ShopSettingProvider({ children }) {
  const [shopSettings, setShopSettings] = useState({...SETTINGS_DEFAULTS});

  //Called whenever the shop changes in any child component
  function updateShopSettingsAttributes(updatedValue, ...updatedKey) {
    if (updatedKey.length == 1) {
      setShopSettings(previousState => {
        return {...previousState, [updatedKey[0]]: updatedValue};
      });
    } else if (updatedKey.length == 2) {
      setShopSettings(previousState => ({
        ...previousState,
        [updatedKey[0]]: {
          ...previousState[updatedKey[0]],
          [updatedKey[1]]: updatedValue
        }
      }));
    } else if (updatedKey.length == 3) {
      setShopSettings(previousState => ({
        ...previousState,
        [updatedKey[0]]: {
          ...previousState[updatedKey[0]],
          [updatedKey[1]]: {
            ...previousState[updatedKey[0]][updatedKey[1]],
            [updatedKey[2]]: updatedValue
          }
        }
      }));
    }
  }

  function resetSettings () {
    setShopSettings(SETTINGS_DEFAULTS);
  }

  return (
    <ShopSettingContext.Provider
      value={{shopSettings, setShopSettings, updateShopSettingsAttributes, resetSettings}}
    >
      {children}
    </ShopSettingContext.Provider>
  );
}

export const ShopSettingContext = createContext(OFFER_DEFAULTS);