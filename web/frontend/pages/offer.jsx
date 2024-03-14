import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';

import {Layout, Page} from '@shopify/polaris';
import {AddProductMajor} from '@shopify/polaris-icons';

import {CustomTitleBar, OffersList} from '../components';
import {useAuthenticatedFetch} from "../hooks";
import ErrorPage from "../components/ErrorPage.jsx"

import ModalChoosePlan from '../components/modal_ChoosePlan';
import { setIsSubscriptionUnpaid } from '../store/reducers/subscriptionPaidStatusSlice';
import { fetchShopData } from "../services/actions/shop";
import {useShopState} from "../contexts/ShopContext.jsx";
import ABTestBanner from '../components/ABTestBanner';

export default function Offers() {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const navigateTo = useNavigate();
  const isSubscriptionUnpaid = useSelector(state => state.subscriptionPaidStatus.isSubscriptionUnpaid);
  const [planName, setPlanName] = useState();
  const [error, setError] = useState(null);
  const { hasOffers, setHasOffers } = useShopState();
  const reduxDispatch = useDispatch();

  useEffect(() => {
    fetchShopData(shopAndHost.shop)
      .then((data) => {
        setPlanName(data.plan);
        setHasOffers(data.has_offers);
        reduxDispatch(setIsSubscriptionUnpaid(data.subscription_not_paid));
      })
      .catch((error) => {
        setError(error);
        console.log("error", error);
      })
  }, [setHasOffers]);
    
    const handleOpenOfferPage = () => {
      navigateTo('/edit-offer', { state: { offerID: null } });
    }

    if (error) { return < ErrorPage showBranding={true} />; }

    return (
      <>
        { isSubscriptionUnpaid && <ModalChoosePlan /> }
        <div className="min-height-container">
          <Page fullWidth>
            {hasOffers ? (
              <CustomTitleBar
                image={AddProductMajor}
                title='Offers'
                buttonText='Create offer'
                handleButtonClick={handleOpenOfferPage}
              />
            ): (
              <CustomTitleBar
                title="In Cart Upsell & Cross Sell"
                image={"https://in-cart-upsell.nyc3.cdn.digitaloceanspaces.com/images/ICU-Logo-Small.png"}
              />
            )}
            <Layout>
              {planName === "free" && (
                <Layout.Section>
                  <ABTestBanner />
                </Layout.Section>
              )}
              <Layout.Section>
                <div style={{marginTop: '54px'}}>
                  <OffersList pageSize={20}/>
                </div>
              </Layout.Section>
            </Layout>
            <div className="space-10"></div>
          </Page>
        </div>
      </>
    );
  }
