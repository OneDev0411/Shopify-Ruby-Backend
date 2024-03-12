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
  VideoThumbnail, Tabs, LegacyCard, Layout,
} from "@shopify/polaris";
import { CHAT_APP_ID, homeImage } from "../assets/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const ShopContext = createContext(null);

export function CreateOfferCard({hasOffers = false}) {
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

  // Though not necessary, this should serve as an example of how to use the Context API
  return (
    <ShopContext.Provider value={{ shopData, setShopData }}>
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
      app_id: CHAT_APP_ID,
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

export function ThemeAppCard({ shopData, themeAppExtension}) {
  const [active, setActive] = useState(false);

  const handleOpen = useCallback(() => setActive(true), []);
  const handleClose = useCallback(() => setActive(false), []);

  const contentInfo = (tab) => {
    return  <VerticalStack inlineAlign="center">
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
          {/*<HelpSection info={ () => {return homepageInfo}} handleOpen={handleOpen} shopData={shopData} disablePrimary />*/}
          <div style={{marginBottom: '20px'}} className={"homepage-info"}>
            <Text variant="headingSm" as="p" fontWeight="regular" >
              <ol>
                <li>Click on the button below to go to the theme settings</li>
                <li>You should be on the {tab.title}</li>
                <li>The app should already be added to the apps section</li>
                { tab.title.includes('Embedded') ?
                  <li>The app will already be enabled by clicking the button</li>
                  :
                  <li>Drag the app section into your preferred placement area</li>
                }
                <li>Click save</li>
                <li>Return to ICU, you're done!</li>
              </ol>
            </Text>
          </div>
          <VideoModal active={active} handleClose={handleClose} />
        </div>
        <div className="center-btn" style={{marginBottom: '42px'}}>
          <ButtonGroup>
            { !tab.title.includes('Embedded') ?
              <Button primary
                      url={`https://${shopData?.shopify_domain}/admin/themes/current/editor?template=${tab.handle}&addAppBlockId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/app_block&target=mainSection`}
                      target="_blank"
              >
                Add to {tab.title}
              </Button>
              :
              <Button primary
                      url={`https://${shopData?.shopify_domain}/admin/themes/current/editor?context=apps&template=product&activateAppId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/app_block_embed`}
                      target="_blank"
              >
                Add to {tab.title}
              </Button>
            }
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
  }

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'product-page-embed',
      content: 'Product Page Extension',
      title: 'Product Page',
      showTab: !themeAppExtension?.product_block_added,
      panelID: 'product-page-extension',
      handle: 'product'
    },
    {
      id: 'cart-page-embed',
      content: 'Cart Page Extension',
      title: 'Cart Page',
      showTab: !themeAppExtension?.cart_block_added,
      panelID: 'cart-page-extension',
      handle: 'cart'
    },
    {
      id: 'ajax-cart-embed',
      content: 'Ajax Cart Extension',
      title: 'Embedded Apps settings',
      showTab: !themeAppExtension?.theme_app_embed,
      panelID: 'ajax-cart-extension',
    },
    {
      id: 'collections-page-embed',
      content: 'Collections Page Extension',
      title: 'Collections Page',
      showTab: !themeAppExtension?.collection_block_added,
      panelID: 'collection-page-extension',
      handle: 'collection'
    },
  ];
  const availableTabs = tabs.filter( tab => tab.showTab);

  return (
    (availableTabs.length > 0) &&
    <Layout.Section>
      <div style={{marginBottom: '47px'}}>
        <AlphaCard>
          <div className="offer-tabs-no-padding">
            <Tabs tabs={availableTabs} selected={selected} onSelect={handleTabChange} fitted>
              <LegacyCard.Section>
                {contentInfo(availableTabs[selected])}
              </LegacyCard.Section>
            </Tabs>
          </div>
        </AlphaCard>
      </div>
    </Layout.Section>
  )
}

// This service function should be placed in a separate file
async function fetchShopData(shop) {
  try {
    const response = await fetch(`/api/v2/merchant/current_shop?shop=${shop}`, {
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
    console.log("Failed to fetch shop data:", error);
    throw error;
  }
}
