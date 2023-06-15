import { LegacyCard, Grid, Button, Page } from "@shopify/polaris";
import {
    SettingsMajor
} from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react'
import { useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from "react";
import { Redirect, Toast } from '@shopify/app-bridge/actions';
import { Partners, SettingTabs, GenericTitleBar } from "../components";

export default function Settings() {
    const shop = useSelector(state => state.shopAndHost.shop);
    const [currentShop, setCurrentShop] = useState(null);
    const [formData, setFormData] = useState({});
    const app = useAppBridge();

    const fetchCurrentShop = useCallback(async () => {
        let redirect = Redirect.create(app);

        fetch(`/api/merchant/shop_settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shopify_domain: shop, admin: null }),
        })
            .then((response) => { return response.json() })
            .then((data) => {
                if (data.redirect_to) {
                    redirect.dispatch(Redirect.Action.APP, data.redirect_to);
                }
                setCurrentShop(data.shop_settings);
                setFormData({
                    productDomSelector: data.shop_settings?.custom_product_page_dom_selector || "[class*='description']",
                    productDomAction: data.shop_settings?.custom_product_page_dom_action || 'prepend',
                    cartDomSelector: data.shop_settings?.custom_cart_page_dom_selector || "form[action^='/cart']",
                    cartDomAction: data.shop_settings?.custom_cart_page_dom_action || 'prepend',
                    ajaxDomSelector: data.shop_settings?.custom_ajax_dom_selector || ".ajaxcart__row:first",
                    ajaxDomAction: data.shop_settings?.custom_ajax_dom_action || 'prepend',
                })
            })
            .catch((error) => {
                console.log("Error > ", error);
            })
    }, [])

    useEffect(async () => {
        await fetchCurrentShop()
    }, [fetchCurrentShop]);

    const handleFormChange = (value, id) => {
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const toggleActivation = async () => {
        fetch(`/api/merchant/toggle_activation?shopify_domain=${shop}`, {
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
                window.location.reload();
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
            fetch('/api/merchant/update_shop_settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shop: data, shopify_domain: shop, admin: data.admin, json: true }),
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
                .catch((error) => {
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
                <GenericTitleBar title='Settings' image={SettingsMajor} buttonText='Save' handleButtonClick={handleSave} />
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
                            {currentShop ? <SettingTabs formData={formData} handleFormChange={handleFormChange} /> : 'Loading...'}
                        </LegacyCard>
                    </Grid.Cell>
                </Grid>
                <div className="space-4"></div>
                <Partners />
            </Page>
        </>
    );
}
