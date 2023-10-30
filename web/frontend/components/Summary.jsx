import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, AppProvider, Text, Image, Grid, Link, Spinner } from '@shopify/polaris';
import "../components/stylesheets/editOfferStyle.css";

import { getOfferList } from '../services/offers/actions/offer';
import { getShopOffersStats } from '../services/actions/shop';

const Summary = (props) => {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const [isLoading, setIsLoading] = useState(false);
    const [offerStats, setOfferStats] = useState({});
    const [converted, setConverted] = useState(0);
    const [totalDisplayed, setTotalDisplayed] = useState(0);
    const navigateTo = useNavigate();

    const handleViewAnalytics = () => {
      navigateTo('/analytics');
    }

    useEffect(() => {
      setIsLoading(true);
      getOfferList(shopAndHost.shop)
      .then((reponse) => {
        const offerWithStats = reponse.offers?.find(incoming_offer => incoming_offer.id === props.offer?.id);
        setOfferStats(offerWithStats)
        setIsLoading(false);
      }).catch((error) => {
        console.error('An error occurred while making the API call:', error);
      }); 
      getShopOffersStats(shopAndHost.shop, 'daily')
        .then((response) => {
          setTotalDisplayed(response.offers_stats?.times_loaded);
          setConverted(response.orders_through_offers_count);
        })
        .catch((error) => {
            console.log("error", error);
        })
    }, [props.offer]);
    
    return (
      <>
        <AppProvider>
          <Card>
            <div className="comp-cont">
              <span className="text-decor">Conversion Summary</span>
              <span><Link onClick={handleViewAnalytics} removeUnderline>View analytics</Link></span>
            </div>
            {isLoading ? (
              <div style={{
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '100vh',
              }}>
                <Spinner size="large" color="teal"/>
              </div>
              ) : (
              <>
                <Grid columns={{sm: 6}}>
                      <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 7, xl: 7}}>
                          <div className="card-space">
                            <Text>Number of views: {offerStats?.views}</Text>
                            <Text>Number of clicks: {offerStats?.clicks}</Text>
                            <Text>Revenue: {offerStats?.revenue}</Text>
                            <Text>Conversion rate: {totalDisplayed > 0 ? ((converted / totalDisplayed) * 100).toFixed(2) : 0}%</Text>
                          </div>
                      </Grid.Cell>
                      <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 2, lg: 5, xl: 5}}>
                          <div style={{paddingTop: 16, float: "right"}}>
                            <Image
                                source='https://incartupsell.nyc3.cdn.digitaloceanspaces.com/offer-images/Offers.svg'
                                alt="icu offers image"
                                width={111}
                            />
                          </div>
                      </Grid.Cell>
                  </Grid>
              </>
              )
            }
          </Card>
        </AppProvider>
      </>
    )
}

export default Summary;
