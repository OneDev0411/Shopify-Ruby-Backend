import React from 'react';
import {useState, useCallback} from 'react';
import { Page ,Grid, Select } from '@shopify/polaris';
import {AnalyticsMinor} from '@shopify/polaris-icons';
import "../components/stylesheets/mainstyle.css";
import { TotalSalesData, ConversionRate, TopPerformingOffersData, OrderOverTimeData, CustomTitleBar} from "../components";
  
export default function AnalyticsOffers() { 
    const [period, setPeriod] = useState('daily');
    const setTimePeriod = useCallback((val) => {
      setPeriod(val)
    },[]);

    const options = [
      {label: 'Today', value: 'daily'},
      {label: 'Last week', value: 'weekly'},
      {label: 'Last Month', value: 'monthly'},
      {label: 'This 3 Months', value: '3-months'},
      {label: 'This 6 Months', value: '6-months'},
      {label: 'This year', value: 'yearly'},
      {label: 'All time', value: 'all'},
    ];

    return (
      <Page> 
         <CustomTitleBar title='Analytics' icon={AnalyticsMinor} />  
        <div className="space-10"></div>
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <Select
              label="Date range"
              options={options}
              onChange={setTimePeriod}
              value={period}
            />
          </Grid.Cell>
        </Grid>
        <div className="space-10"></div>
        <div id={"graphs"}>
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <TotalSalesData period={period}/>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <ConversionRate period={period}/>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <OrderOverTimeData period={period}/>
            <TopPerformingOffersData period={period} />
          </Grid.Cell>
        </Grid>
        </div>
        <div className='space-10'></div>
      </Page>
    );
  }