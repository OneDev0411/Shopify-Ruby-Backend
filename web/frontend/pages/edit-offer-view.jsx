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
import {useState, useEffect, useContext} from "react";
import { useSelector } from "react-redux";
import { GenericFooter } from "../components";
import Summary from "../components/Summary";
import Details from "../components/OfferDetails";
import { OfferPreview } from "../components/OfferPreview";
import { useAuthenticatedFetch } from "../hooks";
import AbAnalytics from "../components/abAnalytics";
import "../components/stylesheets/mainstyle.css";
import {OfferContext} from "../OfferContext.jsx";
import {useOffer} from "../hooks/useOffer.js";
import {
  OFFER_ACTIVATE_URL,
  OFFER_DEACTIVATE_URL,
  OFFER_DEFAULTS,
  OFFER_DRAFT,
  OFFER_PUBLISH
} from "../shared/constants/EditOfferOptions.js";

const EditOfferView = () => {
  const { offer, setOffer, updateOffer } = useContext(OfferContext);
  const { fetchOffer } = useOffer();
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const [isLoading, setIsLoading] = useState(true);
  const offerID = localStorage.getItem('Offer-ID');
  const fetch = useAuthenticatedFetch(shopAndHost.host)
  const [initialOfferableProductDetails, setInitialOfferableProductDetails] = useState();
  const [checkKeysValidity, setCheckKeysValidity] = useState({});
  const navigateTo = useNavigate();
  const handleEditOffer = (offer_id) => {
    navigateTo('/edit-offer', { state: { offerID: offer_id } });
  }

  const toggleOfferActivation = async (activate) => {

    await fetch(activate ? OFFER_ACTIVATE_URL : OFFER_DEACTIVATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offer: { offer_id: offerID }, shop: shopAndHost.shop })
    }).then((response) => {
      if ([200,204].includes(response.status)) {
        updateOffer("publish_status", activate ? OFFER_PUBLISH : OFFER_DRAFT)
        updateOffer("active", activate)
      } else {
        // TODO: send out an error message here
        console.log("there was an issue deactivating the offer")
      }
    }).catch((error) => {
      console.log('Error:', error);
    })
  }

  const handleDuplicateOffer = () => {
    fetch(`/api/v2/merchant/offers/${offerID}/duplicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offer_id: offerID, shop: shopAndHost.shop })
    })
      .then((response) => {
        if ([200,204].includes(response.status)) {
          navigateTo('/offer');
        }
      })
      .catch((error) => {
        console.log('An error occurred while making the API call:', error);
      })
  }

  const handleDeleteOffer = () => {
    fetch(`/api/v2/merchant/offers/${offerID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offer_id: offerID, shop: shopAndHost.shop })
    })
      .then((response) => {
        if ([200,204].includes(response.status)) {
          navigateTo('/offer');
        }
      })
      .catch((error) => {
        console.log('An error occurred while making the API call:', error);
      })
  }

  useEffect(() => {
    if (offerID != null) {
      setIsLoading(true);
      fetchOffer(offerID, shopAndHost.shop).then((response) => {
        if (response.status === 200) {
          return response.json()
        }
        navigateTo('/offer');
      }).then((data) => {
          setOffer({...data});
          setInitialOfferableProductDetails(data.offerable_product_details);
          if (data.offerable_product_details.length > 0) {
            updateCheckKeysValidity('text', data.text_a.replace("{{ product_title }}", data.offerable_product_details[0]?.title));
          }
          updateCheckKeysValidity('cta', data.cta_a);
          setIsLoading(false);
        })
        .catch((error) => {
            console.log("Error > ", error);
        });
    }

    return function cleanup() {
      setOffer(OFFER_DEFAULTS);
    };
  },[]);

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
                offer.publish_status === "published" ? (
                  <Badge status="success">Published</Badge>
                ) : (
                  <Badge>Unpublished</Badge>
                )
              }
              secondaryActions={[
                {
                  content: (offer.publish_status === 'draft') ? 'Publish' : 'Unpublish',
                  onAction: () => offer.publish_status === 'draft' ? toggleOfferActivation(true) : toggleOfferActivation(false),
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
                      <OfferPreview checkKeysValidity={checkKeysValidity} updateCheckKeysValidity={updateCheckKeysValidity} previewMode/>
                    </div>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 4, xl: 4}}>
                    <VerticalStack gap="5">
                      <Details offer={offer} offerableProducts={initialOfferableProductDetails}/>
                      <Summary offerID={offerID}/>
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
