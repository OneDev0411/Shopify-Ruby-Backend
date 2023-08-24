import {LegacyCard,Page,FooterHelp,Link,Grid,Popover, ActionList, Button,LegacyStack,Image} from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import {CalendarMinor} from '@shopify/polaris-icons';
import "../components/stylesheets/mainstyle.css";
import {useState, useCallback} from 'react';
import React from 'react';
import { GenericFooter } from '../components/GenericFooter';
import { TotalSalesData, ConversionRate, OrderOverTimeData} from "../components";
  
export default function AnalyticsOffers() { 
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);
  
    const activator = (
      <Button onClick={toggleActive} disclosure>
        Today
      </Button>
    );

    return (
      <Page> 
        <TitleBar
            title="Analytics"
        /> 
        <div className="space-10"></div>
        <Popover
            active={active}
            activator={activator}
            autofocusTarget="first-node"
            onClose={toggleActive}
        >
            <ActionList
            actionRole="menuitem"
            items={[
                {content: 'Today', icon: CalendarMinor},
                {content: 'Last week', icon: CalendarMinor},
                {content: 'Last Month', icon: CalendarMinor},
                {content: 'This 3 Months', icon: CalendarMinor},
                {content: 'This 6 Months', icon: CalendarMinor},
                {content: 'This year', icon: CalendarMinor},
                {content: 'All time', icon: CalendarMinor},
            ]}
            />
        </Popover>
        <div className="space-10"></div>
        <div id={"graphs"}>
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
        </div>
        <div className='space-10'></div>
        <GenericFooter text='Learn more about ' linkUrl='#' linkText='analytics'></GenericFooter>
      </Page>
    );
  }