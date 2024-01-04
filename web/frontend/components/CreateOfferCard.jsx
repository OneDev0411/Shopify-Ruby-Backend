import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {
  Button,
  ButtonGroup,
  AlphaCard,
  Image,
  MediaCard,
  Modal,
  Text,
  VerticalStack,
  VideoThumbnail,
} from "@shopify/polaris";
import {homeImage} from "../assets/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";


const ShopContext = createContext(null);

export function CreateOfferCard({shopify_domain, hasOffers = false}) {
  const navigateTo = useNavigate();
  const location = useLocation();
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const [shopData, setShopData] = useState({
    currentShop: null,
    planName: "",
    trialDays: null,
  });
  const [active, setActive] = useState(false);

  const handleOpen = useCallback(() => setActive(true), []);
  const handleClose = useCallback(() => setActive(false), []);
  const handleCreateOffer = useCallback(() => {
    navigateTo("/edit-offer", { state: { offerID: null } });
  }, [navigateTo]);
  const isOffers = location?.pathname.includes('offer');

  useEffect(() => {
    const fetchCurrentShop = async () => {
      try {
        const data = await fetchShopData(shopAndHost.shop);
        setShopData(data);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchCurrentShop();
  }, [shopAndHost]);

  const moreHelpInfo = <div>
    <div style={{marginBottom: '20px'}}>
      <Text variant="headingMd" as="span" fontWeight="medium" >
        Need help creating an offer?&nbsp;
      </Text>
      <Text variant="headingMd" as="span" fontWeight="regular" >
        Our support team can help walk you through it.
      </Text>
    </div>
    <div>
      <Text variant="headingSm" as="p" fontWeight="regular" >
        Chat support is open 5am to 10pm EST.
      </Text>
      <Text variant="headingSm" as="p" fontWeight="regular" >
        Or you can send us an email any time and we’ll get back to you within 48 hours.
      </Text>
    </div>
  </div>;

  const getHelpDismissed = () => {
    return localStorage.getItem('help_dismissed');
  }

  // Though not necessary, this should serve as an example of how to use the Context API
  return (
    <ShopContext.Provider value={{ shopData, setShopData }}>
      {!isOffers && !getHelpDismissed() && (
        <div style={{marginBottom: '47px'}}>
          <ThemeAppCard
            handleOpen={handleOpen}
            shopData={shopData}
            active={active}
            handleClose={handleClose}
            shopify_domain={shopify_domain}
          />
        </div>
      )}

      { !hasOffers &&
        <>
          <div style={{marginBottom: '47px'}}>
            <OfferCard handleCreateOffer={handleCreateOffer} isOffers={isOffers} />
          </div>

          {!isOffers && (
            <>
              <HelpSection info={moreHelpInfo} handleOpen={handleOpen} shopData={shopData} />
              <VideoModal active={active} handleClose={handleClose} />
            </>
          )}
        </>
      }
    </ShopContext.Provider>
  );
}

// Splitting into smaller components
function OfferCard({ handleCreateOffer, isOffers }) {
  return (
    <AlphaCard>
      <VerticalStack inlineAlign="center">
        <div className="center-content">
          <Image
            source={ homeImage }
            alt="Create your first offer"
            width={219}
            style={{marginBottom: '11px'}}
          />
          <div style={{marginBottom: '11px'}}>
            <Text variant="headingLg" as="h2" fontWeight="regular">
              {isOffers ? "This is where you’ll manage your offers" : "Here is where you'll view your offers"}
            </Text>
          </div>
          <div style={{marginBottom: '35px'}}>
            <Text variant="headingSm" as="p" fontWeight="regular" color="subdued">
              {isOffers ?
                "Create a new offer to get started."
                :
                "Start by creating your first offer and publishing it to your store"
              }
            </Text>
          </div>
          <div className="center-btn" style={{marginBottom: '42px'}}>
            <ButtonGroup>
              <Button primary onClick={handleCreateOffer}>
                Create offer
              </Button>
              <Button
                url="https://help.incartupsell.com/en/collections/6780837-help-articles-for-new-ui"
                target="_blank"
              >
                View Help Docs
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </VerticalStack>
    </AlphaCard>
  );
}

function HelpSection({ handleOpen, info, disablePrimary }) {
  const { shopData } = useContext(ShopContext);

  const showIntercomWidget = () => {
    // Intercom needs to be initialized/booted before it can be used.
    const { currentShop } = shopData;
    window.Intercom('boot', {
      app_id: window.CHAT_APP_ID,
      id: currentShop.id,
      email: currentShop.email,
      phone: currentShop.phone_number,
      installed_at: currentShop.created_at,
      active: currentShop.active,
      shopify_plan: currentShop.shopify_plan_name,
      trailing_30_day_roi: currentShop.trailing_30_day_roi,
      shop_url: `https://${currentShop.shopify_domain}`
      // No context as to why the attributes below are here
      // plan: '#{@currentShop.try(:plan).try(:name)}',
      // dashboard: "https://incartupsell.herokuapp.com/?shop_id=#{@currentShop.id}"
    });
    window.Intercom('show');
  };

  let VideoComp = <VideoThumbnail
      onClick={handleOpen}
      videoLength={80}
      thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg"
  />

  return (
    disablePrimary ? <MediaCard
      title={info}
      description={""}
    >
      {VideoComp}
    </MediaCard> :
        <MediaCard
        title={info}
        primaryAction={{
          content: "Learn more",
          onAction: showIntercomWidget,
        }}
        description={""}
        popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
    >
      {VideoComp}
    </MediaCard>
  );
}

function VideoModal({ active, handleClose }) {
  return (
    <Modal onClose={handleClose} open={active} title="Getting Started">
      <Modal.Section>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/ANEPQkYLjbA"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </Modal.Section>
    </Modal>
  );
}

function ThemeAppCard({ handleOpen, handleClose, shopData, active, shopify_domain}) {
  const homepageInfo =
    <div style={{marginBottom: '20px'}} className={"homepage-info"}>
      <Text variant="headingSm" as="p" fontWeight="regular" >
        <ol>
          <li>Go to theme settings</li>
          <li>Click on Product page</li>
          <li>Click Add Section</li>
          <li>Search for ICU - Product Page app block</li>
          <li>Drag into your preferred placement</li>
          <li>Click on Cart page</li>
          <li>Click Add Section</li>
          <li>Search for ICU - Cart Page app block</li>
          <li>Drag into preferred placement</li>
          <li>Click save</li>
          <li>Return to ICU, you're done!</li>
        </ol>
      </Text>
    </div>;

  const storeHelpDismissed = () => {
    localStorage.setItem('help_dismissed', true);
    window.reload();
  }

  return (
    <AlphaCard>
      <VerticalStack inlineAlign="center">
        <div className="leadin-card">
          <div style={{marginBottom: '11px'}} className="center-content">
            <Text variant="headingLg" as="h2" fontWeight="regular">
              Add ICU to your stores theme
            </Text>
          </div>
          <div style={{marginBottom: '35px'}} className="center-content">
            <Text variant="headingSm" as="p" fontWeight="regular" color="subdued">
              Start by creating your first offer and publishing it to your store
            </Text>
          </div>
          <div style={{marginBottom: '35px'}} className={"video-intro-section"}>
            <HelpSection info={homepageInfo} handleOpen={handleOpen} shopData={shopData} disablePrimary />
            <VideoModal active={active} handleClose={handleClose} />
          </div>
          <div className="center-btn" style={{marginBottom: '42px'}}>
            <ButtonGroup>
              <Button primary
                      url={`https://${shopify_domain}/admin/themes/current/editor?template=product&addAppBlockId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/app_block&target=mainSection`}
                      target="_blank"
                      onClick={storeHelpDismissed}
              >
                Go to theme editor
              </Button>
              <Button
                url="https://help.incartupsell.com/en/collections/6780837-help-articles-for-new-ui"
                target="_blank"
              >
                View Help Docs
              </Button>
            </ButtonGroup>
          </div>
          <p style={{textAlign: "center"}}>If you want to add offers to your ajax cart, <Link
            to={`https://${shopify_domain}/admin/themes/current/editor?context=apps&template=product&activateAppId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/app_block_embed`}
            target="_blank">Click here
          </Link> to enable the app</p>
        </div>
      </VerticalStack>
    </AlphaCard>
  )
}

// This service function should be placed in a separate file
async function fetchShopData(shop) {
  try {
    const response = await fetch(`/api/merchant/current_shop?shop=${shop}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return {
      currentShop: data.shop,
      planName: data.plan,
      trialDays: data.days_remaining_in_trial,
    };
  } catch (error) {
    console.error("Failed to fetch shop data:", error);
    throw error;
  }
}
