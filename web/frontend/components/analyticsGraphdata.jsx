import {DataTable} from '@shopify/polaris';
import React from 'react';
import {PolarisVizProvider, StackedAreaChart } from '@shopify/polaris-viz';
import '@shopify/polaris-viz/build/esm/styles.css';
  
export function TotalSalesData() { 
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
        <StackedAreaChart
            comparisonMetric={{
            accessibilityLabel: 'trending up 6%',
            metric: '6%',
            trend: 'positive'
            }}
            data={[
            {
                "name": "Revenue",
                "data": [
                {
                    "key": "January",
                    "value": 4237
                },
                {
                    "key": "February",
                    "value": 5024
                },
                {
                    "key": "March",
                    "value": 5730
                },
                {
                    "key": "April",
                    "value": 5587
                },
                {
                    "key": "May",
                    "value": 5303
                },
                {
                    "key": "June",
                    "value": 5634
                },
                {
                    "key": "July",
                    "value": 3238
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
                    "value": 42
                },
                {
                    "key": "February",
                    "value": 50
                },
                {
                    "key": "March",
                    "value": 57
                },
                {
                    "key": "April",
                    "value": 55
                },
                {
                    "key": "May",
                    "value": 53
                },
                {
                    "key": "June",
                    "value": 56
                },
                {
                    "key": "July",
                    "value": 32
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
