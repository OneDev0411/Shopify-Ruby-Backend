import {createContext, useState} from 'react';
import {OFFER_DEFAULTS} from "./shared/constants/EditOfferOptions.js";

export default function OfferProvider({ children }) {
  const [offer, setOffer] = useState(OFFER_DEFAULTS);

  //Called whenever the offer changes in any child component
  function updateOffer(updatedKey, updatedValue) {
    setOffer(previousState => {
      return {...previousState, [updatedKey]: updatedValue};
    });
  }

  // Called to update offerable_product_details and offerable_product_shopify_ids of offer
  function updateProductsOfOffer(data) {
    setOffer(previousState => {
      return {...previousState, offerable_product_details: [...previousState.offerable_product_details, data],};
    });
    setOffer(previousState => {
      return {
        ...previousState,
        offerable_product_shopify_ids: [...previousState.offerable_product_shopify_ids, data.id],
      };
    });
  }
  const test = "test from context"
  return (
    <OfferContext.Provider
      value={{offer, setOffer, updateOffer, updateProductsOfOffer, test}}
    >
      {children}
    </OfferContext.Provider>
  );
}

export const OfferContext = createContext({});