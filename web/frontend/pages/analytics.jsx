import React from 'react';
import { useState, useCallback } from 'react';
import { Page ,Grid, Select } from '@shopify/polaris';
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
  const setTimePeriod = useCallback((val) => {
    setPeriod(val)
  },[]);

  return (
    <Page> 
      <CustomTitleBar title='Analytics' icon={AnalyticsMinor} />  
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
            <TotalSalesData period={period}/>
            <AbTestingData period={period} />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 4, xl: 4 }}>
            <ConversionRate period={period}/>
            <ClickThroughtRateData period={period} />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 4, xl: 4 }}>
            <OrderOverTimeData period={period}/>
            <TopPerformingOffersData period={period} />
          </Grid.Cell>
        </Grid>
      </div>
      <div className='space-10'></div>
      <GenericFooter text="Learn more about " linkUrl="#" linkText="analytics" />
    </Page>
  );
}