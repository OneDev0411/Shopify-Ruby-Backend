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
import {
  loadOfferDetails,
  activateOffer,
  deactivateOffer,
  createDuplicateOffer,
  deleteOffer,
} from "../services/offers/actions/offer";
import AbAnalytics from "../components/abAnalytics";

const EditOfferView = () => {
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const [isLoading, setIsLoading] = useState(false);
  const offerID = localStorage.getItem('Offer-ID');
  const [offerStatus, setOfferStatus] = useState('');
  const [initialOfferableProductDetails, setInitialOfferableProductDetails] = useState();
  const [checkKeysValidity, setCheckKeysValidity] = useState({});

  const [offer, setOffer] = useState({});

  const navigateTo = useNavigate();

  const handleEditOffer = (offer_id) => {
    navigateTo('/edit-offer', { state: { offerID: offer_id } });
  }

  const handleOfferActivation = (shopify_domain, offer_id) => {
    activateOffer(offer_id, shopify_domain)
    .then((response) => {
      if (response) {
        offer.active = true;
        setOfferStatus('published')
      } 
    })
    .catch((error) => {
      console.error('An error occurred while making the API call:', error);
    });
  }

  const handleOfferDeactivation = (shopify_domain, offer_id) => {
    deactivateOffer(offer_id, shopify_domain)
    .then((response) => {
      if (response) {
        offer.active = false;
        setOfferStatus('draft');
      } 
    })
    .catch((error) => {
      console.error('An error occurred while making the API call:', error);
    });
  }

  const handleDuplicateOffer = (offer_id, shopify_domain) => {
    createDuplicateOffer(offer_id, shopify_domain)
    .then((response) => {
      if (response) {
        navigateTo('/offer')
      } 
    })
    .catch((error) => {
      console.error('An error occurred while making the API call:', error);
    });
  }

  const handleDeleteOffer = (offer_id, shopify_domain) => {
    deleteOffer(offer_id, shopify_domain)
    .then((response) => {
      if (response) {
        navigateTo('/offer')
      } 
    })
    .catch((error) => {
      console.error('An error occurred while making the API call:', error);
    });
  }

  useEffect(() => {
    if (offerID != null) {
      setIsLoading(true);
      loadOfferDetails(offerID, shopAndHost.shop)
      .then((response) => {
        if (response) {
          setOffer({...response});
          setInitialOfferableProductDetails(response.offerable_product_details);
          setIsLoading(false);
          offer.publish_status == 'published' ? setOfferStatus('published') : setOfferStatus('draft');
          if (response.offerable_product_details.length > 0) {
            updateCheckKeysValidity('text', response.text_a.replace("{{ product_title }}", response.offerable_product_details[0]?.title));
          }
          updateCheckKeysValidity('cta', response.cta_a);
        } 
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('An error occurred while making the API call:', error);
      });
      setIsLoading(false);
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
          <div style={{
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
          }}>
            <Spinner size="large" color="teal"/>
          </div>
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
                  onAction: () => offerStatus == 'draft' ? handleOfferActivation(shopAndHost.shop, offerID) : handleOfferDeactivation(shopAndHost.shop, offerID),
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
                      onAction: () => handleDuplicateOffer(offerID, shopAndHost.shop),
                    },
                    {
                      content: 'Delete',
                      accessibilityLabel: 'Individual action label',
                      onAction: () => handleDeleteOffer(offerID, shopAndHost.shop),
                    },
                  ],
                },
              ]}
            >
              <div className="grid-space">
                <Grid>
                  <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 8, xl: 8}}>
                    <OfferPreview offer={offer} checkKeysValidity={checkKeysValidity} updateCheckKeysValidity={updateCheckKeysValidity} previewMode/>
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
