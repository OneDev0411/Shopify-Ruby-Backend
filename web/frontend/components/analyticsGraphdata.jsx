import {
    HorizontalStack,
    LegacyCard,
    VerticalStack,
    Text,
    Divider,
} from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import { PolarisVizProvider, StackedAreaChart } from '@shopify/polaris-viz';
import { useAuthenticatedFetch } from "../hooks";
import { useSelector } from 'react-redux';
import '@shopify/polaris-viz/build/esm/styles.css';
import { Redirect } from '@shopify/app-bridge/actions';
import { useAppBridge } from "@shopify/app-bridge-react";


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
        fetch(`/api/v2/merchant/shop_sale_stats`, {
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
                if (props.onError) {
                    props.onError(error);
                }
            }).finally(() => {
                setLoading(false);
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
            <LegacyCard title={`${props.title ? `${props.period[0].toUpperCase()}${props.period.substring(1)} ` : ''} Total Sales`} sectioned>
                {salesData ? (<h3 className="report-money"><strong>${salesTotal}</strong></h3>) : null}
                <div className="space-4"></div>
                <p>SALES OVER TIME</p><br />
                {loading ? "Loading..." : salesData ? (<StackedAreaChart
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
    const app = useAppBridge();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [addedToCart, setAddedToCart] = useState(0);
    const [reachedCheckout, setReachedCheckout] = useState(0);
    const [converted, setConverted] = useState(0);
    const [totalDisplayed, setTotalDisplayed] = useState(0);
    function getOffersStats(endpointUrl, period, callback) {
        fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
        })
            .then((response) => { return response.json(); })
            .then((data) => {
                callback(data)
            })
            .catch((error) => {
                if (props.onError) {
                    props.onError(error);
                }
            })
    }

    function getOffersStatsTimesLoaded(period) {
        let redirect = Redirect.create(app);
        getOffersStats(
            `/api/v2/merchant/shop_offers_stats_times_loaded`, 
            period, 
            (data) => {
                if (data.redirect_to) {
                    redirect.dispatch(Redirect.Action.APP, data.redirect_to);
                } else {
                setTotalDisplayed(data.stat_times_loaded);
                setConverted(data.orders_through_offers_count);
            }});
    }

    function getOffersStatsTimesClicked(period) {
        getOffersStats(
            `/api/v2/merchant/shop_offers_stats_times_clicked`,
            period,
            (data) => { setAddedToCart(data.stat_times_clicked); }
        )
    }

    function getOffersStatsTimesCheckedout(period) {
        getOffersStats(
            `/api/v2/merchant/shop_offers_stats_times_checkedout`,
            period,
            (data) => { setReachedCheckout(data.stat_times_checkedout); }
        )
    }

    useEffect(() => {
        getOffersStatsTimesLoaded(props.period);
        getOffersStatsTimesClicked(props.period);
        getOffersStatsTimesCheckedout(props.period);
    }, [props.period])

    return (
        <LegacyCard title={`${props.title ? `${props.period[0].toUpperCase()}${props.period.substring(1)} ` : ''} Conversion Rate`} sectioned>
            <h3 className="report-money"><strong>{totalDisplayed > 0 ? ((converted / totalDisplayed) * 100).toFixed(2) : 0}%</strong></h3>
            <div className="space-4"></div>
            <p>CONVERSION FUNNEL</p><br />
            <VerticalStack gap={"6"}>
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
    const app = useAppBridge();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [ordersTotal, setOrdersTotal] = useState(0);
    const [ordersData, setOrdersData] = useState(null);
    const [loading, setLoading] = useState(false); 
    function getOrdersData(period) {
        let redirect = Redirect.create(app);
        if(loading) return;
        setLoading(true)
        fetch(`/api/v2/merchant/shop_orders_stats`, {
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
                setOrdersTotal(data.orders_stats.orders_total)
                setOrdersData(data.orders_stats.results)
            }})
            .catch((error) => {
                if (props.onError) {
                    props.onError(error);
                }
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
                {loading ? "Loading..." : ordersData ? (<StackedAreaChart
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

export function TopPerformingOffersData(props) {
    const app = useAppBridge();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [offersData, setOffersData] = useState([]);

    function getOffersData(period) {
        let redirect = Redirect.create(app);
        fetch(`/api/v2/merchant/offers_list_by_period`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.redirect_to) {
                    redirect.dispatch(Redirect.Action.APP, data.redirect_to);
                } else {
                setOffersData(data.offers);
            }})
            .catch((error) => {
                if (props.onError) {
                    props.onError(error);
                }
            })
    }

    useEffect(() => {
        getOffersData(props.period);
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
            <LegacyCard title={`${props.title ? `${props.period[0].toUpperCase()}${props.period.substring(1)} ` : ''} Top performing offers`} sectioned>
                <div className="space-4"></div>
                <VerticalStack align='center'>
                    {
                        offersData.map((item, idx) => {
                            return (
                                <div key={idx}>
                                    <Divider />
                                    <div style={{ padding: '16px 0' }}>
                                        <HorizontalStack align="space-between">
                                            <Text as="p">{item.title}</Text>
                                            <Text as="p">{item.clicks} clicks</Text>
                                            <Text as="p">$ {item.revenue}</Text>
                                        </HorizontalStack>
                                    </div>
                                </div>
                            )
                        })
                    }
                </VerticalStack>
            </LegacyCard>
        </PolarisVizProvider>
    )
}

export function AbTestingData(props) {
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

        fetch(`/api/v2/merchant/shop_sale_stats`, {
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
                if (props.onError) {
                    props.onError(error);
                }
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
            <LegacyCard title={`${props.title ? `${props.period[0].toUpperCase()}${props.period.substring(1)} ` : ''} A/B testing`} sectioned>
                {salesData ? (<h3 className="report-money"><strong>${salesTotal}</strong></h3>) : null}
                <div className="space-4"></div>
                <p>SALES OVER TIME</p><br />
                {loading ? "Loading..." : salesData ? (<StackedAreaChart
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

export function ClickThroughtRateData(props) {
    const app = useAppBridge();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [clicksTotal, setClicksTotal] = useState(0);
    const [clicksData, setClicksData] = useState(null);
    const [loading, setLoading] = useState(false); 

    function getClicksData(period) {
        let redirect = Redirect.create(app);
        if(loading) return;
        setLoading(true)
        fetch(`/api/v2/merchant/shop_clicks_stats`, {
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
                setClicksTotal(data.clicks_stats.clicks_total)
                setClicksData(data.clicks_stats.results)
            }})
            .catch((error) => {
                if (props.onError) {
                    props.onError(error);
                }
            }).finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        getClicksData(props.period);
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
            <LegacyCard title={`${props.title ? `${props.period[0].toUpperCase()}${props.period.substring(1)} ` : ''} Click through rate`} sectioned>
                {clicksData ? (<h3 className="report-money"><strong>{clicksTotal}</strong></h3>) : null}
                <div className="space-4"></div>
                <p>Clicks through rate over time</p><br />
                <div className="space-5"></div>
                {loading ? "Loading..." : clicksData ? (<StackedAreaChart
                    comparisonMetric={{
                        accessibilityLabel: 'trending up 6%',
                        metric: '6%',
                        trend: 'positive'
                    }}
                    data={[{
                        "name": "Clicks through rate",
                        "data": clicksData
                    }]}
                    legendPosition="left"
                    theme='Light'
                />) : null}
            </LegacyCard>
        </PolarisVizProvider>
    );
}
