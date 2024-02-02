import {
  Page,
  AppProvider,
  Badge,
  Grid,
  VerticalStack,
  Spinner,
} from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GenericFooter } from "../components";
import Summary from "../components/Summary";
import Details from "../components/OfferDetails";
import { OfferPreview } from "../components/OfferPreview";
import { useAuthenticatedFetch } from "../hooks";
import AbAnalytics from "../components/abAnalytics";
import "../components/stylesheets/mainstyle.css";
import EditOfferViewSkeleton from "../skeletons/EditOfferViewSkeleton";

const EditOfferView = () => {
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const [isLoading, setIsLoading] = useState(false);
  const offerID = localStorage.getItem('Offer-ID');
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [offerStatus, setOfferStatus] = useState('');
  const [initialOfferableProductDetails, setInitialOfferableProductDetails] = useState();
  const [checkKeysValidity, setCheckKeysValidity] = useState({});
  const [offer, setOffer] = useState({});
  const navigateTo = useNavigate();
  const handleEditOffer = (offer_id) => {
    navigateTo('/edit-offer', { state: { offerID: offer_id } });
  }

  const handleOfferActivation = () => {
    fetch(`/api/merchant/offer_activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offer: { offer_id: offerID }, shop: shopAndHost.shop })
    })
    .then((response) => response.json())
    .then(() => {
      offer.active = true;
      setOfferStatus('published');
    })
    .catch((error) => {
      console.error('An error occurred while making the API call:', error);
    })
  }

  const handleOfferDeactivation = () => {
    fetch('/api/merchant/offer_deactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offer: { offer_id: offerID }, shop: shopAndHost.shop })
    })
    .then((response) => response.json())
    .then((data) => {
      offer.active = false;
      setOfferStatus('draft');
    })
    .catch((error) => {
      console.error('An error occurred while making the API call:', error);
    })
  }

  const handleDuplicateOffer = () => {
    fetch(`/api/merchant/offers/${offerID}/duplicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offer_id: offerID, shop: shopAndHost.shop })
    })
      .then((response) => response.json())
      .then(() => {
        navigateTo('/offer')
      })
      .catch((error) => {
        console.error('An error occurred while making the API call:', error);
      })
  }

  const handleDeleteOffer = () => {
    fetch(`/api/merchant/offers/${offerID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offer_id: offerID, shop: shopAndHost.shop })
    })
      .then((response) => response.json())
      .then(() => {
        navigateTo('/offer');
      })
      .catch((error) => {
        console.error('An error occurred while making the API call:', error);
      })
  }

  useEffect(() => {
    if (offerID != null) {
      setIsLoading(true);
      fetch(`/api/merchant/load_offer_details`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({offer: {offer_id: offerID}, shop: shopAndHost.shop}),
      })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
          setOffer({...data});
          setInitialOfferableProductDetails(data.offerable_product_details);
          setIsLoading(false);
          offer.publish_status == 'published' ? setOfferStatus('published') : setOfferStatus('draft');
          if (data.offerable_product_details.length > 0) {
            updateCheckKeysValidity('text', data.text_a.replace("{{ product_title }}", data.offerable_product_details[0]?.title));
          }
          updateCheckKeysValidity('cta', data.cta_a);
          setIsLoading(false);
        })
        .catch((error) => {
            console.log("Error > ", error);
        })
  }
  },[offer.publish_status]);

  function updateCheckKeysValidity(updatedKey, updatedValue) {
    setCheckKeysValidity(previousState => {
        return {...previousState, [updatedKey]: updatedValue};
    });
  }
  return (
    <AppProvider i18n={[]}>
      <div className="page-space">
        {isLoading ? (
          <EditOfferViewSkeleton />
        ) : (
          <>
            <Page
              backAction={{onAction: () => {
                navigateTo('/offer')
              }}}
              title={offer.title}
              titleMetadata={
                offerStatus == "published" ? (
                  <Badge status="success">Published</Badge>
                ) : (
                  <Badge>Unpublished</Badge>
                )
              }
              secondaryActions={[
                {
                  content: (offerStatus == 'draft') ? 'Publish' : 'Unpublish',
                  onAction: () => offerStatus == 'draft' ? handleOfferActivation() : handleOfferDeactivation(),
                },
                {
                  content: 'Edit', 
                  onAction: () => handleEditOffer(offerID),
                },
              ]}
              actionGroups={[
                {
                  title: 'More Actions',
                  actions: [
                    {
                      content: 'Duplicate',
                      accessibilityLabel: 'Individual action label',
                      onAction: () => handleDuplicateOffer(),
                    },
                    {
                      content: 'Delete',
                      accessibilityLabel: 'Individual action label',
                      onAction: () => handleDeleteOffer(),
                    },
                  ],
                },
              ]}
            >
              <div className="grid-space">
                <Grid>
                  <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 8, xl: 8}}>
                    <div className="widget-visibility">
                      <OfferPreview offer={offer} checkKeysValidity={checkKeysValidity} updateCheckKeysValidity={updateCheckKeysValidity} previewMode/>
                    </div>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 4, xl: 4}}>
                    <VerticalStack gap="5">
                      <Details offer={offer} offerableProducts={initialOfferableProductDetails}/>
                      <Summary offer={offer}/>
                      <AbAnalytics offerId={offerID}/>
                    </VerticalStack>
                  </Grid.Cell>
                </Grid>
              </div>
              <GenericFooter text='Learn more about ' linkUrl='#' linkText='offers'></GenericFooter>
            </Page>
          </>
        )}
      </div>
    </AppProvider>
  );
  }

export default EditOfferView
