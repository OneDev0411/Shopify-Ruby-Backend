import { LegacyCard, Grid, Button, Page } from "@shopify/polaris";
import {
    SettingsMajor
} from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react'
import React, {useState, useEffect, useCallback, useContext} from "react";
import { useAuthenticatedFetch, useShopSettings } from "../hooks";
import {SETTINGS_DEFAULTS, useShopState} from "../contexts/ShopContext.jsx";
import {useDispatch, useSelector} from 'react-redux';
import { Redirect, Toast } from '@shopify/app-bridge/actions';
import { Partners, SettingTabs, CustomTitleBar } from "../components";
import ErrorPage from "../components/ErrorPage.jsx";
import ModalChoosePlan from '../components/modal_ChoosePlan';
import { onLCP, onFID, onCLS } from 'web-vitals';
import { traceStat } from "../services/firebase/perf.js";
import {OFFER_DEFAULTS, OFFER_PLACEHOLDER} from "../shared/constants/EditOfferOptions.js";
import {OfferContext} from "../contexts/OfferContext.jsx";

export default function Settings() {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const { fetchShopSettings, updateShopSettings } = useShopSettings();
    const { shopSettings, setShopSettings, updateShopSettingsAttributes } = useShopState();
    const {offer, setOffer } = useContext(OfferContext);
    const [formData, setFormData] = useState({});
    const app = useAppBridge();
    const [error, setError] = useState(null);

    useEffect(()=> {
        onLCP(traceStat, {reportSoftNavs: true});
        onFID(traceStat, {reportSoftNavs: true});
        onCLS(traceStat, {reportSoftNavs: true});
      }, []);
      
    useEffect(() => {

        fetchCurrentShop();

        return function cleanup() {
            setOffer(OFFER_DEFAULTS);
        };
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


                fetch(`/api/v2/merchant/single_offer?shop=${data.shop_settings.shopify_domain}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(resp => resp.json())
                  .then(response => {
                      let offerData = response;

                      if (offerData.offer) {
                          offerData.offer.css_options = data.shop_settings.css_options
                          offerData.offer.multi_layout = data.shop_settings.multi_layout;
                          setOffer(offerData.offer);
                      } else {
                          offerData.offer = OFFER_PLACEHOLDER;
                          offerData.offer.css_options = data.shop_settings.css_options
                          setOffer(OFFER_PLACEHOLDER)
                      }
                  })
            })
            .catch((error) => {
                setError(error);
                console.log("Error > ", error);
            })
    }, [])

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

            data.css_options = offer.css_options
            data.multi_layout = offer.multi_layout;
            data.update_all_offers = false;

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
                <LegacyCard sectioned>
                    {(shopSettings?.activated) ? (
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
                <div id="no-bg-LegacyCard">
                    <LegacyCard sectioned style={{ backgroundColor: "transparent" }}>
                        <h2><strong>Default offer placement settings</strong></h2>
                        <br />
                        <p>Only edit these settings if you know HTML.</p>
                    </LegacyCard>
                </div>
                <div className="space-4"></div>
                <LegacyCard sectioned columnSpan={{ md: 6, lg: 6, xl: 6 }}>
                    {/* Tabs */}
                    {shopSettings ? <SettingTabs formData={formData} currentShop={shopSettings} updateShop={updateShopSettingsAttributes} handleFormChange={handleFormChange} /> : 'Loading...'}
                </LegacyCard>
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>

                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>

                    </Grid.Cell>
                </Grid>
                <div className="space-4"></div>
                <Partners />
            </Page>
        </>
    );
}
