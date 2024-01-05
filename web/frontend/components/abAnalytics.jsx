import { Card, AppProvider, Text, Grid } from '@shopify/polaris';
import "../components/stylesheets/editOfferStyle.css";
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAuthenticatedFetch } from '../hooks';
import { ABTestingOptions } from '../shared/constants/Others';

const AbAnalytics = (props) => {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const [aAnalytics, setAAnalytics] = useState();
    const [bAnalytics, setBAnalytics] = useState();
    const fetch = useAuthenticatedFetch(shopAndHost.host);

    const getAbAnalytics = useCallback((offerId, shop, version, setRequiredState) => {
        fetch(`/api/merchant/offers/load_ab_analytics`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ offer_id: offerId , shop: shop, version: version })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                setRequiredState(data.ctr_str)
            }
        })
        .catch((error) => {
            console.error('An error occurred while making the API call:', error);
        })
    }, []); 

    useEffect(() => {
        getAbAnalytics(props.offerId, shopAndHost.shop, 'a', setAAnalytics)
        getAbAnalytics(props.offerId, shopAndHost.shop, 'b', setBAnalytics)
      },[]);

    return (
      <>
        <AppProvider>
          <Card>
            <div className="analytics-card-style">
                <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <Text variant="headingSm" as="h6" >
                            Options
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <Text variant="headingSm" as="h6" >
                            Click Rate
                        </Text>
                    </Grid.Cell>
                </Grid>
            </div>
            <div className="card-space">
                {ABTestingOptions.map((option, index) => (
                    <Grid key={index}>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <Text variant="body" as="p">
                                {option}
                            </Text>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <Text variant="body" as="p">
                                {index === 0 ? aAnalytics : bAnalytics}
                            </Text>
                        </Grid.Cell>
                    </Grid>
                ))}
            </div>
          </Card>
        </AppProvider>
      </>
    )
}

export default AbAnalytics;
