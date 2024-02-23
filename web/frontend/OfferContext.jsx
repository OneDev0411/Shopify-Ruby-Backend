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

  //Called whenever the shop changes in any child component
  function updateNestedAttributeOfOffer(updatedValue, ...updatedKey) {
    if(updatedKey.length == 1) {
      setOffer(previousState => {
        return { ...previousState, [updatedKey[0]]: updatedValue };
      });
    }
    else if(updatedKey.length == 2) {
      setOffer(previousState => ({
        ...previousState,
        [updatedKey[0]]: {
          ...previousState[updatedKey[0]],
          [updatedKey[1]]: updatedValue
        }
      }));
    }
    else if(updatedKey.length == 3) {
      setOffer(previousState => ({
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

  // Called to update the included variants in offer
  function updateIncludedVariants(selectedItem, selectedVariants) {
    const updatedOffer = {...offer};
    if (Array.isArray(selectedItem)) {
      for (var key in selectedVariants) {
        updatedOffer.included_variants[key] = selectedVariants[key];
      }
    } else {
      updatedOffer.included_variants[selectedItem] = selectedVariants;
    }
    setOffer({...updatedOffer});
  }

  return (
    <OfferContext.Provider
      value={{offer, setOffer, updateOffer, updateProductsOfOffer, updateIncludedVariants, updateNestedAttributeOfOffer}}
    >
      {children}
    </OfferContext.Provider>
  );
}

export const OfferContext = createContext(OFFER_DEFAULTS);
