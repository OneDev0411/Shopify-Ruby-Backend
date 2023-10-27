import { Card, AppProvider, Text, Grid } from '@shopify/polaris';
import "../components/stylesheets/editOfferStyle.css";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAbAnalytics } from '../services/offers/actions/offer';

const AbAnalytics = (props) => {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const [aAnalytics, setAAnalytics] = useState();
    const [bAnalytics, setBAnalytics] = useState();

    useEffect(() => {
        getAbAnalytics(props.offerId, shopAndHost.shop, 'a')
        .then((data) => {
            if (data) {
              setAAnalytics(data.ctr_str)
            } 
          })
          .catch((error) => {
            setIsLoading(false);
            console.error('An error occurred while making the API call:', error);
          });
        getAbAnalytics(props.offerId, shopAndHost.shop, 'b')
        .then((data) => {
            if (data) {
            setBAnalytics(data.ctr_str)
            } 
        })
        .catch((error) => {
            setIsLoading(false);
            console.error('An error occurred while making the API call:', error);
        });
          
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
                <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <Text variant="body" as="p" >
                            Option A
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <Text variant="body" as="p" >
                            {aAnalytics}
                        </Text>
                    </Grid.Cell>
                </Grid>
                <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <Text variant="body" as="p" >
                            Option B
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <Text variant="body" as="p">
                            {bAnalytics}
                        </Text>
                    </Grid.Cell>
                </Grid>
            </div>
          </Card>
        </AppProvider>
      </>
    )
}

export default AbAnalytics;
