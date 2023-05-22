import {Page, Badge, Card,Layout,Tabs,Icon,Stack, ButtonGroup, Button,TextField,RadioButton} from '@shopify/polaris';
import {DesktopMajor, MobileMajor} from '@shopify/polaris-icons';
import { TitleBar} from "@shopify/app-bridge-react";
import "../components/stylesheets/mainstyle.css";
import { EditOfferTabs, SecondTab, ThirdTab, FourthTab } from "../components";
import {useState, useCallback, useEffect} from 'react';
import React from 'react';
import { offerActivate, loadOfferDetails, offerSettings } from "../services/offers/actions/offer";


export default function EditPage() {
    // Content section tab data
    const [selected, setSelected] = useState(0);
    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    const [offer, setOffer] = useState({
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
    link_to_product: false,
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
    show_product_price: false,
    show_product_title: false,
    show_spinner: null,
    show_nothanks: false,
    show_quantity_selector: false,
    show_custom_field: false,
    show_compare_at_price: null,
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
    })

    //Call on initial render
    useEffect(() => {
        loadOfferDetails(55, 31).then(function(data) {
            setOffer(data);
        })
        .catch(function(error) {
        })

        offerSettings(55, 0).then(function(data) {
            setShop(data);
        })
        .catch(function(error) {
        })
    },[])

    //Called whenever the offer changes in any child component
    function updateOffer(updatedKey, updatedValue) {
        setOffer(previousState => {
            return { ...previousState, [updatedKey]: updatedValue }
        });
    }

    //Called whenever the offer settings for shop changes in any child component
    function updateOfferSettings(updatedShop) {
        setOfferSettings(updatedShop);
    }

    // Called to update the included variants in offer
    function updateIncludedVariants(selectedItem, selectedVariants) {
        if(Array.isArray(selectedItem)) {
            const updatedOffer = {...offer};
            for(var key in selectedVariants) {
                updatedOffer.included_variants[key] = selectedVariants[key];
            }
        }
        else {
            const updatedOffer = {...offer};
            updatedOffer.included_variants[selectedItem] = selectedVariants;
        }
    }

    // Called to update offerable_product_details and offerable_product_shopify_ids of offer
    function updateProductsOfOffer(data) {
        setOffer(previousState => {
            return { ...previousState, offerable_product_details: [...previousState.offerable_product_details, data], }
        });
        setOffer(previousState => {
            return { ...previousState, offerable_product_shopify_ids: [...previousState.offerable_product_shopify_ids, data.id], }
        });
    }

    //Called whenever the shop changes in any child component
    function updateShop(updatedKey, updatedValue) {
        setShop(previousState => {
            return { ...previousState, [updatedKey]: updatedValue }
        });
    }


    // Called when save button is clicked
    function save() {
        console.log(offer);
        debugger;
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
    const handlePreTabChange = useCallback(
        (selectedPreTabIndex) => setSelectedPre(selectedPreTabIndex),
        [],
    );

    const tabsPre = [
        {
            id: 'desktop',
            content:  (
                <div className='flex-tab'>
                    <Icon source={DesktopMajor} />
                    <p>Desktop</p>
                </div>    
              ),
            panelID: 'desktop',
        },
        {
            id: 'mobile',
            content: (
                <div className='flex-tab'>
                    <Icon source={MobileMajor} />
                    <p>Mobile</p>
                </div>    
              ),
            panelID: 'mobile',
        }
    ];

    async function publishOffer() {
        const response = await offerActivate(offer.offerId, shop.shopID);
        
    };

  return (
    <Page
        breadcrumbs={[{content: 'Products', url: '/'}]}
        title="Create new offer"
        primaryAction={{content: 'Publish', disabled: false, onClick: publishOffer}}
        secondaryActions={[{content: 'Save draft', disabled: false, onAction: () => save()}]}
    >
        <TitleBar/>
        <Layout>
            <Layout.Section>
                <Tabs
                    tabs={tabs}
                    selected={selected}
                    onSelect={handleTabChange}
                    disclosureText="More views"
                    fitted
                >   
                    <div className='space-4'></div>

                    {selected == 0 ? 
                        // page was imported from components folder
                        <EditOfferTabs offer={offer} offerSettings={offerSettings} updateOffer={updateOffer} updateIncludedVariants={updateIncludedVariants} updateProductsOfOffer={updateProductsOfOffer}/>
                    : "" }
                    {selected == 1 ? 
                        // page was imported from components folder
                        <SecondTab offer={offer} offerSettings={offerSettings} updateOffer={updateOffer}/>
                    : "" } 
                    {selected == 2 ? 
                        // page was imported from components folder
                        <ThirdTab/>
                    : "" }    
                    {selected == 3 ? 
                        // page was imported from components folder
                        <FourthTab offer={offer} shop={shop} updateOffer={updateOffer} updateShop={updateShop} updateOfferSettings={updateOfferSettings}/>
                    : "" }    
                </Tabs>
            </Layout.Section>
            <Layout.Section secondary>
                <Tabs
                    tabs={tabsPre}
                    selected={selectedPre}
                    onSelect={handlePreTabChange}
                    disclosureText="More views"
                    fitted
                >   
                    <div className='space-4'></div>
                    {selectedPre == 0 ? 
                        <Card sectioned>
                    
                        </Card>
                    : "" }
                </Tabs>
            </Layout.Section>
        </Layout>
    </Page>
  );
}

