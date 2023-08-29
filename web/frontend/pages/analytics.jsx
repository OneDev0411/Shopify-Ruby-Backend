import {LegacyCard,Page,FooterHelp,Link,Grid,Popover, ActionList, Button,LegacyStack,Image, Select} from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import {CalendarMinor} from '@shopify/polaris-icons';
import "../components/stylesheets/mainstyle.css";
import {useState, useCallback} from 'react';
import React from 'react';
import { GenericFooter } from '../components/GenericFooter';
import { TotalSalesData, ConversionRate, OrderOverTimeData} from "../components";
  
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
        <TitleBar
            title="Analytics"
        /> 
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
          </Grid.Cell>
          {/* A/B testing report */}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <LegacyCard title="A/B testing" sectioned>
              <h3 className="report-money"><strong>$0.00</strong></h3>
              <div className="space-4"></div>
              <p>SALES OVER TIME</p>
              <br/>
              <p>placeholder for AbTestingData component</p>
            </LegacyCard>
            <div className={'space-4'}></div>
            <LegacyStack distribution="center">
              <Button>Select offer to compare</Button>
          </LegacyStack>
          </Grid.Cell>
          {/*Click through rate*/}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <LegacyCard title="Click through rate" sectioned>
              <h3 className="report-money"><strong>0</strong></h3>
              <div className="space-4"></div>
              <p>CLICK THROUGH RATE</p>
              <br/>
              <p>placeholder for ClickThroughtRateData component</p>
            </LegacyCard>
          </Grid.Cell>
          {/* top performing offers */}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <LegacyCard title="Top performing offers" sectioned>
              <h3 className="report-money"><strong>0</strong></h3>
              <div className="space-4"></div>
              <LegacyStack distribution='equalSpacing'>
                <LegacyStack.Item>
                  <p><strong>Offer name</strong></p>
                  <p><strong>Offer name</strong></p>
                  <p><strong>Offer name</strong></p>
                  <p><strong>Offer name</strong></p>
                  <p><strong>Offer name</strong></p>
                  <p><strong>Offer name</strong></p>
                </LegacyStack.Item>
                <LegacyStack.Item>
                  <Image 
                    source={"./assets/Analytics.png"}
                    width={"150px"}
                    max-Width={"150px"}
                  />
                </LegacyStack.Item>
              </LegacyStack>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
        </div>
        <div className='space-10'></div>
        <GenericFooter text='Learn more about ' linkUrl='#' linkText='analytics'></GenericFooter>
      </Page>
    );
  }