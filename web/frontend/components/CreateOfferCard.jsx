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
  VideoThumbnail, Tabs, LegacyCard, Layout, Banner,
} from "@shopify/polaris";
import { CHAT_APP_ID, homeImage } from "../assets/index.js";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import { fetchShopData } from "../services/actions/shop";

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
        const { shop, plan, days_remaining_in_trial } = await fetchShopData(shopAndHost.shop);
        setShopData({ currentShop: shop, planName: plan, trialDays: days_remaining_in_trial });
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
  const [open, setOpen] = useState(true);

  const closeBanner = () => {
    setOpen(false);
    localStorage.setItem('theme_banner', 'dismissed');
  }

  useEffect(() => {
    let isBannerDismissed = localStorage.getItem('theme_banner');

    if (isBannerDismissed) {
      setOpen(false);
    }
  }, [])

  const contentInfo = (tab) => {
    return  <VerticalStack inlineAlign="center">
      <div className="leadin-card">
        <div style={{marginBottom: '11px'}} className="center-content">
          <Text variant="headingLg" as="h2" fontWeight="regular">
            Enable In Cart Upsell & Cross-Sell in your theme editor.
          </Text>
        </div>
        <div style={{marginBottom: '35px'}} className="center-content">
          <Text variant="headingSm" as="p" fontWeight="regular" color="subdued">
            In Cart Upsell & Cross-Sell uses App Blocks and App Embeds for ease of use, faster response times, and customization. Follow the steps below to get it all setup!
          </Text>
        </div>
        <div style={{marginBottom: '35px'}} className={"video-intro-section"}>
          {/*<HelpSection info={ () => {return homepageInfo}} handleOpen={handleOpen} shopData={shopData} disablePrimary />*/}
          <div style={{marginBottom: '20px'}} className={"homepage-info"}>
            <Text variant="headingSm" as="p" fontWeight="regular" >
              <ol>
              {!tab.content.includes('Ajax') ?
                <>
                  <li>Click on the <b>{tab.buttonName}</b> button below, a new tab will open up, and the app block will be automatically added for you.</li>
                  <li>
                    You will see the placement of any currently published offers, or if you don't have any published, a placeholder offer will show you the widget position. If you are happy with it, skip to step 4.
                  </li>
                  <li>To readjust the placement of the widget, simply drag and drop the app block from the <b>menu on the left-hand side</b> of the theme editor.</li>
                </>
              :
                <li>Click on the <b>Enable App Embed</b> button below, the embed will be automatically toggled on for you.</li>
              }
                <li>Click <b>save</b>, and close this tab to return to the app, you’re done!</li>
              </ol>
            </Text>
          </div>
        </div>
        <div className="center-btn" style={{marginBottom: '42px'}}>
          <ButtonGroup>
            { !tab.title.includes('Embedded') ?
              <Button primary
                      url={`https://${shopData?.shopify_domain}/admin/themes/current/editor?template=${tab.handle}&addAppBlockId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/${tab.panelID}&target=mainSection`}
                      target="_blank"
              >
                {tab.buttonName}
              </Button>
              :
              <Button primary
                      url={`https://${shopData?.shopify_domain}/admin/themes/current/editor?context=apps&template=product&activateAppId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/${tab.panelID}`}
                      target="_blank"
              >
                {tab.buttonName}
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
      content: 'Product Page',
      title: 'Product Page',
      showTab: !themeAppExtension?.product_block_added,
      panelID: 'product_app_block',
      handle: 'product',
      buttonName: 'Add to Product Page'
    },
    {
      id: 'cart-page-embed',
      content: 'Cart Page',
      title: 'Cart Page',
      showTab: !themeAppExtension?.cart_block_added,
      panelID: 'cart_app_block',
      handle: 'cart',
      buttonName: 'Add to Cart Page'
    },
    {
      id: 'ajax-cart-embed',
      content: 'Ajax Cart Page',
      title: 'Embedded Apps settings',
      showTab: !themeAppExtension?.theme_app_embed,
      panelID: 'ajax_cart_app_block',
      buttonName: 'Enable App Embed'
    },
  ];
  const availableTabs = tabs.filter( tab => tab.showTab);

  return (
    (availableTabs.length > 0) &&
    <Layout.Section>
      <div style={{marginBottom: '47px'}}>
        { open && (
          <div style={{marginBottom: '10px'}}>
            <Banner onDismiss={closeBanner} status={"warning"}>
              In Cart Upsell is moving to Theme App Extension blocks. Please see below to enable the blocks in your theme.
            </Banner>
          </div>
        )}
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

