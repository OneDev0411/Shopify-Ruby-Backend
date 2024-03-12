import { LegacyCard, Grid, Button, Page } from "@shopify/polaris";
import {
    SettingsMajor
} from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react'
import {useDispatch, useSelector} from 'react-redux';
import React, { useState, useEffect, useCallback } from "react";
import { Redirect, Toast } from '@shopify/app-bridge/actions';
import { Partners, SettingTabs, CustomTitleBar } from "../components";
import { useAuthenticatedFetch } from "../hooks";
import ModalChoosePlan from '../components/modal_ChoosePlan'
import { fetchShopData } from '../services/actions/shop';
import { setIsSubscriptionUnpaid } from '../store/reducers/subscriptionPaidStatusSlice';

export default function Settings() {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [currentShop, setCurrentShop] = useState(null);
    const [formData, setFormData] = useState({});
    const app = useAppBridge();

    const isSubscriptionUnpaid = useSelector(state => state.subscriptionPaidStatus.isSubscriptionUnpaid);
    const reduxDispatch = useDispatch();

    const fetchCurrentShop = useCallback(async () => {
        let redirect = Redirect.create(app);

        fetch(`/api/v2/merchant/shop_settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shop: shopAndHost.shop, admin: null }),
        })
            .then((response) => { return response.json() })
            .then((data) => {
                if (data.redirect_to) {
                    redirect.dispatch(Redirect.Action.APP, data.redirect_to);
                }
                setCurrentShop(data.shop_settings);
                setFormData({
                    productDomSelector: data.shop_settings?.custom_product_page_dom_selector,
                    productDomAction: data.shop_settings?.custom_product_page_dom_action,
                    cartDomSelector: data.shop_settings?.custom_cart_page_dom_selector,
                    cartDomAction: data.shop_settings?.custom_cart_page_dom_action,
                    ajaxDomSelector: data.shop_settings?.custom_ajax_dom_selector,
                    ajaxDomAction: data.shop_settings?.custom_ajax_dom_action,
                })
            })
            .catch((error) => {
                console.log("Error > ", error);
            })
    }, [])

    useEffect(() => {
        fetchCurrentShop();
        // in case of page refresh
        if (isSubscriptionUnpaid === null) {
            fetchShopData(shopAndHost.shop).then((data) => {
                reduxDispatch(setIsSubscriptionUnpaid(data.subscription_not_paid));
            });
        }
    }, [fetchCurrentShop]);

    const handleFormChange = (value, id) => {
        setFormData({
            ...formData,
            [id]: value
        });
    };

    //Called whenever the shop changes in any child component
    function updateShop(updatedValue, ...updatedKey) {
        if(updatedKey.length == 1) {
            setCurrentShop(previousState => {
                return { ...previousState, [updatedKey[0]]: updatedValue };
            });
        }
        else if(updatedKey.length == 2) {
            setCurrentShop(previousState => ({
                ...previousState,
                [updatedKey[0]]: {
                    ...previousState[updatedKey[0]],
                    [updatedKey[1]]: updatedValue 
                }
            }));
        }
        else if(updatedKey.length == 3) {
            setCurrentShop(previousState => ({
                ...previousState,
                [updatedKey[0]]: {
                    ...previousState[updatedKey[0]],
                    [updatedKey[1]]: {
                        ...previousState[updatedKey[0]][updatedKey[1]],
                        [updatedKey[2]]: updatedValue
                    }
                }
            }));
        }
    }

    const toggleActivation = async () => {
        fetch(`/api/v2/merchant/toggle_activation?shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => { return response.json(); })
            .then((data) => {
                const toastOptions = {
                    message: data.message,
                    duration: 3000,
                    isError: false,
                };
                const toastNotice = Toast.create(app, toastOptions);
                toastNotice.dispatch(Toast.Action.SHOW);
                // This caused the user to be logged out of the app
                // window.location.reload();
            })
            .catch((error) => {
                console.log("Error", error);
            })
    }

    const handleSave = async () => {
        setCurrentShop(prev => {
            let data = {
                ...prev, custom_product_page_dom_selector: formData.productDomSelector, custom_product_page_dom_action: formData.productDomAction,
                custom_cart_page_dom_selector: formData.cartDomSelector, custom_cart_page_dom_action: formData.cartDomAction, custom_ajax_dom_selector: formData.ajaxDomSelector,
                custom_ajax_dom_action: formData.ajaxDomAction
            }
            fetch('/api/v2/merchant/update_shop_settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shop_attr: data, shop: shopAndHost.shop, admin: data.admin, json: true }),
            })
                .then((response) => { return response.json(); })
                .then((data) => {
                    const toastOptions = {
                        message: data.message,
                        duration: 3000,
                        isError: false,
                    };
                    const toastNotice = Toast.create(app, toastOptions);
                    toastNotice.dispatch(Toast.Action.SHOW);
                })
                .catch(() => {
                    const toastOptions = {
                        message: "Error saving shop settings",
                        duration: 3000,
                        isError: false,
                    };
                    const toastNotice = Toast.create(app, toastOptions);
                    toastNotice.dispatch(Toast.Action.SHOW);
                })
            return data
        });
    }

    return (
        <>
            <Page>
                { isSubscriptionUnpaid && <ModalChoosePlan /> }
                <CustomTitleBar title='Settings' icon={SettingsMajor} buttonText='Save' handleButtonClick={handleSave} />
                <LegacyCard sectioned>
                    {(currentShop?.activated) ? (
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 10, xl: 4 }}>
                                <p>This app is activated</p>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 2, xl: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <Button onClick={toggleActivation}>Deactivate</Button>
                                </div>
                            </Grid.Cell>
                        </Grid>) : (
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 10, xl: 4 }}>
                                <p>This app is deactivated</p>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 8, lg: 2, xl: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <Button onClick={toggleActivation}>Activate</Button>
                                </div>
                            </Grid.Cell>
                        </Grid>
                    )}
                </LegacyCard>
                <div className="space-4"></div>
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                        <div id="no-bg-LegacyCard">
                            <LegacyCard sectioned style={{ backgroundColor: "transparent" }}>
                                <h2><strong>Default offer placement settings</strong></h2>
                                <br />
                                <p>Only edit these settings if you know HTML.</p>
                            </LegacyCard>
                        </div>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                        <LegacyCard sectioned columnSpan={{ md: 6, lg: 6, xl: 6 }}>
                            {/* Tabs */}
                            {currentShop ? <SettingTabs formData={formData} currentShop={currentShop} updateShop={updateShop} handleFormChange={handleFormChange} /> : 'Loading...'}
                        </LegacyCard>
                    </Grid.Cell>
                </Grid>
                <div className="space-4"></div>
                <Partners />
            </Page>
        </>
    );
}
