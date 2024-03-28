import { LegacyCard, Grid, Button, Page } from "@shopify/polaris";
import {
    SettingsMajor
} from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react'
import React, {useState, useEffect, useCallback} from "react";
import { useAuthenticatedFetch, useShopSettings } from "../hooks";
import {SETTINGS_DEFAULTS, useShopState} from "../contexts/ShopContext.jsx";
import {useDispatch, useSelector} from 'react-redux';
import { Redirect, Toast } from '@shopify/app-bridge/actions';
import { Partners, SettingTabs, CustomTitleBar } from "../components";
import ErrorPage from "../components/ErrorPage.jsx";
import ModalChoosePlan from '../components/modal_ChoosePlan';
import { onLCP, onFID, onCLS } from 'web-vitals';
import { traceStat } from "../services/firebase/perf.js";
import ErrorPage from "../components/ErrorPage.jsx"
import {useShopState} from "../contexts/ShopContext.jsx";
import FrontWidgetSection from "../components/FrontWidgetSection.jsx"

export default function Settings() {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const { fetchShopSettings, updateShopSettings } = useShopSettings();
    const { shopSettings, setShopSettings, updateShopSettingsAttributes } = useShopState();
    const [formData, setFormData] = useState({});
    const app = useAppBridge();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('Loading...')
    const [button, setButton] = useState('Loading...')

    useEffect(()=> {
        onLCP(traceStat, {reportSoftNavs: true});
        onFID(traceStat, {reportSoftNavs: true});
        onCLS(traceStat, {reportSoftNavs: true});
      }, []);
      
    useEffect(() => {
        fetchCurrentShop();
    }, []);

    const fetchCurrentShop = useCallback(async () => {
        let redirect = Redirect.create(app);
        fetchShopSettings({admin: null})
            .then((response) => { return response.json() })
            .then((data) => {
                if (data.redirect_to) {
                    redirect.dispatch(Redirect.Action.APP, data.redirect_to);
                }
                setShopSettings(data.shop_settings);
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
                setError(error);
                console.log("Error > ", error);
            })
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            fetchShopSettings()
              .then((response) => { return response.json() })
              .then((data) => {
                setMessage(data.shop_settings.activated ? 'The store front widget is activated.' : 'The store front widget is deactivated.');
                setButton(data.shop_settings.activated ? 'Deactivate' : 'Activate');
              })
              .catch((error) => {
              console.log('Error fetching Shop data:', error);
            })
          };
      
        fetchData();       
      }, []);

    useEffect(() => {
        fetchCurrentShop();
      }, []);

    const handleFormChange = (value, id) => {
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const toggleActivation = async () => {
        fetch(`/api/v2/merchant/toggle_activation?shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => { return response.json(); })
            .then((data) => {
                if (data.message.indexOf('App activated') > -1) {
                    setMessage('The store front widget is activated.')
                    setButton('Deactivate')
                }
                else if (data.message.indexOf('App deactivated') > -1) {
                    setMessage('The store front widget is deactivated.')
                    setButton('Activate')
                }
            })
            .catch((error) => {
                const toastOptions = {
                    message: 'An error occurred. Please try again later.',
                    duration: 3000,
                    isError: true,
                };
                const toastError = Toast.create(app, toastOptions);
                toastError.dispatch(Toast.Action.SHOW, toastOptions);
                console.log("Error:", error);
            })
    }

    const handleSave = async () => {
        setShopSettings(prev => {
            let data = {
                ...prev, custom_product_page_dom_selector: formData.productDomSelector, custom_product_page_dom_action: formData.productDomAction,
                custom_cart_page_dom_selector: formData.cartDomSelector, custom_cart_page_dom_action: formData.cartDomAction, custom_ajax_dom_selector: formData.ajaxDomSelector,
                custom_ajax_dom_action: formData.ajaxDomAction
            }
            updateShopSettings(data)
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

    if (error) { return < ErrorPage showBranding={true} />; }

    return (
        <>
            <Page>
                <ModalChoosePlan />
                <CustomTitleBar title='Settings' icon={SettingsMajor} buttonText='Save' handleButtonClick={handleSave} />
                <FrontWidgetSection message={message} button={button} toggleActivation={toggleActivation} />
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
                            {shopSettings ? <SettingTabs formData={formData} currentShop={shopSettings} updateShop={updateShopSettingsAttributes} handleFormChange={handleFormChange} /> : 'Loading...'}
                        </LegacyCard>
                    </Grid.Cell>
                </Grid>
                <div className="space-4"></div>
                <Partners />
            </Page>
        </>
    );
}
