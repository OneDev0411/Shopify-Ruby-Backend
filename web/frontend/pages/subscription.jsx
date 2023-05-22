import {Card, Page, Layout, Image, Stack} from "@shopify/polaris";
import { useAppBridge } from '@shopify/app-bridge-react'
import {Redirect, Toast} from '@shopify/app-bridge/actions';
import { TitleBar } from "@shopify/app-bridge-react";
import {billingImg} from "../assets";
import { Reviews } from "../components";
import "../components/stylesheets/mainstyle.css";
import React from 'react';
import { useEffect, useState } from "react";
import { updateSubscription, isSubscriptionActive } from "../../../utils/services/actions/subscription";
import { getShop } from "../../../utils/services/actions/shop";

export default function Subscription() {
    const [currentShop, setCurrentShop] = useState(null);
    const [planName, setPlanName] = useState();
    const app = useAppBridge();

    async function handlePlanChange (internal_name) {
        let redirect = Redirect.create(app);

        const response = await updateSubscription(internal_name, currentShop.shopify_domain, currentShop.id);
        if (response.payment == 'no') {
            const toastOptions = {
                message: 'On '+ response.plan_name+' Plan now',
                duration: 3000,
                isError: false,
            };
            const toastNotice = Toast.create(app, toastOptions);
            toastNotice.dispatch(Toast.Action.SHOW);
            redirect.dispatch(Redirect.Action.APP, `/`);
        } else {
            redirect.dispatch(Redirect.Action.REMOTE, response.url);
        }
    }

    useEffect(async () => {
        const shopResponse = await getShop('icu-dev-store.myshopify.com'); 
        setCurrentShop(shopResponse.shop);
        setPlanName(shopResponse.plan)
      }, []);
    
  return (
    <Page>
        {/* No titlebar */}
        <TitleBar></TitleBar>
        <div className="auto-height">
            <Layout>
                <Layout.Section>
                    Choose a Plan
                </Layout.Section>
                <Layout.Section>
                    <Card title="Paid"
                        primaryFooterAction={(planName==='flex' && isSubscriptionActive(currentShop?.subscription)) ? null : {content: 'Upgrade', onClick: () => handlePlanChange('plan_based_billing')}}
                        sectioned
                    >
                        <Stack>
                            <Stack.Item>
                                {(planName==='flex' && isSubscriptionActive(currentShop?.subscription)) ? (
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
                            </Stack.Item>
                            <Stack.Item>
                                <Image
                                    source={billingImg}
                                    alt="upgrade subscription"
                                    width={200}
                                />
                            </Stack.Item>
                        </Stack>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title="Free" sectioned primaryFooterAction={(planName==='free' && isSubscriptionActive(currentShop?.subscription)) ? null : {content: 'Downgrade', onClick: () => handlePlanChange('free_plan'), id: 'btnf'}}>
                        {(planName==='free' && isSubscriptionActive(currentShop?.subscription)) ? (
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
                    </Card>
                </Layout.Section>
            </Layout>
        </div>
            
        <div className="space-10"></div>
        <Layout>
            <Layout.Section>
                <Card sectioned>
                    <p>Need help, have some questions, or jus want to say hi? We're available for a live chat 7 days a week from 5 AM EST - 9 PM EST.</p>
                    <br/>
                    <p>Not anything urgent? Fire us an email, we usually respond with 24 hours Monday to Friday</p>
                </Card>
            </Layout.Section>
        </Layout>
        <div className="space-10"></div>
            <Reviews/>
        <div className="space-10"></div>
    </Page>
  );
}
