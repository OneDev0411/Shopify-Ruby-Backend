import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Banner, Grid, Layout, Page } from "@shopify/polaris";

import { useAuthenticatedFetch } from "../hooks";
import { isSubscriptionActive } from "../services/actions/subscription";
import { ConversionRate, CustomTitleBar, OffersList, OrderOverTimeData, TotalSalesData } from "../components";

import { iculogo } from "../assets";
import "../components/stylesheets/mainstyle.css";
import HomePageSkeleton from "../skeletons/HomePageSkeleton";
import {Redirect} from '@shopify/app-bridge/actions';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";

export default function HomePage() {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [currentShop, setCurrentShop] = useState(null);
  const [planName, setPlanName] = useState();
  const [trialDays, setTrialDays] = useState();
  const [hasOffers, setHasOffers] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleOpenOfferPage = () => {
    navigateTo('/edit-offer', { state: { offerID: null } });
  }

  const handleOpenGoogleForm = () => {
    window.open('https://forms.gle/oRnBh3BPSAvWwLYQ7', '_blank');
  };

  const notifyIntercom = (icu_shop) => {
    window.Intercom('boot', {
      app_id: window.CHAT_APP_ID,
      id: icu_shop.id,
      email: icu_shop.email,
      phone: icu_shop.phone_number,
      installed_at: icu_shop.created_at,
      active: icu_shop.active,
      shopify_plan: icu_shop.shopify_plan_name,
      shop_url: `https://${icu_shop.shopify_domain}`,
      theme: icu_shop.shopify_theme_name,
      currency: icu_shop.currency
    });
    window.Intercom('show');
  }
  
  useEffect(() => {
    let redirect = Redirect.create(app);
    setIsLoading(true);
    fetch(`/api/merchant/current_shop?shop=${shopAndHost.shop}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then( (response) => { return response.json(); })
      .then( (data) => {
        if (data.redirect_to) {
          redirect.dispatch(Redirect.Action.APP, data.redirect_to);
      } else {
        setHasOffers(data.has_offers);
        setCurrentShop(data.shop);
        setPlanName(data.plan);
        setTrialDays(data.days_remaining_in_trial);

        // notify intercom as soon as app is loaded and shop info is fetched
        notifyIntercom(data.shop);
        setIsLoading(false);
      }})
      .catch((error) => {
        console.log("error", error);
      })
  }, [setCurrentShop, setPlanName, setTrialDays])

  return (
    <Page>
      {isLoading ? (
        <HomePageSkeleton />
      ) : (
        <>
          <CustomTitleBar
            title="In Cart Upsell & Cross Sell"
            image={iculogo}
            buttonText={"Create offer"}
            handleButtonClick={handleOpenOfferPage}
          />
          <Layout>
            <Layout.Section>
              <div className="banner-btn">
                <Banner
                  action={{content: 'Take the survey', onAction: handleOpenGoogleForm }}
                  status="info"
                >
                  <p>We're delighted to welcome you to the new & improved In Cart Upsell & Cross-Sell! If you encounter any unexpected issues or need assistance with the new User Interface, please don't hesitate to contact our support team. Additionally, if you can spare 5 minutes, we'd greatly appreciate your feedback. Thank you!</p>
                </Banner>
              </div>
            </Layout.Section>
            {isSubscriptionActive(currentShop?.subscription) && planName!=='free' && trialDays>0 &&
              <Layout.Section>
                <Banner icon='none' status="info">
                  <p>{ trialDays } days remaining for the trial period</p>
                </Banner>
              </Layout.Section>
            }
            {hasOffers && (
              <Layout.Section>
                <OffersList />
                <Grid>
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                    <TotalSalesData period='monthly' title={true} />
                  </Grid.Cell>
                  {/*  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>*/}
                  {/*    <ConversionRate period='monthly' title={true} />*/}
                  {/*</Grid.Cell>*/}
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                    <OrderOverTimeData period='monthly' title={true} />
                  </Grid.Cell>
                </Grid>
              </Layout.Section>
            )}
          </Layout>
          <div className="space-10"></div>
        </>
    )}
    </Page>
  );
};
