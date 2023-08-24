import {
  Page,
  Layout,
  Banner,
  Grid,
} from "@shopify/polaris";
import {iculogo} from "../assets";
import "../components/stylesheets/mainstyle.css";
import { GenericTitleBar, OffersList } from "../components";
import { isSubscriptionActive } from "../services/actions/subscription";
import {useEffect, useState, useCallback, useRef} from "react";
import { useSelector } from 'react-redux';
import { useAuthenticatedFetch } from "../hooks";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from 'react-router-dom';
import { TotalSalesData, ConversionRate, OrderOverTimeData } from "../components"

export default function HomePage() {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [currentShop, setCurrentShop] = useState(null);
  const [planName, setPlanName] = useState();
  const [trialDays, setTrialDays] = useState();
  const [hasOffers, setHasOffers] = useState();

  const app = useAppBridge();
  const navigateTo = useNavigate();

  const fetchCurrentShop = useCallback(async () => {

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
  }, [setCurrentShop, setPlanName, setTrialDays]);

  const handleOpenOfferPage = () => {
    navigateTo('/edit-offer', { state: { offerID: null } });
  }
  
  useEffect(()=>{
    fetchCurrentShop();
  }, [fetchCurrentShop]) 

  return (
    <Page>
      <GenericTitleBar image={iculogo} title='In Cart Upsell & Cross Sell' buttonText={hasOffers ? 'Create offer' : undefined} handleButtonClick={handleOpenOfferPage} />
      <Layout>
        <Layout.Section>
          {isSubscriptionActive(currentShop?.subscription) && planName!=='free' && trialDays>0 &&
            <Banner icon='none' status="info">
              <p>{ trialDays } days remaining for the trial period</p>
            </Banner>
          }
        </Layout.Section>
        <Layout.Section>
          <OffersList />
          {hasOffers ? (
            <Grid>
              <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                  <TotalSalesData/>
              </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                  <ConversionRate/>
              </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                  <OrderOverTimeData/>
              </Grid.Cell>
            </Grid>
          ) : (
            <></>
          )}
        </Layout.Section>
      </Layout>
      <div className="space-10"></div>
    </Page>
  );
};
