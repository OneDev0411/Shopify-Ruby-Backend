import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';

import { Banner, Grid, Layout, Page, Spinner} from "@shopify/polaris";

import { useAuthenticatedFetch } from "../hooks";
import { isSubscriptionActive } from "../services/actions/subscription";
import { CustomTitleBar, OffersList, OrderOverTimeData, TotalSalesData } from "../components";

import "../components/stylesheets/mainstyle.css";
import {ThemeAppCard} from "../components/CreateOfferCard.jsx";
import {Redirect} from '@shopify/app-bridge/actions';
import { useAppBridge } from "@shopify/app-bridge-react";

export default function HomePage() {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [currentShop, setCurrentShop] = useState(null);
  const [planName, setPlanName] = useState();
  const [trialDays, setTrialDays] = useState();
  const [hasOffers, setHasOffers] = useState();
  const [themeAppExtension, setThemeAppExtension] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = useNavigate();
  const [isLegacy, setIsLegacy] = useState(true);

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
      installed_at: icu_shop.installed_at || icu_shop.created_at,
      signed_up: icu_shop.created_at,
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
    fetch(`/api/v2/merchant/current_shop?shop=${shopAndHost.shop}`, {
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
        setThemeAppExtension(data.theme_app_extension);
        setCurrentShop(data.shop);
        setPlanName(data.plan);
        setTrialDays(data.days_remaining_in_trial);

        if (data.theme_app_extension) {
          setIsLegacy(data.theme_app_extension.theme_version === "2.0" || import.meta.env.VITE_ENABLE_THEME_APP_EXTENSION?.toLowerCase() !== 'true');
        }

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
        <div
          style={{
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Spinner size="large" color="teal" />
        </div>
      ) : (
        <>
          <CustomTitleBar
            title="In Cart Upsell & Cross Sell"
            image={"https://in-cart-upsell.nyc3.cdn.digitaloceanspaces.com/images/ICU-Logo-Small.png"}
            buttonText={"Create offer"}
            handleButtonClick={handleOpenOfferPage}
          />
          <Layout>
            {isSubscriptionActive(currentShop?.subscription) && planName!=='free' && trialDays>0 &&
              <Layout.Section>
                <Banner status="info">
                  <p>{ trialDays } days remaining for the trial period</p>
                </Banner>
              </Layout.Section>
            }

            {!isLegacy && (
              <ThemeAppCard
                shopData={currentShop}
                themeAppExtension={themeAppExtension}
              />
            )}

            {planName ==='free' && (
              <Layout.Section>
                <Banner status="info">
                  <p>You are currently on the free plan and only one offer can be published at a time. <Link
                    to="/subscription">Click here</Link> to see the features available or to upgrade your plan</p>
                </Banner>
              </Layout.Section>
            )}
              <Layout.Section>
                <OffersList />
                {hasOffers && (
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                      <TotalSalesData period='monthly' title={true} />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                      <OrderOverTimeData period='monthly' title={true} />
                    </Grid.Cell>
                  </Grid>
                )}
              </Layout.Section>
          </Layout>
          <div className="space-10"></div>
        </>
    )}
    </Page>
  );
};
