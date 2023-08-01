import {
  Page,
  Layout,
  Banner,
} from "@shopify/polaris";
import {iculogo} from "../assets";
import "../components/stylesheets/mainstyle.css";
import { GenericTitleBar } from "../components";
import { isSubscriptionActive } from "../services/actions/subscription";
import {useEffect, useState, useCallback, useRef} from "react";
import { useSelector } from 'react-redux';
import { useAuthenticatedFetch } from "../hooks";
import {CreateOfferCard} from "../components/CreateOfferCard.jsx";

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
          <CreateOfferCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
};
