import {LegacyCard, Page, Layout, Image, LegacyStack, Banner} from "@shopify/polaris";
import { useAppBridge } from '@shopify/app-bridge-react'
import {Redirect, Toast} from '@shopify/app-bridge/actions';
import {billingImg} from "../assets";
import {
	BillingStatementDollarMajor
} from '@shopify/polaris-icons';
import { Reviews, CustomTitleBar } from "../components";
import "../components/stylesheets/mainstyle.css";
import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { isSubscriptionActive } from "../services/actions/subscription";

export default function Subscription() {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [planName, setPlanName] = useState();
    const [trialDays, setTrialDays] = useState();
    const [activeOffersCount, setActiveOffersCount] = useState();
    const [unpublishedOfferIds, setUnpublishedOfferIds] = useState();
    const app = useAppBridge();

    async function handlePlanChange (internal_name) {
        let redirect = Redirect.create(app);

        fetch('/api/merchant/subscription', {
            method: 'PUT',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify( {subscription: { plan_internal_name: internal_name }, shop: shopAndHost.shop }),
           })
           .then( (response) => { return response.json(); })
           .then( (data) => {
                if (data.payment == 'no') {
                    const toastOptions = {
                        message: data.message,
                        duration: 3000,
                        isError: false,
                    };
                    const toastNotice = Toast.create(app, toastOptions);
                    toastNotice.dispatch(Toast.Action.SHOW);
                    redirect.dispatch(Redirect.Action.APP, `/?shop=${shopAndHost.shop}`);
                } else {
                    redirect.dispatch(Redirect.Action.REMOTE, data.url+'/?shop='+shopAndHost.shop);
                }
           })
           .catch((error) => {
            console.log("error", error);
           })
    }

    const fetchSubscription = useCallback(() => {
        fetch(`/api/merchant/current_subscription?shop=${shopAndHost.shop}`, {
            method: 'GET',
               headers: {
                 'Content-Type': 'application/json',
               },
           })
           .then( (response) => { return response.json(); })
           .then( (data) => {
                setCurrentSubscription(data.subscription);
                setPlanName(data.plan);
                setTrialDays(data.days_remaining_in_trial);
                setActiveOffersCount(data.active_offers_count);
                setUnpublishedOfferIds(data.unpublished_offer_ids)
           })
           .catch((error) => {
            console.log("error", error);
           })
      }, []);

    useEffect(() => {
        fetchSubscription();
      }, [fetchSubscription]);
    
  return (
    <Page>
        <CustomTitleBar title='Billing' icon={BillingStatementDollarMajor}/>
        <div className="auto-height">
            <Layout>
                <Layout.Section>
                    {(isSubscriptionActive(currentSubscription) && planName!=='free' && trialDays>0) ? (
                        <Banner icon='none' status="info">
                            <p>{ trialDays } days remaining for the trial period</p>
                        </Banner>) : null
                    }
                    {!isSubscriptionActive(currentSubscription) ? (
                        <Banner icon='none' status="info">
                            <p>Your Subscription Is Not Active: please confirm it on this page</p>
                        </Banner> ) : null
                    }
                    {(planName==='trial' && (unpublishedOfferIds?.lenght>0 || activeOffersCount)) ? (
                        <Banner icon='none' status="info">
                            <p>If you choose free plan after trial, offers will be unpublished</p>
                        </Banner>) : null
                    }
                </Layout.Section>
                <Layout.Section>
                    Choose a Plan
                </Layout.Section>
                <Layout.Section>
                    <LegacyCard title="Paid"
                        primaryFooterAction={(planName==='flex' && isSubscriptionActive(currentSubscription)) ? null : {content: 'Upgrade', onClick: () => handlePlanChange('plan_based_billing')}}
                        sectioned
                    >
                        <LegacyStack>
                            <LegacyStack.Item>
                                {(planName==='flex' && isSubscriptionActive(currentSubscription)) ? (
                                    <p><small>Current Plan</small></p>
                                ) : (
                                    <p><small>Recommended</small></p>
                                )}
                                <div className="space-4"></div>
                                <p>
                                500 Offers<br/>
                                Geo targeting<br/>
                                Autopilot (AI-generated offers feature)<br/>
                                A/B testing<br/>
                                Advanced discount terms<br/>
                                Live onboarding<br/>
                                Success manager support<br/>
                                Remove "Power by In Cart Upsell" water mark on offer box
                                </p>                                
                                <p>
                                    Shopify Basic<br/>
                                    <b>$19.99/month</b><br/>
                                    Shopify Standard<br/>
                                    <b>$29.99/month</b><br/>
                                    Shopify Advanced<br/>
                                    <b>$59.99/month</b><br/>
                                    Shopify Plus<br/>
                                    <b>$99.99/month</b>
                                </p>                   
                            </LegacyStack.Item>
                            <LegacyStack.Item>
                                <Image
                                    source={billingImg}
                                    alt="upgrade subscription"
                                    width={200}
                                />
                            </LegacyStack.Item>
                        </LegacyStack>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section secondary>
                    <LegacyCard title="Free" sectioned primaryFooterAction={(planName==='free' && isSubscriptionActive(currentSubscription)) ? null : {content: 'Downgrade', onClick: () => handlePlanChange('free_plan'), id: 'btnf'}}>
                        {(planName==='free' && isSubscriptionActive(currentSubscription)) ? (
                             <p><small>Current Plan</small></p>
                        ) : (
                            <p><small>Not Recommended</small></p>
                        )}  
                        <div className="space-4"></div>
                        <p>
                            Limited offer<br/>
                            Geo targeting<br/>
                            Autopilot (AI-generated offers feature)<br/>
                            A/B testing<br/>
                            Advanced discount terms<br/>
                            "Power by In Cart Upsell" water mark on offer box
                            <br/><br/>
                        </p>                
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </div>
            
        <div className="space-10"></div>
        <Layout>
            <Layout.Section>
                <LegacyCard sectioned>
                    <p>Need help, have some questions, or just want to say hi? We're available for a live chat 7 days a week from 5 AM EST - 9 PM EST.</p>
                    <br/>
                    <p>Not anything urgent? Fire us an email, we usually respond with 24 hours Monday to Friday</p>
                </LegacyCard>
            </Layout.Section>
        </Layout>
        <div className="space-10"></div>
            <Reviews/>
        <div className="space-10"></div>
    </Page>
  );
}
