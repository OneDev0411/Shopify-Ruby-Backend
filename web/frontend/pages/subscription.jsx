import {Card, Page, Layout, Image, Stack} from "@shopify/polaris";
import { useAppBridge } from '@shopify/app-bridge-react'
import {Redirect, Toast} from '@shopify/app-bridge/actions';
import { TitleBar } from "@shopify/app-bridge-react";
import {billingImg} from "../assets";
import { Reviews } from "../components";
import "../components/stylesheets/mainstyle.css";
import React from 'react';
import { useEffect, useState } from "react";
import { updateSubscription } from "../../../utils/services/actions/subscription";
import axios from 'axios';

export default function Subscription() {
    const [currentShop, setCurrentShop] = useState(null);
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
            redirect.dispatch(Redirect.Action.APP, `/dashboard`);
        } else {
            redirect.dispatch(Redirect.Action.REMOTE, response.url);
        }
    }

    useEffect(() => {
        axios.get('https://zeryab-icu-local.ngrok.dev/api/merchant/current_shop?shop=icu-dev-store.myshopify.com')
          .then(response => {
            // handle the response from the API
            setCurrentShop(response.data);
          })
          .catch(error => {
            // handle errors
            console.error(error);
          });
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
                        primaryFooterAction={(currentShop?.plan?.internal_name === 'plan_based_billing' && currentShop?.subscription?.status === 'approved') ? null : {content: 'Upgrade', onClick: () => handlePlanChange('plan_based_billing')}}
                        sectioned
                    >
                        <Stack>
                            <Stack.Item>
                                {(currentShop?.plan?.internal_name === 'plan_based_billing' && currentShop?.subscription?.status === 'approved') ? (
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
                    <Card title="Free" sectioned primaryFooterAction={(currentShop?.plan?.internal_name === 'free_plan' && currentShop?.subscription?.status === 'approved') ? null : {content: 'Downgrade', onClick: () => handlePlanChange('free_plan'), id: 'btnf'}}>
                        {(currentShop?.plan?.internal_name === 'free_plan' && currentShop?.subscription?.status === 'approved') ? (
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
