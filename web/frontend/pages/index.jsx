import {ButtonGroup, Button, Link, MediaCard, VideoThumbnail, LegacyCard, Page, Layout, Text, Image, LegacyStack, Heading, Subheading, Banner, VerticalStack} from "@shopify/polaris";
import {homeImage, iculogo} from "../assets";
import "../components/stylesheets/mainstyle.css";
import { GenericTitleBar } from "../components";
import { isSubscriptionActive } from "../services/actions/subscription";
import { getShop } from "../services/actions/shop";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from 'react-redux';
import { useAuthenticatedFetch } from "../hooks";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [currentShop, setCurrentShop] = useState(null);
  const [planName, setPlanName] = useState();
  const [trialDays, setTrialDays] = useState();

  const fetchCurrentShop = useCallback(async () => {

    fetch(`/api/merchant/current_shop?shop=${shopAndHost.shop}`, {
      method: 'GET',
         headers: {
           'Content-Type': 'application/json',
         },
     })
     .then( (response) => { return response.json(); })
     .then( (data) => {
        setCurrentShop(data.shop);
        setPlanName(data.plan);
        setTrialDays(data.days_remaining_in_trial);
     })
     .catch((error) => {
      console.log("error", error);
     })    
  }, [setCurrentShop, setPlanName, setTrialDays]);

  useEffect(async()=>{
    fetchCurrentShop();
  }, [fetchCurrentShop])

  const navigateTo = useNavigate();
  const handleCreateOffer = () => {
    navigateTo('/edit-offer', { state: { offerID: null } });
  }
  return (
    <Page
      title={<GenericTitleBar image={iculogo} title={'In Cart Upsell & Cross Sell'} /> }
      primaryAction={null}
    >
      <Layout>
        <Layout.Section>
          {isSubscriptionActive(currentShop?.subscription) && planName!=='free' && trialDays>0 &&
            <Banner icon='none' status="info">
              <p>{ trialDays } days remaining for the trial period</p>
            </Banner>
          }
        </Layout.Section>
        <Layout.Section>
          {/* card for image and text */}
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
                    <Text variant="headingMd" as="h2" element="h1">Here is where you'll view your offers</Text>
                    <Text as="h3">Start by creating your first offer and publishing it to your store</Text>
                  </VerticalStack>
                  <div className="space-10"></div>
                  <div className="center-btn">
                    <ButtonGroup>
                      <Button primary onClick={() => handleCreateOffer()}>Create offer</Button>
                      <Button><Link url="https://help.incartupsell.com/en/collections/3263755-icu-help-center" external>View Help Docs</Link></Button>
                    </ButtonGroup>
                  </div>
                </div>
              </LegacyStack.Item>
            </LegacyStack>
          </LegacyCard>
          {/* Second section with video */}
          <MediaCard
            title="Need help creating your offer?"
            primaryAction={{
              content: 'Learn more',
              onAction: () => {},
            }}
            description={"Our support team a can help walk you through it."+ "\n"+ "Chat support is open 5am to 10pm EST. Or you can send us an email anytime and we'll get back to you within 48hours."}
            popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
          >
            <VideoThumbnail
              videoLength={80}
              thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
            />
          </MediaCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
