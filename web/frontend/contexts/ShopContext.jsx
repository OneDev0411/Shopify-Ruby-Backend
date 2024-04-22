import {createContext, useContext, useEffect, useRef, useState} from 'react';

const ShopContext = createContext({});

export const SETTINGS_DEFAULTS = {
  shop_id: undefined,
  offer_css: '',
  css_options: {
    main: {
      color: "#2B3D51",
      backgroundColor: "#ECF0F1",
      marginTop: '0px',
      marginBottom: '0px',
      borderStyle: 'none',
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#000"
    },
    text: {
      fontFamily: "Arial",
      fontSize: '16px',
      color: "#000"
    },
    button: {
      color: "#FFFFFF",
      backgroundColor: "#2B3D51",
      fontFamily: "Arial",
      fontSize: "16px",
      borderRadius: 0,
      borderColor: "#000"
    },
  }
}

export default function ShopProvider({ children }) {
  const [shop, setShop] = useState({});
  const [planName, setPlanName] = useState("");
  const [trialDays, setTrialDays] = useState();
  const [hasOffers, setHasOffers] = useState();
  const [shopSettings, setShopSettings] = useState({...SETTINGS_DEFAULTS});
  const [isSubscriptionUnpaid, setIsSubscriptionUnpaid] = useState(null);
  const [themeAppExtension, setThemeAppExtension] = useState();

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

  return (
    <ShopContext.Provider
      value={{
        shop,
        setShop,
        planName,
        setPlanName,
        trialDays,
        setTrialDays,
        hasOffers,
        setHasOffers,
        updateShopSettingsAttributes,
        shopSettings,
        setShopSettings,
        themeAppExtension,
        setThemeAppExtension,
        isSubscriptionUnpaid,
        setIsSubscriptionUnpaid
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

// custom hook
export const useShopState = () => {
  const ctx = useContext(ShopContext);

  if (!ctx) {
    throw new Error("useShop must be used within the ShopProvider");
  }

  return ctx;
};