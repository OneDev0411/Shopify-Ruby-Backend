import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from 'react-router-dom';

import {Icon, Layout, Page, Spinner, Tabs} from '@shopify/polaris';
import {DesktopMajor, MobileMajor} from '@shopify/polaris-icons';
import {TitleBar, useAppBridge} from "@shopify/app-bridge-react";
import {Redirect} from '@shopify/app-bridge/actions';

import {useAuthenticatedFetch} from "../hooks";
import {FirstTab, FourthTab, SecondTab, ThirdTab} from "../components";
import {OfferPreview} from "../components/OfferPreview";
import "../components/stylesheets/mainstyle.css";

export default function EditPage() {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const app = useAppBridge();
    const navigateTo = useNavigate();
    const location = useLocation();

    const [enablePublish, setEnablePublish] = useState(false)

    // Content section tab data
    const [selected, setSelected] = useState(0);
    const [checkKeysValidity, setCheckKeysValidity] = useState({});
    const [initialVariants, setInitialVariants] = useState({});
    const [autopilotCheck, setAutopilotCheck] = useState({
        isPending: "Launch Autopilot",
    });
    const [openAutopilotSection, setOpenAutopilotSection] = useState(false);
    const [initialOfferableProductDetails, setInitialOfferableProductDetails] = useState({});

    const [offer, setOffer] = useState({
<<<<<<< HEAD
    offerId: undefined,
    ajax_cart: '',
    calculated_image_url: 'placebear.com/125/125',
    cart_page: '',
    checkout_page: '',
    checkout_after_accepted: false,
    css: '',
    cta_a: 'Add To Cart',
    cta_b: '',
    custom_field_name: '',
    custom_field_placeholder: '',
    custom_field_required: false,
    discount_code: '',
    discount_target_type: 'none',
    hide_variants_wrapper: '',
    id: null,
    link_to_product: true,
    multi_layout: 'compact',
    must_accept: false,
    offerable: {},
    offerable_type: 'multi',
    offerable_product_shopify_ids: [],
    offerable_product_details: [],
    included_variants: {},
    page_settings: '',
    product_image_size: 'medium',
    publish_status: 'draft',
    products_to_remove: [],
    powered_by_text_color: null,
    powered_by_link_color: null,
    remove_if_no_longer_valid: false,
    rules_json: [],
    ruleset_type: 'and',
    redirect_to_product: null,
    shop: {},
    show_product_image: true,
    show_variant_price: false,
    show_product_price: true,
    show_product_title: false,
    show_spinner: null,
    show_nothanks: false,
    show_quantity_selector: true,
    show_custom_field: false,
    show_compare_at_price: true,
    uses_ab_test: null,
    stop_showing_after_accepted: false,
    recharge_subscription_id: null,
    interval_unit: null,
    interval_frequency: null,
    text_a: 'Would you like to add a {{ product_title }}?',
    text_b: '',
    theme: 'custom',
    title: '',
    in_cart_page: true,
    in_ajax_cart: true,
    in_product_page: true,
    show_powered_by: false,
    custom_field_2_name: '',
    custom_field_2_placeholder: '',
    custom_field_2_required: '',
    custom_field_3_name: '',
    custom_field_3_placeholder: '',
    custom_field_3_required: '',
    css_options: {
        main: {
            color: "#2B3D51",
            backgroundColor: "#ECF0F1"
        },
        text: {},
        button: {
            color: "#FFFFFF", 
            backgroundColor: "#2B3D51"
        },
    },
    custom_css: ''
=======
        offerId: undefined,
        ajax_cart: '',
        calculated_image_url: 'placebear.com/125/125',
        cart_page: '',
        checkout_page: '',
        checkout_after_accepted: false,
        css: '',
        cta_a: 'Add To Cart',
        cta_b: '',
        custom_field_name: '',
        custom_field_placeholder: '',
        custom_field_required: false,
        discount_code: '',
        discount_target_type: 'none',
        hide_variants_wrapper: '',
        id: null,
        link_to_product: true,
        multi_layout: 'compact',
        must_accept: false,
        offerable: {},
        offerable_type: 'multi',
        offerable_product_shopify_ids: [],
        offerable_product_details: [],
        included_variants: {},
        page_settings: '',
        product_image_size: 'medium',
        publish_status: 'draft',
        products_to_remove: [],
        powered_by_text_color: null,
        powered_by_link_color: null,
        remove_if_no_longer_valid: false,
        rules_json: [],
        ruleset_type: 'and',
        redirect_to_product: null,
        shop: {},
        show_product_image: true,
        show_variant_price: false,
        show_product_price: true,
        show_product_title: false,
        show_spinner: null,
        show_nothanks: false,
        show_quantity_selector: true,
        show_custom_field: false,
        show_compare_at_price: true,
        uses_ab_test: null,
        stop_showing_after_accepted: false,
        recharge_subscription_id: null,
        interval_unit: null,
        interval_frequency: null,
        text_a: 'Would you like to add a {{ product_title }}?',
        text_b: '',
        theme: 'custom',
        title: '',
        in_cart_page: true,
        in_ajax_cart: true,
        in_product_page: true,
        show_powered_by: false,
        custom_field_2_name: '',
        custom_field_2_placeholder: '',
        custom_field_2_required: '',
        custom_field_3_name: '',
        custom_field_3_placeholder: '',
        custom_field_3_required: '',
>>>>>>> bb1a2622cfca329e950fd9de308d85d6d153a224
    });

    const [offerSettings, setOfferSettings] = useState({
        customTheme: "",
        css_options: {
            main: {},
            text: {},
            button: {},
        },
    });

    const [shop, setShop] = useState({
        shop_id: undefined,
        offer_css: '',
        css_options: {
            main: {},
            text: {},
            button: {},
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [shopifyThemeName, setShopifyThemeName] = useState(null);

    const offerID = location?.state?.offerID;
    const fetch = useAuthenticatedFetch(shopAndHost.host);

    //Call on initial render
    useEffect(() => {
        let redirect = Redirect.create(app);
        if (location?.state?.offerID == null) {
            setIsLoading(true);
            fetch(`/api/merchant/offer_settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({offer: {include_sample_products: 0}, shop: shopAndHost.shop}),
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    setOfferSettings(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log("Error > ", error);
                })
            setIsLoading(true);
            fetch(`/api/merchant/shop_settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({shop_attr: {admin: null}, shop: shopAndHost.shop}),
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    if (data.redirect_to) {
                        redirect.dispatch(Redirect.Action.APP, data.redirect_to);
                    } else {
                        if (Object.keys(data.shop_settings.css_options.main).length == 0) {
                            data.shop_settings.css_options.main.color = "#2B3D51";
                            data.shop_settings.css_options.main.backgroundColor = "#AAAAAA";
                            data.shop_settings.css_options.button.color = "#FFFFFF";
                            data.shop_settings.css_options.button.backgroundColor = "#2B3D51";
                            data.shop_settings.css_options.widows = '100%';
                        }
                    }
                    setShop(data.shop_settings);
                })
                .catch((error) => {
                    console.log("Error > ", error);
                })
        } else {
            setIsLoading(true);
            fetch(`/api/merchant/load_offer_details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({offer: {offer_id: offerID}, shop: shopAndHost.shop}),
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
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
                })
                .catch((error) => {
                    console.log("Error > ", error);
                })
            setIsLoading(true);
            fetch(`/api/merchant/offer_settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({offer: {include_sample_products: 0}, shop: shopAndHost.shop}),
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    setOfferSettings(data);
                })
                .catch((error) => {
                    console.log("Error > ", error);
                })
            setIsLoading(true);
            fetch(`/api/merchant/shop_settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({shop_attr: {admin: null}, shop: shopAndHost.shop}),
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    if (data.redirect_to) {
                        redirect.dispatch(Redirect.Action.APP, data.redirect_to);
                    } else {
                        if (Object.keys(data.shop_settings.css_options.main).length == 0) {
                            data.shop_settings.css_options.main.color = "#2B3D51";
                            data.shop_settings.css_options.main.backgroundColor = "#AAAAAA";
                            data.shop_settings.css_options.button.color = "#FFFFFF";
                            data.shop_settings.css_options.button.backgroundColor = "#2B3D51";
                            data.shop_settings.css_options.widows = '100%';
                        }
                    }
                    setShop(data.shop_settings);
                })
                .catch((error) => {
                    console.log("Error > ", error);
                })
        }
        setIsLoading(true);
        fetch(`/api/merchant/autopilot_details?shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setAutopilotCheck(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log("# Error AutopilotDetails > ", JSON.stringify(error));
            })

        fetch(`/api/merchant/active_theme_for_dafault_template?shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                if (data.themeExist) {
                    setShopifyThemeName(data.shopify_theme_name)
                } else {
                    setShopifyThemeName(null);
                }
            })
            .catch((error) => {
                console.log("# Error updateProducts > ", JSON.stringify(error));
            })

    }, [openAutopilotSection]);


    //Called whenever the checkKeysValidity changes in any child component
    function updateCheckKeysValidity(updatedKey, updatedValue) {
        setCheckKeysValidity(previousState => {
            return {...previousState, [updatedKey]: updatedValue};
        });
    }


    //Called whenever the offer changes in any child component
    function updateOffer(updatedKey, updatedValue) {
        setOffer(previousState => {
            return {...previousState, [updatedKey]: updatedValue};
        });
    }

    //Called whenever the offer changes in any child component
    function updateOfferNestedHash(updatedValue, ...updatedKey) {
        if(updatedKey.length == 1) {
            setOffer(previousState => {
                return { ...previousState, [updatedKey[0]]: updatedValue };
            });
        }
        else if(updatedKey.length == 2) {
            setOffer(previousState => ({
                ...previousState,
                [updatedKey[0]]: {
                    ...previousState[updatedKey[0]],
                    [updatedKey[1]]: updatedValue 
                }
            }));
        }
        else if(updatedKey.length == 3) {
            setOffer(previousState => ({
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

    //Called whenever the offer settings for shop changes in any child component
    function updateOfferSettings(updatedShop) {
        setOfferSettings(updatedShop);
    }

    // Called to update the included variants in offer
    function updateIncludedVariants(selectedItem, selectedVariants) {
        const updatedOffer = {...offer};
        if (Array.isArray(selectedItem)) {
            for (var key in selectedVariants) {
                updatedOffer.included_variants[key] = selectedVariants[key];
            }
        } else {
            updatedOffer.included_variants[selectedItem] = selectedVariants;
        }
        setOffer({...updatedOffer});
    }

    // Called to update offerable_product_details and offerable_product_shopify_ids of offer
    function updateProductsOfOffer(data) {
        setOffer(previousState => {
            return {...previousState, offerable_product_details: [...previousState.offerable_product_details, data],};
        });
        setOffer(previousState => {
            return {
                ...previousState,
                offerable_product_shopify_ids: [...previousState.offerable_product_shopify_ids, data.id],
            };
        });
    }

    //Called whenever the shop changes in any child component
    function updateShop(updatedValue, ...updatedKey) {
        if (updatedKey.length == 1) {
            setShop(previousState => {
                return {...previousState, [updatedKey[0]]: updatedValue};
            });
        } else if (updatedKey.length == 2) {
            setShop(previousState => ({
                ...previousState,
                [updatedKey[0]]: {
                    ...previousState[updatedKey[0]],
                    [updatedKey[1]]: updatedValue
                }
            }));
        } else if (updatedKey.length == 3) {
            setShop(previousState => ({
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

    //Called to update the initial variants of the offer
    function updateInitialVariants(value) {
        setInitialVariants({...value});
    }


    //Called to update the openAutopilotSection attribute
    function updateOpenAutopilotSection(value) {
        setOpenAutopilotSection(value);
    }

    const save = async (status) => {
        var ots = {
            active: status,
            checkout_after_accepted: offer.checkout_after_accepted,
            custom_field_name: offer.custom_field_name,
            custom_field_placeholder: offer.custom_field_placeholder,
            custom_field_required: offer.custom_field_required,
            custom_field_2_name: offer.custom_field_2_name,
            custom_field_2_placeholder: offer.custom_field_2_placeholder,
            custom_field_2_required: offer.custom_field_2_required,
            custom_field_3_name: offer.custom_field_3_name,
            custom_field_3_placeholder: offer.custom_field_3_placeholder,
            custom_field_3_required: offer.custom_field_3_required,
            discount_target_type: offer.discount_target_type,
            discount_code: offer.discount_code,
            included_variants: offer.included_variants,
            link_to_product: offer.link_to_product,
            multi_layout: offer.multi_layout,
            must_accept: offer.must_accept,
            offerable_product_shopify_ids: offer.offerable_product_shopify_ids,
            offerable_type: offer.offerable_type,
            autopilot_quantity: offer.autopilot_quantity,
            excluded_tags: offer.excluded_tags,
            offer_css: offer.css,
            offer_cta: offer.cta_a,
            offer_cta_alt: offer.cta_b,
            offer_text: offer.text_a,
            offer_text_alt: offer.text_b,
            product_image_size: offer.product_image_size,
            products_to_remove: offer.products_to_remove,
            publish_status: status ? "published" : "draft",
            remove_if_no_longer_valid: offer.remove_if_no_longer_valid,
            redirect_to_product: offer.redirect_to_product,
            rules_json: offer.rules_json,
            ruleset_type: offer.ruleset_type,
            show_variant_price: offer.show_variant_price,
            show_product_image: offer.show_product_image,
            show_product_title: offer.show_product_title,
            show_product_price: offer.show_product_price,
            show_compare_at_price: offer.show_compare_at_price,
            show_nothanks: offer.show_nothanks,
            show_quantity_selector: offer.show_quantity_selector,
            show_custom_field: offer.show_custom_field,
            stop_showing_after_accepted: offer.stop_showing_after_accepted,
            theme: offer.theme,
            title: offer.title,
            in_cart_page: offer.in_cart_page,
            in_ajax_cart: offer.in_ajax_cart,
            in_product_page: offer.in_product_page,
            css_options: offer.css_options,
            custom_css: offer.custom_css
        };
        if (shop.has_recharge && offer.recharge_subscription_id) {
            ots.recharge_subscription_id = offer.recharge_subscription_id;
            ots.interval_unit = offer.interval_unit;
            ots.interval_frequency = offer.interval_frequency;
        }
        setIsLoading(true);
        if (location.state != null && location.state?.offerID == null) {
            try {
                const response = await fetch(`/api/offers/create/${shop?.shop_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({offer: ots})
                });
                const responseData = await response.json();
                setOffer(responseData.offer);
                location.state.offerID = responseData.offer.id;
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            try {
                const response = await fetch(`/api/offers/${offer.id}/update/${shop.shop_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({offer: ots, shop: shopAndHost.shop, host: shopAndHost.host})
                });
                const responseData = await response.json();
                responseData.text = responseData.offer.text_a.replace("{{ product_title }}", responseData.offer.offerable_product_details[0].title)
                responseData.cta = responseData.cta_a;
                for (var i = 0; i < responseData.offer.offerable_product_details.length; i++) {
                    responseData.offer.offerable_product_details[i].preview_mode = true;
                }
                setOffer(responseData.offer);
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetch('/api/merchant/update_shop_settings', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({shop_attr: shop, shop: shopAndHost.shop, admin: shop.admin, json: true}),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setShop(data.shop);
                setIsLoading(false);
            })
            .catch((error) => {
            })
        navigateTo('/offer');
    }

    function saveDraft() {
        save(false);
    }

    const tabs = [
        {
            id: 'content',
            content: "Content",
            panelID: 'content',
        },
        {
            id: 'placement',
            content: 'Placement',
            panelID: 'placement',
        },
        {
            id: 'appearance',
            content: 'Appearance',
            panelID: 'appearance',
        },
        {
            id: 'advanced',
            content: 'Advanced',
            panelID: 'advanced',
        },
    ];

    // Preview section tab data
    const [selectedPre, setSelectedPre] = useState(0);
    const handlePreTabChange = useCallback((selectedPreTabIndex) => {
        setSelectedPre(selectedPreTabIndex);
        if (selectedPreTabIndex == 0) {
            setShop(previousState => {
                return {...previousState, selectedView: 'desktop'};
            });
        } else {
            setShop(previousState => {
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
        save(true);
    };

    const changeTab = () => {
        setSelected(selected + 1)
    }

    const enableOrDisablePublish = (enable) => {
        setEnablePublish(enable);
    };

    return (
        <div className="edit-offer" style={{
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            {isLoading ? (
                <Spinner size="large" color="teal"/>
            ) : (
                <Page
                    backAction={{content: 'Offers', url: '/offer'}}
                    title="Create new offer"
                    primaryAction={{content: 'Publish', disabled: enablePublish, onClick: publishOffer}}
                    secondaryActions={[{content: 'Save Draft', disabled: false, onAction: () => saveDraft()}]}
                    style={{overflow: 'hidden'}}
                >
                    <Layout>
                        <Layout.Section>
                            <div className="offer-tabs-no-padding">
                                <Tabs
                                    tabs={tabs}
                                    selected={selected}
                                    onSelect={setSelected}
                                    disclosureText="More views"
                                    fitted
                                >
                                    <div className='space-4'></div>
                                    
                                    {selected == 0 ?
                                        // page was imported from components folder
                                        <FirstTab offer={offer} shop={shop} offerSettings={offerSettings}
                                                  updateOffer={updateOffer} updateIncludedVariants={updateIncludedVariants}
                                                  updateProductsOfOffer={updateProductsOfOffer}
                                                  updateCheckKeysValidity={updateCheckKeysValidity}
                                                  handleTabChange={changeTab} initialVariants={initialVariants}
                                                  updateInitialVariants={updateInitialVariants}
                                                  autopilotCheck={autopilotCheck}
                                                  openAutopilotSection={openAutopilotSection}
                                                  updateOpenAutopilotSection={updateOpenAutopilotSection}
                                                  initialOfferableProductDetails={initialOfferableProductDetails}
                                                  enableOrDisablePublish={enableOrDisablePublish}/>
                                        : ""}
                                    {selected == 1 ?
                                        // page was imported from components folder
                                        <SecondTab offer={offer} shop={shop} setOffer={setOffer}
                                                   offerSettings={offerSettings} updateOffer={updateOffer}
                                                   updateShop={updateShop} shopifyThemeName={shopifyThemeName}
                                                   autopilotCheck={autopilotCheck} handleTabChange={changeTab}/>
                                        : ""}
                                    {selected == 2 ?
                                        // page was imported from components folder
                                        <ThirdTab offer={offer} shop={shop} updateOffer={updateOffer}
                                                  updateShop={updateShop} saveDraft={saveDraft} publishOffer={publishOffer}
                                                  autopilotCheck={autopilotCheck} enablePublish={enablePublish}
                                                  updateOfferNestedHash={updateOfferNestedHash}/>
                                        : ""}
                                    {selected == 3 ?
                                        // page was imported from components folder
                                        <FourthTab offer={offer} shop={shop} updateOffer={updateOffer}
                                                   updateShop={updateShop} updateOfferSettings={updateOfferSettings}
                                                   saveDraft={saveDraft} publishOffer={publishOffer}
                                                   enablePublish={enablePublish}
                                                   updateOfferNestedHash={updateOfferNestedHash}/>
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
                                    <div className='space-4'></div>
                                    {selectedPre == 0 ?
                                        <OfferPreview offer={offer} shop={shop} updateOffer={updateOffer}
                                                      checkKeysValidity={checkKeysValidity}
                                                      updateCheckKeysValidity={updateCheckKeysValidity}/>
                                        :
                                        <OfferPreview offer={offer} shop={shop} updateOffer={updateOffer}
                                                      checkKeysValidity={checkKeysValidity}
                                                      updateCheckKeysValidity={updateCheckKeysValidity}/>}
                                </Tabs>
                            </div>
                        </Layout.Section>
                    </Layout>
                </Page>
            )}
        </div>
    );
}

