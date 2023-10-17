import {LegacyCard,Page,FooterHelp,Link,Grid,Popover, ActionList, Button,LegacyStack,Image, Select} from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import {CalendarMinor} from '@shopify/polaris-icons';
import "../components/stylesheets/mainstyle.css";
import {useState, useCallback} from 'react';
import React from 'react';
import { GenericFooter } from '../components/GenericFooter';
import { TotalSalesData, ConversionRate, OrderOverTimeData, CustomTitleBar} from "../components";
import {
  AnalyticsMinor
} from '@shopify/polaris-icons';
  
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
          {/*<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>*/}
          {/*  <ConversionRate period={period}/>*/}
          {/*</Grid.Cell>*/}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <OrderOverTimeData period={period}/>
          </Grid.Cell>
        </Grid>
        </div>
        <div className='space-10'></div>
      </Page>
    );
  }