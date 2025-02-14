import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Link, useLocation, useNavigate} from 'react-router-dom';

import {Banner, Icon, Layout, Page, Spinner, Tabs} from '@shopify/polaris';
import {DesktopMajor, MobileMajor} from '@shopify/polaris-icons';
import {Redirect} from '@shopify/app-bridge/actions';
import {useAuthenticatedFetch} from "../hooks";
import {FirstTab, FourthTab, SecondTab, ThirdTab} from "../components";
import {OfferPreview} from "../components/OfferPreview";
import "../components/stylesheets/mainstyle.css";
import {EditOfferTabs, OFFER_DEFAULTS} from '../shared/constants/EditOfferOptions';
import {OfferContext} from "../contexts/OfferContext.jsx";
import {useOffer} from "../hooks/useOffer.js";
import {useAppBridge} from '@shopify/app-bridge-react';
import {Toast} from '@shopify/app-bridge/actions';
import ErrorPage from "../components/ErrorPage.jsx"
import {useShopSettings} from "../hooks/useShopSettings.js";
import {useShopState} from "../contexts/ShopContext.jsx";
import { onLCP, onFID, onCLS } from 'web-vitals';
import { traceStat } from "../services/firebase/perf.js";
import UpgradeSubscriptionModal from "../components/UpgradeSubscriptionModal.jsx";
import AddOfferableModal from "../components/AddOfferableModal.jsx";

export default function EditPage() {
    const { offer, setOffer } = useContext(OfferContext);
    const { shopSettings, setShopSettings, themeAppExtension, setThemeAppExtension } = useShopState();
    const { fetchOffer, saveOffer, createOffer } = useOffer();
    const { fetchShopSettings, updateShopSettings } = useShopSettings();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const app = useAppBridge();
    const navigateTo = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);

    const [enablePublish, setEnablePublish] = useState(false)

    // Content section tab data
    const [selected, setSelected] = useState(0);
    const [checkKeysValidity, setCheckKeysValidity] = useState({});
    const [initialVariants, setInitialVariants] = useState({});
    const [autopilotCheck, setAutopilotCheck] = useState({
        isPending: "Launch Autopilot",
    });
    const [initialOfferableProductDetails, setInitialOfferableProductDetails] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    const [updatePreviousAppOffer, setUpdatePreviousAppOffer] = useState(false);
    const [openOffersModal, setOpenOffersModal] = useState(false);
    const [openAddOfferableModal, setOpenAddOfferableModal] = useState(false);

    const offerID = location?.state?.offerID;

    useEffect(()=> {
        onLCP(traceStat, {reportSoftNavs: true});
        onFID(traceStat, {reportSoftNavs: true});
        onCLS(traceStat, {reportSoftNavs: true});
      }, []);

    //Call on initial render
    useEffect(() => {
        let redirect = Redirect.create(app);
        if (location?.state?.offerID == null) {
            // fetching shop settings
            fetchShopSettings({admin: null})
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    updateSettingsOrRedirect(data)

                    const newOffer = {...offer};
                    newOffer.advanced_placement_setting = {
                      custom_product_page_dom_selector: data.shop_settings.custom_product_page_dom_selector,
                      custom_product_page_dom_action: data.shop_settings.custom_product_page_dom_action,
                      custom_cart_page_dom_selector: data.shop_settings.custom_cart_page_dom_selector,
                      custom_cart_page_dom_action: data.shop_settings.custom_cart_page_dom_action,
                      custom_ajax_dom_selector: data.shop_settings.custom_ajax_dom_selector,
                      custom_ajax_dom_action: data.shop_settings.custom_ajax_dom_action,
                    };

                    newOffer.css_options = data.shop_settings.css_options

                    if (data.shop_settings.multi_layout) {
                        newOffer.multi_layout = data.shop_settings.multi_layout
                    }
                    setOffer(newOffer);
                })
                .catch((error) => {
                    setError(error);
                    console.log("Error > ", error);
                })

        } else {
            setIsLoading(true);
            fetchOffer(offerID, shopAndHost.shop).then((response) => {
                if (response.status === 200) {
                    return response.json()
                }
                navigateTo('/offer');
            }).then((data) => {
                setInitialVariants({...data.included_variants});
                if (data.offerable_product_details.length > 0) {
                    updateCheckKeysValidity('text', data.text_a.replace("{{ product_title }}", data.offerable_product_details[0]?.title));
                }
                updateCheckKeysValidity('cta', data.cta_a);
                for (var i = 0; i < data.offerable_product_details.length; i++) {
                    data.offerable_product_details[i].preview_mode = true;
                }
                setOffer({...data});
                setInitialOfferableProductDetails(data.offerable_product_details);
                setIsLoading(false);

                fetchShopSettings({admin: null})
                  .then((response) => {
                      return response.json()
                  })
                  .then((data) => {
                      updateSettingsOrRedirect(data)
                      setUpdatePreviousAppOffer(!updatePreviousAppOffer);
                  })
                  .catch((error) => {
                    setError(error);
                    console.log("Error > ", error);
                  })
            })
            .catch((error) => {
                setError(error);
                setIsLoading(false);
                console.log("Error > ", error);
            })
        }
        return function cleanup() {
            setOffer(OFFER_DEFAULTS);
        };
    },[]);


    function updateSettingsOrRedirect(data) {
        if (data.redirect_to) {
            redirect.dispatch(Redirect.Action.APP, data.redirect_to);
        } else {
            if (Object.keys(data.shop_settings.css_options.main).length === 0) {
                data.shop_settings.css_options.main.color = "#2B3D51";
                data.shop_settings.css_options.main.backgroundColor = "#AAAAAA";
                data.shop_settings.css_options.button.color = "#FFFFFF";
                data.shop_settings.css_options.button.backgroundColor = "#2B3D51";
                data.shop_settings.css_options.widows = '100%';
            }
        }

        setShopSettings(data.shop_settings);
        setThemeAppExtension(data.theme_app_extension)
    }

    // TODO: Relocate to offer context
    //Called whenever the checkKeysValidity changes in any child component
    function updateCheckKeysValidity(updatedKey, updatedValue) {
        setCheckKeysValidity(previousState => {
            return {...previousState, [updatedKey]: updatedValue};
        });
    }

    //Called to update the initial variants of the offer
    function updateInitialVariants(value) {
        setInitialVariants({...value});
    }

    const save = async (status) =>  {
        if (offer.title === "") {
            const toastNotice = Toast.create(app, {
                message: 'Offer requires a title',
                duration: 3000,
                isError: true,
            });

            toastNotice.dispatch(Toast.Action.SHOW);
            return
        }

        if (offer.offerable_product_details.length < 1) {
            const toastNotice = Toast.create(app, {
                message: 'Offer requires a valid item',
                duration: 3000,
                isError: true,
            });

            toastNotice.dispatch(Toast.Action.SHOW);
            return
        }

        let shop_uses_ajax_cart;

        if(offer.in_product_page && offer.in_cart_page) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }
        else if (offer.in_ajax_cart && offer.in_cart_page) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }
        else if (offer.in_cart_page) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }
        else if (offer.in_product_page) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }
        else if (offer.in_ajax_cart) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }

        setIsLoading(true);
        setShopSettings(prev => {
            let data = {
                ...prev, uses_ajax_cart: shop_uses_ajax_cart
            }
            updateShopSettings(data)
                .then((response) => { return response.json(); })
                .then((data) => {
                    console.log('updated shop settings', data)
                })
                .catch((error) => {
                    setError(error);
                    console.log('an error during api call', error)
                })
            return data
        });

        if (location.state != null && location.state?.offerID == null) {
            try {
                let responseData = await createOffer(offer, shopSettings, status)
                location.state.offerID = responseData.offer.id
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                const toastOptions = {
                    message: 'An error occurred. Please try again later.',
                    duration: 3000,
                    isError: true,
                  };
                  const toastError = Toast.create(app, toastOptions);
                  toastError.dispatch(Toast.Action.SHOW);
                console.log('Error:', error);
            }
        } else {
            try {
                await saveOffer(offer, location, shopSettings, status);
                setIsLoading(false);
            } catch (error) {
                console.log('Error:', error);
                setIsLoading(false);
                const toastOptions = {
                    message: 'An error occurred. Please try again later.',
                    duration: 3000,
                    isError: true,
                  };
                  const toastError = Toast.create(app, toastOptions);
                  toastError.dispatch(Toast.Action.SHOW);
            }
        }
        navigateTo('/offer');
    }

    function saveDraft() {
        save(false);
    }

    // Preview section tab data
    const [selectedPre, setSelectedPre] = useState(0);
    const handlePreTabChange = useCallback((selectedPreTabIndex) => {
        setSelectedPre(selectedPreTabIndex);
        if (selectedPreTabIndex == 0) {
            setShopSettings(previousState => {
                return {...previousState, selectedView: 'desktop'};
            });
        } else {
            setShopSettings(previousState => {
                return {...previousState, selectedView: 'mobile'};
            });
        }
    }, []);

    const tabsPre = [
        {
            id: 'desktop',
            content: (
                <div className='flex-tab'>
                    <Icon source={DesktopMajor}/>
                    <p>Desktop</p>
                </div>
            ),
            panelID: 'desktop',
        },
        {
            id: 'mobile',
            content: (
                <div className='flex-tab'>
                    <Icon source={MobileMajor}/>
                    <p>Mobile</p>
                </div>
            ),
            panelID: 'mobile',
        }
    ];

    function publishOffer() {
        if (enablePublish) {
            setOpenAddOfferableModal(true);
        } else if (shopSettings?.offers_limit_reached && offer.publish_status !== 'published') {
            setOpenOffersModal(true);
        } else {
            save(true);
        }
    };

    const changeTab = () => {
        setSelected(selected + 1)
    }

    const enableOrDisablePublish = (enable) => {
        setEnablePublish(enable);
    };

    if (error) { return < ErrorPage/>; }

    return (
        <div className="edit-offer" style={{
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
        }}>
            {isLoading ? (
                <Spinner size="large" color="teal"/>
            ) : (
                <Page
                    backAction={{content: 'Offers', url: '/offer'}}
                    title="Create new offer"
                    primaryAction={{content: 'Publish', onClick: publishOffer}}
                    secondaryActions={[{content: 'Save Draft', disabled: false, onAction: () => saveDraft()}]}
                    style={{overflow: 'hidden'}}
                >
                    <Layout>
                        <Layout.Section>
                            <div className="offer-tabs-no-padding">
                                <Tabs
                                    tabs={EditOfferTabs}
                                    selected={selected}
                                    onSelect={setSelected}
                                    disclosureText="More views"
                                    fitted
                                >
                                    { shopSettings?.offers_limit_reached && (
                                      <Banner status="warning">
                                          <p>You are currently at the limit for published offers. <Link
                                            to="/subscription">Click here</Link> to upgrade your plan and get access to unlimited offers and features!</p>
                                      </Banner>
                                    )}
                                    <div className='space-4'></div>
                                    
                                    {selected == 0 ?
                                        // page was imported from components folder
                                        <FirstTab updateCheckKeysValidity={updateCheckKeysValidity}
                                                  handleTabChange={changeTab} initialVariants={initialVariants}
                                                  updateInitialVariants={updateInitialVariants}
                                                  autopilotCheck={autopilotCheck} setAutopilotCheck={setAutopilotCheck}
                                                  initialOfferableProductDetails={initialOfferableProductDetails}
                                                  enableOrDisablePublish={enableOrDisablePublish}/>
                                        : ""}
                                    {selected == 1 ?
                                        // page was imported from components folder
                                        <SecondTab autopilotCheck={autopilotCheck} handleTabChange={changeTab}
                                                   enableOrDisablePublish={enableOrDisablePublish}
                                        />
                                        : ""}
                                    {selected == 2 ?
                                        // page was imported from components folder
                                        <ThirdTab saveDraft={saveDraft} publishOffer={publishOffer}
                                                  autopilotCheck={autopilotCheck} enablePublish={enablePublish}
                                                  handleTabChange={changeTab}/>
                                        : ""}
                                    {selected == 3 ?
                                        // page was imported from components folder
                                        <FourthTab saveDraft={saveDraft} publishOffer={publishOffer}
                                                   enablePublish={enablePublish} />
                                        : ""}
                                </Tabs>
                            </div>
                        </Layout.Section>
                        <Layout.Section secondary>
                            <div className="offer-tabs-no-padding">
                                <Tabs
                                    tabs={tabsPre}
                                    selected={selectedPre}
                                    onSelect={handlePreTabChange}
                                    disclosureText="More views"
                                    fitted
                                >
                                    <div style={{paddingTop: '40px', marginTop: '-40px'}}></div>
                                    {selectedPre == 0 ?
                                        <OfferPreview checkKeysValidity={checkKeysValidity}
                                                      updateCheckKeysValidity={updateCheckKeysValidity}
                                                      updatePreviousAppOffer={updatePreviousAppOffer}/>
                                        :
                                        <OfferPreview checkKeysValidity={checkKeysValidity}
                                                      updateCheckKeysValidity={updateCheckKeysValidity}
                                                      updatePreviousAppOffer={updatePreviousAppOffer}/>}
                                </Tabs>
                            </div>
                        </Layout.Section>
                    </Layout>
                </Page>
            )}
            <AddOfferableModal openModal={openAddOfferableModal} setOpenModal={setOpenAddOfferableModal} />
            <UpgradeSubscriptionModal openModal={openOffersModal} setOpenModal={setOpenOffersModal} />
        </div>
    );
}

