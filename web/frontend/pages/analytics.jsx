import {Card,Page,FooterHelp,Link,Grid,Popover, ActionList, Button,Stack} from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import {CalendarMinor} from '@shopify/polaris-icons';
import "../components/stylesheets/mainstyle.css";
import 'charts.css';
import {useState, useCallback} from 'react';
import React from 'react';
  
export default function AnalyticsOffers() { 
    const [active, setActive] = useState(true);

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
        <Grid>
          {/* Total sales */}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <Card title="Total sales" sectioned>
              <h3 className="report-money"><strong>$100.00</strong></h3>
              <div className="space-4"></div>
              <p>SALES OVER TIME</p>
              <table id={"column-example-1"} class={"charts-css column"}>
                <caption> Column Example #1 </caption>
                <tbody>
                </tbody>
              </table>
            </Card>
          </Grid.Cell>
          {/* Conversion rate */}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <Card title="Conversion rate" sectioned>
              <h3 className="report-money"><strong>12%</strong></h3>
              <div className="space-4"></div>
              <p>CONVERSION FUNNEL</p>
              <table id={"column-example-1"} class={"charts-css column"}>
                <caption> Column Example #1 </caption>
                <tbody>
                </tbody>
              </table>
            </Card>
          </Grid.Cell>
          {/* Total order */}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <Card title="Total order" sectioned>
              <h3 className="report-money"><strong>40</strong></h3>
              <div className="space-4"></div>
              <p>ORDERS OVER TIME</p>
              <table id={"column-example-1"} class={"charts-css column"}>
                <caption> Column Example #1 </caption>
                <tbody>
                </tbody>
              </table> 
            </Card>
          </Grid.Cell>
          {/* A/B testing report */}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <Card title="A/B testing" sectioned>
              <h3 className="report-money"><strong>$0.00</strong></h3>
              <div className="space-4"></div>
              <p>SALES OVER TIME</p>
              <table id={"column-example-1"} class={"charts-css column"}>
                <caption> Column Example #1 </caption>
                <tbody>
                </tbody>
              </table> 
            </Card>
            <div className={'space-4'}></div>
            <Stack distribution="center">
              <Button>Select offer to compare</Button>
          </Stack>
          </Grid.Cell>
          {/*Click through rate*/}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <Card title="Click through rate" sectioned>
              <h3 className="report-money"><strong>0</strong></h3>
              <div className="space-4"></div>
              <p>CLICK THROUGH RATE</p>
              <table id={"column-example-1"} class={"charts-css column"}>
                <caption> Column Example #1 </caption>
                <tbody>
                </tbody>
              </table> 
            </Card>
          </Grid.Cell>
          {/* top performing offers */}
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
            <Card title="Top performing offers" sectioned>
              <h3 className="report-money"><strong>0</strong></h3>
              <div className="space-4"></div>
              <p><strong>Offer name</strong></p>
              <p><strong>Offer name</strong></p>
              <p><strong>Offer name</strong></p>
            </Card>
          </Grid.Cell>
        </Grid>
        <div className='space-10'></div>
        <FooterHelp>
          Learn more about{' '}
          <Link url="#">
            analytics
          </Link>
        </FooterHelp><div> </div>
      </Page>
    );
  }