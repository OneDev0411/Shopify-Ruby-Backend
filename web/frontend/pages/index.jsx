import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Banner, Grid, Layout, Page } from "@shopify/polaris";

import { useAuthenticatedFetch } from "../hooks";
import { isSubscriptionActive } from "../services/actions/subscription";
import { ConversionRate, CustomTitleBar, OffersList, OrderOverTimeData, TotalSalesData } from "../components";

import { iculogo } from "../assets";
import "../components/stylesheets/mainstyle.css";

export default function HomePage() {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [currentShop, setCurrentShop] = useState(null);
  const [planName, setPlanName] = useState();
  const [trialDays, setTrialDays] = useState();
  const [hasOffers, setHasOffers] = useState();

  const navigateTo = useNavigate();

  const handleOpenOfferPage = () => {
    navigateTo('/edit-offer', { state: { offerID: null } });
  }
  
  useEffect(() => {
    fetch(`/api/merchant/current_shop?shop=${shopAndHost.shop}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then( (response) => { return response.json(); })
      .then( (data) => {
        setHasOffers(data.has_offers);
        setCurrentShop(data.shop);
        setPlanName(data.plan);
        setTrialDays(data.days_remaining_in_trial);
      })
      .catch((error) => {
        console.log("error", error);
      })
  }, [setCurrentShop, setPlanName, setTrialDays])

  return (
    <Page fullWidth>
      <CustomTitleBar
        title="In Cart Upsell & Cross Sell"
        image={iculogo}
        buttonText={"Create offer"}
        handleButtonClick={handleOpenOfferPage}/>
      <Layout>
        {isSubscriptionActive(currentShop?.subscription) && planName!=='free' && trialDays>0 &&
          <Layout.Section>
            <Banner icon='none' status="info">
              <p>{ trialDays } days remaining for the trial period</p>
            </Banner>
          </Layout.Section>
        }
        <Layout.Section>
          <OffersList />
          {hasOffers && (
            <Grid>
              <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                  <TotalSalesData period='monthly'/>
              </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                  <ConversionRate period='monthly'/>
              </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                  <OrderOverTimeData period='monthly'/>
              </Grid.Cell>
            </Grid>
          )}
        </Layout.Section>
      </Layout>
      <div className="space-10"></div>
    </Page>
  );
};
