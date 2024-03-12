import React from 'react';
import { useState, useCallback } from 'react';
import { Page ,Grid, Select, Banner } from '@shopify/polaris';
import { AnalyticsMinor } from '@shopify/polaris-icons';
import { GenericFooter } from '../components/GenericFooter';
import { DateRangeOptions } from '../shared/constants/AnalyticsOptions';
import "../components/stylesheets/mainstyle.css";
import {
  TotalSalesData,
  ConversionRate,
  TopPerformingOffersData,
  OrderOverTimeData,
  CustomTitleBar,
  AbTestingData,
  ClickThroughtRateData
} from "../components";
export default function AnalyticsOffers() { 
  const [period, setPeriod] = useState('daily');
  const [error, setError] = useState(null);

  const setTimePeriod = useCallback((val) => {
    setPeriod(val)
  },[]);

  const handleError = () => {
    setError('Some of your analytics data failed to load, so your stats may not be complete.');
  };

  return (
    <Page> 
      <CustomTitleBar title='Analytics' icon={AnalyticsMinor} />  
      { error && (
          <Banner title="Data Failed To Load" onDismiss={() => {}}>
            <p> {error} </p>
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
            <AbTestingData period={period} onError={handleError} />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 4, xl: 4 }}>
            <ConversionRate period={period } onError={handleError} />
            <ClickThroughtRateData period={period} onError={handleError}  />
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