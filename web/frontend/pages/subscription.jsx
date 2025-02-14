import {LegacyCard, Page, Layout, Image, LegacyStack, Banner, Spinner} from "@shopify/polaris";
import {useAppBridge} from '@shopify/app-bridge-react'
import {Redirect, Toast} from '@shopify/app-bridge/actions';
import {billingImg} from "../assets";
import {
  BillingStatementDollarMajor
} from '@shopify/polaris-icons';
import {Reviews, CustomTitleBar} from "../components";
import "../components/stylesheets/mainstyle.css";
import React from 'react';
import {useSelector} from 'react-redux';
import {useEffect, useState, useCallback} from "react";
import {useAuthenticatedFetch} from "../hooks";
import {isSubscriptionActive} from "../services/actions/subscription";
import ErrorPage from "../components/ErrorPage.jsx"
import {useShopState} from "../contexts/ShopContext.jsx";
import {onLCP, onFID, onCLS} from 'web-vitals';
import {traceStat} from "../services/firebase/perf.js";
import {LoadingSpinner} from "../components/atoms/index.js";

export default function Subscription() {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const {
    planName,
    setPlanName,
    trialDays,
    setTrialDays,
    isSubscriptionUnpaid,
    setIsSubscriptionUnpaid
  } = useShopState()
  const [activeOffersCount, setActiveOffersCount] = useState();
  const [unpublishedOfferIds, setUnpublishedOfferIds] = useState();
  const app = useAppBridge();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState({})

  useEffect(() => {
    onLCP(traceStat, {reportSoftNavs: true});
    onFID(traceStat, {reportSoftNavs: true});
    onCLS(traceStat, {reportSoftNavs: true});
  }, []);

  async function handlePlanChange(internal_name) {
    let redirect = Redirect.create(app);

    fetch('/api/v2/merchant/subscription', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({subscription: {plan_internal_name: internal_name}, shop: shopAndHost.shop, plan_key: currentPlan.key}),
    })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
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
            redirect.dispatch(Redirect.Action.REMOTE, data.url + '/?shop=' + shopAndHost.shop);
          }
        })
        .catch((error) => {
          const toastOptions = {
            message: 'An error occurred. Please try again later.',
            duration: 3000,
            isError: true,
          };
          const toastError = Toast.create(app, toastOptions);
          toastError.dispatch(Toast.Action.SHOW);
          console.log("Error:", error);
        })
  }

  const fetchSubscription = useCallback(() => {
    fetch(`/api/v2/merchant/current_subscription?shop=${shopAndHost.shop}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setCurrentSubscription(data.subscription);
          setPlanName(data.plan);
          setTrialDays(data.days_remaining_in_trial);
          setActiveOffersCount(data.active_offers_count);
          setUnpublishedOfferIds(data.unpublished_offer_ids)
          setIsSubscriptionUnpaid(data.subscription_not_paid)
          fetchPlanData()
        })
        .catch((error) => {
          setError(error);
          console.log("error", error);
        })
  }, []);

  const fetchPlanData = useCallback(() => {
    fetch(`/api/v2/merchant/subscription/load_plans?shop=${shopAndHost.shop}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.plan_data)
          setCurrentPlan(data.plan_data);
          setIsLoading(false)
        })
        .catch((error) => {
          setError(error);
          console.log("error", error);
        })
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  if (error) {
    return < ErrorPage showBranding={true}/>;
  }

  return (
      <Page>
        <CustomTitleBar title='Billing' icon={BillingStatementDollarMajor}/>
        {isLoading ? (
            <LoadingSpinner/>
        ) : (
            <>
              <div className="auto-height paid-subscription">
                <Layout>
                  <Layout.Section>
                    {(isSubscriptionActive(currentSubscription) && planName !== 'free' && trialDays > 0) ? (
                        <Banner icon='none' status="info">
                          <p>{trialDays} days remaining for the trial period</p>
                        </Banner>) : null
                    }
                    {!isSubscriptionActive(currentSubscription) ? (
                        <Banner icon='none' status="info">
                          <p>Your Subscription Is Not Active: please confirm it on this page</p>
                        </Banner>) : null
                    }
                    {(planName === 'trial' && (unpublishedOfferIds?.lenght > 0 || activeOffersCount)) ? (
                        <Banner icon='none' status="info">
                          <p>If you choose free plan after trial, offers will be unpublished</p>
                        </Banner>) : null
                    }
                  </Layout.Section>
                  <Layout.Section>
                    Choose a Plan
                  </Layout.Section>
                  <Layout.Section>
                    <LegacyCard title="In Cart Upsell & Cross-sell Unlimited - Paid Subscription"
                                primaryFooterAction={(planName === 'flex' && isSubscriptionActive(currentSubscription)) && !isSubscriptionUnpaid ? null : {
                                  content: 'Upgrade',
                                  onClick: () => handlePlanChange('plan_based_billing')
                                }}
                                sectioned
                    >
                      <LegacyStack>
                        <LegacyStack.Item>
                          <div className="recommended-current">
                            {(planName === 'flex' && isSubscriptionActive(currentSubscription)) ? (
                                <p><small>Current Plan</small></p>
                            ) : (
                                <p><small>Recommended</small></p>
                            )}
                          </div>
                          <p className="subscription-subtitle">Upgrade now on our 30-DAY FREE
                            TRIAL!</p>
                          <hr className="my-24"/>
                          <div className="pl-10">
                            <p className="bold space-4">Features</p>
                            <div className="features-grid">
                              <div className="features">
                                <p className="subscription-feature">500 Upsell Offers</p>
                                <p className="subscription-desc">Create as many as you want!</p>
                                <p className="subscription-feature">Unlimited Upsell orders</p>
                                <p className="subscription-desc">No order limit!</p>
                                <p className="subscription-feature">Autopilot AI offers</p>
                                <p className="subscription-desc">Automatic offers feature,
                                  simply let it run</p>
                                <p className="subscription-feature">Autopilot AI offers</p>
                                <p className="subscription-desc">Cart, AJAX cart, & product page
                                  offers</p>
                                <p className="subscription-feature">Offer multiple upsells</p>
                                <p className="subscription-desc">A/B testing</p>
                                <p className="subscription-feature">Learn which offers perform
                                  the best</p>
                                <p className="subscription-desc">Offer discounts with upsell
                                  offers</p>
                                <p className="subscription-feature">Conditional logic</p>
                                <p className="subscription-desc">Show the right offer based on
                                  set conditions</p>
                                <p className="subscription-feature">Custom design &
                                  placement</p>
                                <p className="subscription-desc">Full offer box design
                                  customization </p>
                              </div>
                              <Image
                                  source={billingImg}
                                  alt="upgrade subscription"
                                  width={200}
                              />
                            </div>
                          </div>
                          <hr className="my-24"/>
                          <div className="pl-10">
                            <p className="bold space-4">Pricing</p>
                            <p className="mb-16">Paid app subscription plan pricing is based on your
                              Shopify store’s subscription</p>

                            <div className="pricing-grid">
                              <p><b>Shopify Subscription</b></p>
                              <p><b>In Cart Upsell & Cross Sell Unlimited price</b></p>
                              <p className="mt-14">{currentPlan.key.split(':')[2].replace('_', ' ')}</p>
                              <p className="mt-14">{currentPlan.price}/mo</p>
                            </div>
                          </div>

                        </LegacyStack.Item>
                      </LegacyStack>
                    </LegacyCard>
                  </Layout.Section>
                  <Layout.Section secondary>
                    <LegacyCard title="Free" sectioned
                                primaryFooterAction={(planName === 'free' || planName === "trial" && isSubscriptionActive(currentSubscription))
                                && !isSubscriptionUnpaid ? null : {
                                  content: 'Downgrade',
                                  onClick: () => handlePlanChange('free_plan'),
                                  id: 'btnf'
                                }}>
                      <div className="recommended-current">
                        {(planName === 'free' && isSubscriptionActive(currentSubscription)) ? (
                            <p><small>Current Plan</small></p>
                        ) : (
                            <p><small>Not Recommended</small></p>
                        )}
                      </div>
                      <p className="subscription-subtitle">1 branded upsell offer</p>
                      <div className="mt-28">
                        <p><b>1 upsell offer only</b></p>
                        <p>with “Powered by In Cart Upsell” watermark at bottom of offer block</p>
                      </div>
                    </LegacyCard>
                  </Layout.Section>
                </Layout>
              </div>

              <div className="space-10"></div>
              <Layout>
                <Layout.Section>
                  <LegacyCard sectioned>
                    <p>Need help, have some questions, or just want to say hi? We're available for a live
                      chat 7 days a week from 5 AM EST - 9 PM EST.</p>
                    <br/>
                    <p>Not anything urgent? Fire us an email, we usually respond with 24 hours Monday to
                      Friday</p>
                  </LegacyCard>
                </Layout.Section>
              </Layout>
              <div className="space-10"></div>
              <Reviews/>
              <div className="space-10"></div>
            </>
        )}
      </Page>
  )
      ;
}
