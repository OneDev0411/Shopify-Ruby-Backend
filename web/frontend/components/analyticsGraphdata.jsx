import {DataTable} from '@shopify/polaris';
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
    const [salesData, setSalesData] = useState(null);
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
    const rows = [
        ['Emerald Silk Gown', 875],
        ['Mauve Cashmere Scarf', 230],
        ['Navy Merino Wool', 445],
      ];
    
    return(
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
          ]}
          headings={[
            'Product',
            'Price',
          ]}
          rows={rows}
        />
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
