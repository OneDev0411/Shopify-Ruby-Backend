import { useState, useEffect } from "react";
import { VerticalStack } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { OfferEdit } from "./OfferEdit";

export function OffersList() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading]   = useState(true);
  const [offersData, setOffersData] = useState([]);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const info = {offer: { shop_domain: window.location.host }};

  // useEffect(()=>{
  //   setIsLoading(true);
  //   fetch('/api/v1/offers_list', {
  //     method: 'POST',
  //     mode: 'cors',
  //     cache: 'no-cache',
  //     credentials: 'same-origin',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     redirect: 'follow',
  //     referrerPolicy: 'no-referrer',
  //     body: JSON.stringify(info),
  // })
  //     .then((response) => response.json())
	//     .then((data) => {
  //       console.log('API Data >>> ', data);
  //       localStorage.setItem('icushopify_domain', data.shopify_domain);
  //       setOffersData(data.offers);
  //       setIsLoading(false);
  //     }).catch((error) => {
  //       console.log('Fetch error >> ', error);
  //     });
  // },[]);


  return (
    <>
       <VerticalStack spacing="loose">
          <div>
           {offersData.map((offer, index) => {
             return <OfferEdit data={offer} key={index} />;
           })}
          </div>
        </VerticalStack>
    </>
  );
}
