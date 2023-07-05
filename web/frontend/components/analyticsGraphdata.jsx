import {LegacyCard, VerticalStack} from '@shopify/polaris';
import React, { useEffect, useState, useCallback } from 'react';
import {PolarisVizProvider, StackedAreaChart } from '@shopify/polaris-viz';
import { useAuthenticatedFetch } from "../hooks";
import { useSelector } from 'react-redux';
import '@shopify/polaris-viz/build/esm/styles.css';
  
function setKeys(period){
    if(period=='daily'){
        return ["12:00 am", "08:00 am", "04:00 pm", "12:00pm"]
    }
    else if(period=='monthly'){
        return ["1st week", "2nd week", "3rd week", "4th week"]
    }
    else if(period=='yearly'){
        return ["Jan-Mar", "Apr-Jun", "July-Sep", "Oct-Dec"]
    }
}

export function TotalSalesData() { 
    const fetch = useAuthenticatedFetch();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const [period, setPeriod] = useState('daily');
    const [salesTotal, setSalesTotal] = useState(0);
    const [salesData, setSalesData] = useState(0);
    function getSalesData(period){
        let keys = setKeys(period);
        fetch(`/api/merchant/shop_sale_stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {shopify_domain: shopAndHost.shop, period: period }),
        })
        .then( (response) => { return response.json(); })
        .then( (data) => {
            setSalesTotal(data.sales_stats.sales_total)
            setSalesData([{
                "key": keys[0],
                "value": data.sales_stats.sales_value_first
            },
            {
                "key": keys[1],
                "value": data.sales_stats.sales_value_second
            },
            {
                "key": keys[2],
                "value": data.sales_stats.sales_value_third
            },
            {
                "key": keys[3],
                "value": data.sales_stats.sales_value_forth
            }])
        })
        .catch((error) => {
            console.log("error", error);
        })
    }
    useEffect(()=>{
        getSalesData(period);
    }, [])
    return ( 
        <PolarisVizProvider
        themes={{
            Default: {
            arc: {
                cornerRadius: 5,
                thickness: 50
            }
            }
        }}
        >
        {salesData ? (<h3 className="report-money"><strong>${salesTotal}</strong></h3>):null}
        <div className="space-4"></div>
        <p>SALES OVER TIME</p><br/>
        {salesData ? (<StackedAreaChart
            comparisonMetric={{
            accessibilityLabel: 'trending up 6%',
            metric: '6%',
            trend: 'positive'
            }}
            data={[
            {
                "name": "Revenue",
                "data": salesData
            },
            ]}
            legendPosition="left"
            theme='Light'
        />) : null}
        </PolarisVizProvider>     
    );
  }


  export function ConversionRate(){
    const fetch = useAuthenticatedFetch();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const [conversionRate, setConversionRate] = useState(0);
    const [addedToCart, setAddedToCart] = useState(0);
    const [reachedCheckout, setReachedCheckout] = useState(0);
    const [converted, setConverted] = useState(0);
    const [totalDisplayed, setTotalDisplayed] = useState(0);

    function getOffersStats(){
        fetch(`/api/merchant/shop_offers_stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {shopify_domain: shopAndHost.shop }),
        })
        .then( (response) => { return response.json(); })
        .then( (data) => {
            setAddedToCart(data.offers_stats.times_clicked_total);
            setTotalDisplayed(data.offers_stats.times_loaded_total);
            setReachedCheckout(data.offers_stats.times_checkedout_total);
            setConverted(data.orders_through_offers_count);
        })
        .catch((error) => {
            console.log("error", error);
        })
    }
    useEffect(()=>{
        getOffersStats();
    }, [])
    
    return(
        <LegacyCard title="Conversion rate" sectioned>
            <h3 className="report-money"><strong>{conversionRate}%</strong></h3>
            <div className="space-4"></div>
            <p>CONVERSION FUNNEL</p><br/>
            <VerticalStack gap="5">
                <div height="50px">
                    <span>Added to cart</span><span style={{float: 'right'}}>{totalDisplayed>0 ? ((addedToCart/totalDisplayed)*100).toFixed(2) : 0}%</span>
                    <div style={{color: 'grey'}}>{addedToCart>=0? addedToCart : 0} sessions</div>
                </div>
                <div height="50px">
                    <span>Reached Checkout</span><span style={{float: 'right'}}>{totalDisplayed>0 ? ((reachedCheckout/totalDisplayed)*100).toFixed(2) : 0}%</span>
                    <div style={{color: 'grey'}}>{reachedCheckout>=0? reachedCheckout : 0} sessions</div>
                </div>
                <div height="50px">
                    <span>Sessions converted</span><span style={{float: 'right'}}>{totalDisplayed>0 ? ((converted/totalDisplayed)*100).toFixed(2) : 0}%</span>
                    <div style={{color: 'grey'}}>{converted>=0? converted : 0} sessions</div>
                </div>
            </VerticalStack>
        </LegacyCard>
    );
  }


  export function OrderOverTimeData(){
    const fetch = useAuthenticatedFetch();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const [period, setPeriod] = useState('daily');
    const [ordersTotal, setOrdersTotal] = useState(0);
    const [ordersData, setOrdersData] = useState(null);

    function getOrdersData(period) {
        let keys = setKeys(period);
        fetch(`/api/merchant/shop_orders_stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {shopify_domain: shopAndHost.shop, period: period }),
        })
        .then( (response) => { return response.json(); })
        .then( (data) => {
            setOrdersTotal(data.orders_stats.orders_total)
            setOrdersData([{
                "key": keys[0],
                "value": data.orders_stats.orders_value_first
            },
            {
                "key": keys[1],
                "value": data.orders_stats.orders_value_second
            },
            {
                "key": keys[2],
                "value": data.orders_stats.orders_value_third
            },
            {
                "key": keys[3],
                "value": data.orders_stats.orders_value_forth
            }])
        })
        .catch((error) => {
            console.log("error", error);
        })
    }
    useEffect(()=>{
        getOrdersData(period);
    }, [])
    return(
        <PolarisVizProvider
        themes={{
            Default: {
            arc: {
                cornerRadius: 5,
                thickness: 50
            }
            }
        }}
        >
        {ordersData? (<h3 className="report-money"><strong>{ordersTotal}</strong></h3>):null}
        <div className="space-4"></div>
        <p>ORDERS OVER TIME</p><br/>
        {ordersData? (<StackedAreaChart
            comparisonMetric={{
            accessibilityLabel: 'trending up 6%',
            metric: '6%',
            trend: 'positive'
            }}
            data={[{
                "name": "Orders",
                "data": ordersData
            }]}
            legendPosition="left"
            theme='Light'
        />):null}
        </PolarisVizProvider>  
    );

  }

  export function AbTestingData(){

    return(
        <PolarisVizProvider
        themes={{
            Default: {
            arc: {
                cornerRadius: 5,
                thickness: 50
            }
            }
        }}
        >
        <StackedAreaChart
            comparisonMetric={{
            accessibilityLabel: 'trending up 6%',
            metric: '6%',
            trend: 'positive'
            }}
            data={[
            {
                "name": "Orders",
                "data": [
                {
                    "key": "January",
                    "value": 4200
                },
                {
                    "key": "February",
                    "value": 5000
                },
                {
                    "key": "March",
                    "value": 5700
                },
                {
                    "key": "April",
                    "value": 5500
                },
                {
                    "key": "May",
                    "value": 5300
                },
                {
                    "key": "June",
                    "value": 5600
                },
                {
                    "key": "July",
                    "value": 3200
                }
                ]
            },
            ]}
            legendPosition="left"
            theme='Light'
        />
        </PolarisVizProvider>  
    );

  } 

  export function ClickThroughtRateData(){

    return(
        <PolarisVizProvider
        themes={{
            Default: {
            arc: {
                cornerRadius: 5,
                thickness: 50
            }
            }
        }}
        >
        <StackedAreaChart
            comparisonMetric={{
            accessibilityLabel: 'trending up 6%',
            metric: '6%',
            trend: 'positive'
            }}
            data={[
            {
                "name": "Orders",
                "data": [
                {
                    "key": "January",
                    "value": 4200
                },
                {
                    "key": "February",
                    "value": 5000
                },
                {
                    "key": "March",
                    "value": 5700
                },
                {
                    "key": "April",
                    "value": 5500
                },
                {
                    "key": "May",
                    "value": 5300
                },
                {
                    "key": "June",
                    "value": 5600
                },
                {
                    "key": "July",
                    "value": 3200
                }
                ]
            },
            ]}
            legendPosition="left"
            theme='Light'
        />
        </PolarisVizProvider>  
    );

  }
