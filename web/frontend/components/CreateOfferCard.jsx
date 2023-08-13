import React, { useEffect, useCallback, useState } from "react";
import {
  Button,
  ButtonGroup,
  Image,
  LegacyCard,
  LegacyStack,
  Link,
  MediaCard,
  Modal,
  Text,
  VerticalStack,
  VideoThumbnail,
} from "@shopify/polaris";
import { homeImage } from "../assets/index.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchShopData } from "../services/shopService"; // Example path

const ShopContext = createContext(null);

export function CreateOfferCard() {
  const navigateTo = useNavigate();
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

  const fetchCurrentShop = useCallback(async () => {
    try {
      const data = await fetchShopData(shopAndHost.shop);
      setShopData(data);
    } catch (error) {
      console.log("error", error);
    }
  }, [shopAndHost]);

  useEffect(() => {
    fetchCurrentShop();
  }, [fetchCurrentShop]);

  // Though not necessary, this should serve as an example of how to use the Context API
  return (
    <ShopContext.Provider value={{ shopData, setShopData }}>
      <OfferCard  handleCreateOffer={handleCreateOffer} />
      <HelpSection />
      <VideoModal active={active} handleClose={handleClose} handleOpen={handleOpen} />
    </ShopContext.Provider>
  );
}

// Splitting into smaller components
function OfferCard({ handleCreateOffer }) {
  return (
    <LegacyCard sectioned>
      <LegacyStack distribution="center">
        <LegacyStack.Item>
          <div className="center-content">
            <Image
              source={homeImage}
              alt="Create your first offer"
              width={219}
            />
            <VerticalStack gap="5">
              <Text variant="headingMd" as="h2" element="h1">
                Here is where you'll view your offers
              </Text>
              <Text as="h3">
                Start by creating your first offer and publishing it to your store
              </Text>
            </VerticalStack>
            <div className="space-10"></div>
            <div className="center-btn">
              <ButtonGroup>
                <Button primary onClick={handleCreateOffer}>
                  Create offer
                </Button>
                <Button
                  url="https://help.incartupsell.com/en/collections/3263755-all"
                  external
                  target="_blank"
                >
                  View Help Docs
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </LegacyStack.Item>
      </LegacyStack>
    </LegacyCard>
  );
}

function HelpSection({ handleOpen }) {
  const { shopData } = useContext(ShopContext);

  const showIntercomWidget = useCallback(() => {
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
  }, []);

  return (
    <MediaCard
      title="Need help creating your offer?"
      primaryAction={{
        content: "Learn more",
        onAction: showIntercomWidget,
      }}
      description={
        "Our support team a can help walk you through it." +
        "\n" +
        "Chat support is open 5am to 10pm EST. Or you can send us an email anytime and we'll get back to you within 48hours."
      }
      popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
    >
      <VideoThumbnail
        onClick={handleOpen}
        videoLength={80}
        thumbnailUrl="./../assets/business-woman-smiling-in-office.jpeg"
      />
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