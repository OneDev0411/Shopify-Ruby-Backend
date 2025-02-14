import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import { Banner, Grid, Layout, Page, Spinner} from "@shopify/polaris";

import { isSubscriptionActive } from "../services/actions/subscription";
import { fetchShopData } from "../services/actions/shop";

import { CustomTitleBar, OffersList, OrderOverTimeData, TotalSalesData, TotalUpSellsData } from "../components";

import "../components/stylesheets/mainstyle.css";
import {ThemeAppCard} from "../components/CreateOfferCard.jsx";
import {Redirect} from '@shopify/app-bridge/actions';
import { useAppBridge } from "@shopify/app-bridge-react";
import { CHAT_APP_ID } from "../assets/index.js";
import ErrorPage from "../components/ErrorPage.jsx"

import ModalChoosePlan from "../components/modal_ChoosePlan.jsx";
import {useShopState} from "../contexts/ShopContext.jsx";
import ABTestBanner from "../components/ABTestBanner.jsx";
import { onLCP, onFID, onCLS } from 'web-vitals';
import { traceStat } from "../services/firebase/perf.js";
import { LoadingSpinner } from "../components/atoms/index.js";

export default function HomePage() {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);

  const {
    shop,
    setShop,
    planName,
    setPlanName,
    trialDays,
    setTrialDays,
    hasOffers,
    setHasOffers,
    shopSettings,
    updateShopSettingsAttributes,
    themeAppExtension,
    setThemeAppExtension,
    setIsSubscriptionUnpaid} = useShopState()

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigateTo = useNavigate();
  const [isLegacy, setIsLegacy] = useState(themeAppExtension?.theme_version !== '2.0');

  useEffect(()=> {
    onLCP(traceStat, {reportSoftNavs: true});
    onFID(traceStat, {reportSoftNavs: true});
    onCLS(traceStat, {reportSoftNavs: true});
  }, []);

  const handleOpenOfferPage = () => {
    navigateTo('/edit-offer', { state: { offerID: null } });
  }

  const handleOpenGoogleForm = () => {
    window.open('https://forms.gle/oRnBh3BPSAvWwLYQ7', '_blank');
  };

  const notifyIntercom = (icu_shop) => {
    window.Intercom('boot', {
      app_id: CHAT_APP_ID,
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

    if (shop.id) {
      setIsLoading(false)
      return
    }
    setIsLoading(true);
    fetchShopData(shopAndHost.shop)
      .then((data) => {
        if (data.redirect_to) {
          redirect.dispatch(Redirect.Action.APP, data.redirect_to);
        } else {
          setHasOffers(data.has_offers);
          setThemeAppExtension(data.theme_app_extension);
          setShop(data.shop);
          setPlanName(data.plan);
          setTrialDays(data.days_remaining_in_trial);
          setIsSubscriptionUnpaid(data.subscription_not_paid)
          updateShopSettingsAttributes(data.offers_limit_reached, "offers_limit_reached");

          if (data.theme_app_extension) {
            setIsLegacy(data.theme_app_extension.theme_version !== '2.0');
          }
          // notify intercom as soon as app is loaded and shop info is fetched
          notifyIntercom(data.shop);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
        console.log("Error", error);
      })
  }, [])

  if (error) { return < ErrorPage showBranding={true} />; }

  return (
    <Page>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ModalChoosePlan />
          <CustomTitleBar
            title="In Cart Upsell & Cross Sell"
            image={"https://assets.incartupsell.com/images/ICU-Logo-Small.png"}
            buttonText={"Create offer"}
            handleButtonClick={handleOpenOfferPage}
          />
          <Layout>
            {isSubscriptionActive(shop?.subscription) && planName!=='free' && trialDays>0 &&
              <Layout.Section>
                <Banner status="info">
                  <p>{ trialDays } days remaining for the trial period</p>
                </Banner>
              </Layout.Section>
            }

              {shopSettings?.offers_limit_reached && (
                <Layout.Section>
                  <ABTestBanner />
                </Layout.Section>
              )}

              {!isLegacy && (
                <ThemeAppCard
                  shopData={shop}
                  themeAppExtension={themeAppExtension}
                />
              )}

              <Layout.Section>
                <OffersList />
                {hasOffers && (
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                      <TotalSalesData period='30-days' title={true} />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                      <TotalUpSellsData period='30-days' title={true} />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                      <OrderOverTimeData period='30-days' title={true} />
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
