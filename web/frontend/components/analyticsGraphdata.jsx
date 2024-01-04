import { LegacyCard, SkeletonBodyText, VerticalStack } from '@shopify/polaris';
import React, { useEffect, useState, useCallback } from 'react';
import { PolarisVizProvider, StackedAreaChart } from '@shopify/polaris-viz';
import { useAuthenticatedFetch } from "../hooks";
import { useSelector } from 'react-redux';
import '@shopify/polaris-viz/build/esm/styles.css';
import {Redirect} from '@shopify/app-bridge/actions';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";

export function TotalSalesData(props) {
    const app = useAppBridge();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [salesTotal, setSalesTotal] = useState(0);
    const [salesData, setSalesData] = useState(0);
    const [loading, setLoading] = useState(false); 
    function getSalesData(period) {
        let redirect = Redirect.create(app);
        if(loading) return;
        setLoading(true)
        fetch(`/api/merchant/shop_sale_stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
        })
            .then((response) => { return response.json(); })
            .then((data) => {
                if (data.redirect_to) {
                    redirect.dispatch(Redirect.Action.APP, data.redirect_to);
                } else {
                setSalesTotal(data.sales_stats.sales_total)
                setSalesData(data.sales_stats.results);
                }})
            .catch((error) => {
                console.log("error", error);
            }).finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        getSalesData(props.period);
    }, [props.period])
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
            <LegacyCard title={`${props.title ? `${props.period[0].toUpperCase()}${props.period.substring(1)} ` : ''} Total Sales`} sectioned>`
                {salesData ? (<h3 className="report-money"><strong>${salesTotal}</strong></h3>) : null}
                <div className="space-4"></div>
                <p>SALES OVER TIME</p><br />
                {loading ? <SkeletonBodyText lines={10} /> : salesData ? (<StackedAreaChart
                    isAnimated={true}
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
            </LegacyCard>
        </PolarisVizProvider>
    );
}


export function ConversionRate(props) {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [addedToCart, setAddedToCart] = useState(0);
    const [reachedCheckout, setReachedCheckout] = useState(0);
    const [converted, setConverted] = useState(0);
    const [totalDisplayed, setTotalDisplayed] = useState(0);

    function getOffersStats(period) {
        fetch(`/api/merchant/shop_offers_stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
        })
            .then((response) => { return response.json(); })
            .then((data) => {
                setAddedToCart(data.offers_stats.times_clicked);
                setTotalDisplayed(data.offers_stats.times_loaded);
                setReachedCheckout(data.offers_stats.times_checkedout);
                setConverted(data.orders_through_offers_count);
            })
            .catch((error) => {
                console.log("error", error);
            })
    }
    useEffect(() => {
        getOffersStats(props.period);
    }, [props.period])

    return (
        <LegacyCard title={`${props.title ? `${props.period[0].toUpperCase()}${props.period.substring(1)} ` : ''} Conversion Rate`} sectioned>
            <h3 className="report-money"><strong>{totalDisplayed > 0 ? ((converted / totalDisplayed) * 100).toFixed(2) : 0}%</strong></h3>
            <div className="space-4"></div>
            <p>CONVERSION FUNNEL</p><br />
            <VerticalStack gap="10">
                <div height="50px">
                    <span>Added to cart</span><span style={{ float: 'right' }}>{totalDisplayed > 0 ? ((addedToCart / totalDisplayed) * 100).toFixed(2) : 0}%</span>
                    <div style={{ color: 'grey' }}>{addedToCart >= 0 ? addedToCart : 0} sessions</div>
                </div>
                <div height="50px">
                    <span>Reached Checkout</span><span style={{ float: 'right' }}>{totalDisplayed > 0 ? ((reachedCheckout / totalDisplayed) * 100).toFixed(2) : 0}%</span>
                    <div style={{ color: 'grey' }}>{reachedCheckout >= 0 ? reachedCheckout : 0} sessions</div>
                </div>
                <div height="50px">
                    <span>Sessions converted</span><span style={{ float: 'right' }}>{totalDisplayed > 0 ? ((converted / totalDisplayed) * 100).toFixed(2) : 0}%</span>
                    <div style={{ color: 'grey' }}>{converted >= 0 ? converted : 0} sessions</div>
                </div>
            </VerticalStack>
        </LegacyCard>
    );
}


export function OrderOverTimeData(props) {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [ordersTotal, setOrdersTotal] = useState(0);
    const [ordersData, setOrdersData] = useState(null);
    const [loading, setLoading] = useState(false); 

    function getOrdersData(period) {
        if(loading) return;
        setLoading(true)
        fetch(`/api/merchant/shop_orders_stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
        })
            .then((response) => { return response.json(); })
            .then((data) => {
                setOrdersTotal(data.orders_stats.orders_total)
                setOrdersData(data.orders_stats.results)
            })
            .catch((error) => {
                console.log("error", error);
            }).finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        getOrdersData(props.period);
    }, [props.period])
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
            <LegacyCard title={`${props.title ? `${props.period[0].toUpperCase()}${props.period.substring(1)} ` : ''} Total Orders`} sectioned>
                {ordersData ? (<h3 className="report-money"><strong>{ordersTotal}</strong></h3>) : null}
                <div className="space-4"></div>
                <p>ORDERS OVER TIME</p><br />
                <div className="space-5"></div>
                {loading ? <SkeletonBodyText lines={10} /> : ordersData ? (<StackedAreaChart
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
                />) : null}
            </LegacyCard>
        </PolarisVizProvider>
    );

}

export function AbTestingData() {

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

export function ClickThroughtRateData() {

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
