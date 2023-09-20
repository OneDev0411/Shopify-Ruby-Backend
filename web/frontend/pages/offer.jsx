import React, { useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';

import {Banner, Grid, Layout, Page} from '@shopify/polaris';
import {AddProductMajor} from '@shopify/polaris-icons';

import {
  ConversionRate,
  CustomTitleBar,
  GenericFooter,
  OffersList,
  OrderOverTimeData,
  TotalSalesData
} from '../components';
import {useAuthenticatedFetch} from "../hooks";
import {iculogo} from "../assets/index.js";
import {isSubscriptionActive} from "../services/actions/subscription.js";

export default function IndexTableWithAllElementsExample() {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const navigateTo = useNavigate();

  const [hasOffers, setHasOffers] = useState();

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
      })
      .catch((error) => {
        console.log("error", error);
      })
  }, [setHasOffers]);
    
    const handleOpenOfferPage = () => {
      navigateTo('/edit-offer', { state: { offerID: null } });
    }

    return (
      <>
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
                image={iculogo}
              />
            )}
            <Layout>
              <Layout.Section>
                <div style={{marginTop: '54px'}}>
                  <OffersList />
                </div>
              </Layout.Section>
            </Layout>
            <div className="space-10"></div>
          </Page>
        </div>
        <GenericFooter text='Need more help? ' linkUrl='#' linkText='Watch the help video' />
      </>
    );
  }
