import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useAuthenticatedFetch } from '../hooks';
import { useSelector } from 'react-redux';
import { Page ,Grid, Select, Banner } from '@shopify/polaris';
import { AnalyticsMinor } from '@shopify/polaris-icons';
import { GenericFooter } from '../components/GenericFooter';
import { DateRangeOptions } from '../shared/constants/AnalyticsOptions';
import "../components/stylesheets/mainstyle.css";
import {
  TotalSalesData,
  TotalUpSellsData,
  ConversionRate,
  TopPerformingOffersData,
  OrderOverTimeData,
  CustomTitleBar,
  ClickThroughtRateData
} from "../components";
import ModalChoosePlan from '../components/modal_ChoosePlan';
import { onLCP, onFID, onCLS } from 'web-vitals';
import { traceStat } from "../services/firebase/perf.js";

export default function AnalyticsOffers() {
    const shopAndHost = useSelector((state) => state.shopAndHost);
    const [period, setPeriod] = useState('hourly');
    const [error, setError] = useState(null);
    const [showBanner, setShowBanner] = useState(false); 
    const [bannerData, setBannerData] = useState({ active: false });
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const setTimePeriod = useCallback((val) => {
      setPeriod(val)
    },[]);

    const handleDismiss = () => {
      setError(null);
      setShowBanner(false);
      setBannerData((bannerData)=> ({...bannerData, active: false}));
    };

    const handleError = () => {
      setError('Some of your analytics data failed to load, so your stats may not be complete.');
      setShowBanner(true);
    };

    const fetchBannerData = async () => {
      try {
        fetch(`/api/v2/merchant/shop_banners?shop=${shopAndHost.shop}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => response.json())
        .then((data) => setBannerData(data))
        .catch((error) => setBannerData({ active: false }))
      } catch (error) {
        console.error('Error fetching banner data', error);
      }
    }

    useEffect(()=> {
      onLCP(traceStat, {reportSoftNavs: true});
      onFID(traceStat, {reportSoftNavs: true});
      onCLS(traceStat, {reportSoftNavs: true});
      fetchBannerData();
    }, []);
  
    return (
      <Page>
        <ModalChoosePlan />
         <CustomTitleBar title='Analytics' icon={AnalyticsMinor} />
          {bannerData?.active && (
            <Banner title={bannerData?.title} status={bannerData?.status} onDismiss={handleDismiss}>
              <div style={{ fontSize: bannerData?.fontSize || '0.85rem', marginTop: bannerData?.marginTop || '1rem' }}>
                {bannerData?.lines?.map((line, index) => <p key={index} style={{ marginBottom: bannerData?.bodyMargin || '0.5rem' }}>{line}</p>)}
              </div>
            </Banner>
          )}
        <div className="space-10"></div>
      <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
          <Select
            label="Date range"
            options={DateRangeOptions}
            onChange={setTimePeriod}
            value={period}
          />
        </Grid.Cell>
      </Grid>
      <div className="space-10"></div>
      <div id={"graphs"}>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 4, xl: 4 }}>
            <TotalSalesData period={period} onError={handleError} />
            <ClickThroughtRateData period={period} onError={handleError}  />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 4, xl: 4 }}>
            <TotalUpSellsData period={period} onError={handleError} />
            <ConversionRate period={period } onError={handleError} />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 4, xl: 4 }}>
            <OrderOverTimeData period={period} onError={handleError} />
            <TopPerformingOffersData period={period} onError={handleError} />
          </Grid.Cell>
        </Grid>
      </div>
      <div className='space-10'></div>
      <GenericFooter text="Learn more about " linkUrl="#" linkText="analytics" />
    </Page>  
  );
}