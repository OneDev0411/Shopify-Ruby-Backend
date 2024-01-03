import {
    LegacyCard,
    LegacyStack,
    ButtonGroup,
    Button,
    TextField,
    Checkbox,
    Select, Text, Banner
} from "@shopify/polaris";
import {useState, useCallback, useEffect} from "react";
import React from "react";
import {Link} from "react-router-dom";

// Advanced Tab
export function FourthTab(props) {

    const handleChange = useCallback((newChecked) => props.updateOffer("save_as_default_setting", newChecked), []);
    const handleProductDomSelector = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting",  "custom_product_page_dom_selector"), []);
    const handleProductDomAction = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_product_page_dom_action"), []);
    const handleCartDomSelector = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_selector"), []);
    const handleCartDomAction = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_action"), []);
    const handleAjaxDomSelector = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_selector"), []);
    const handleAjaxDomAction = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_action"), []);
    const handleOfferCss = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "custom_css"), []);
    
    const [isLegacy, setIsLegacy] = useState(props.shop.theme_version === 'Vintage');

    const options = [
        {label: 'prepend()', value: 'prepend'},
        {label: 'append()', value: 'append'},
        {label: 'after()', value: 'after'},
        {label: 'before()', value: 'before'}
    ];

    useEffect(() => {
        if (!isLegacy) {
            props.updateNestedAttributeOfOffer(false, "advanced_placement_setting", "advanced_placement_setting_enabled");
        }
    }, [])

    return (
        <>
            { !isLegacy && !props.offer.in_ajax_cart &&
              (
                <div style={{marginBottom: "10px"}} className="polaris-banner-container">
                    <Banner title="You are using Shopify's Theme Editor" onDismiss={() => {
                        setOpenBanner(!openBanner)
                    }} tone='warning'>
                        <p>Please use the theme editor to place the offers where you would like it.</p><br/>
                        <p><Link
                          to={`https://${props.shop.shopify_domain}/admin/themes/current/editor?template=${props.offer.in_product_page ? 'product' : 'cart' }&addAppBlockId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/app_block&target=${props.offer.in_product_page ? 'mainSection' : 'newAppsSection'}`}
                          target="_blank">Click here</Link> to go to the theme editor</p>
                    </Banner>
                </div>
              )
            }

            { !isLegacy && props.offer.in_ajax_cart &&
              (
                <div style={{marginBottom: "10px"}} className="polaris-banner-container">
                    <Banner title="You are using Shopify's Theme Editor" onDismiss={() => {
                        setOpenBanner(!openBanner)
                    }} tone='warning'>
                        <p>Please use the theme editor to place the offer in the Ajax Cart</p><br/>
                        <p><Link
                          to={`https://${props.shop.shopify_domain}/admin/themes/current/editor?context=apps&template=${props.offer.in_product_page ? 'product' : 'cart' }&activateAppId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/app_block_embed`}
                          target="_blank">Click here</Link> to go to the theme editor</p>
                    </Banner>
                </div>
              )
            }

            {/* <LegacyCard sectioned title="Offer placement - advanced settings" actions={[{ content: 'View help doc' }]}> */}
            <LegacyCard sectioned title="Offer placement - advanced settings">
                {(!props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled) && (
                    <>
                        <b>To edit Advanced settings, enable "Advanced Placement Settings" option on the Placement tab.</b>
                        <br/><br/><br/>
                    </>
                )}
                <div>
                    <div style={{paddingBottom: '10px'}}>
                        <Text variant="headingSm" as="h2">Product page</Text>
                    </div>
                    <TextField
                        label="DOM Selector" 
                        value={props.offer?.advanced_placement_setting?.custom_product_page_dom_selector} 
                        onChange={handleProductDomSelector} type="text" 
                        disabled={!props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                    <div className="space-4"/>

                    <Select
                        label="DOM action"
                        id="productDomAction"
                        options={options}
                        onChange={handleProductDomAction}
                        value={props.offer?.advanced_placement_setting?.custom_product_page_dom_action}
                        disabled={!props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                </div>
                <hr className="legacy-card-hr" />

                <div>
                    <div style={{paddingBottom: '10px'}}>
                        <Text variant="headingSm" as="h2">Cart page</Text>
                    </div>
                    <TextField
                        label="DOM Selector" 
                        value={props.offer?.advanced_placement_setting?.custom_cart_page_dom_selector} 
                        onChange={handleCartDomSelector} 
                        disabled={!props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                    <div className="space-4"/>
                    <Select
                        label="DOM action"
                        id="productDomAction"
                        options={options}
                        onChange={handleCartDomAction}
                        value={props.offer?.advanced_placement_setting?.custom_cart_page_dom_action}
                        disabled={!props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />

                </div>
                <hr className="legacy-card-hr" />

                <div>
                    <div style={{paddingBottom: '10px'}}>
                        <Text variant="headingSm" as="h2">AJAX/Slider cart</Text>
                    </div>
                    <TextField
                        label="DOM Selector" 
                        value={props.offer?.advanced_placement_setting?.custom_ajax_dom_selector} 
                        onChange={handleAjaxDomSelector} 
                        disabled={!props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                    <div className="space-4"/>

                    <Select
                        label="DOM action"
                        id="productDomAction"
                        options={options}
                        onChange={handleAjaxDomAction}
                        value={props.offer?.advanced_placement_setting?.custom_ajax_dom_action}
                        disabled={!props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                    <div className="space-4"/>
                </div>

                <hr className="legacy-card-hr" />

                <div>
                    <div style={{paddingBottom: '10px'}}>
                        <Text variant="headingSm" as="h2">Custom CSS</Text>
                    </div>

                    <TextField
                        value={props.offer?.custom_css}
                        onChange={handleOfferCss}
                        multiline={6}
                    />
                </div>
                <br/>

                <Checkbox
                    label="Save as default settings"
                    helpText="This placement will apply to all offers created in the future.
                     They can be edited in the Settings section."
                    checked={props.offer?.save_as_default_setting}
                    onChange={handleChange}
                    disabled={!props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                />
            </LegacyCard>
            <div className="space-10"></div>
            <LegacyStack distribution="center">
                <ButtonGroup>
                    <Button onClick={() => props.saveDraft()}>Save Draft</Button>
                    <Button primary disabled={props.enablePublish} onClick={() => props.publishOffer()}>Publish</Button>
                </ButtonGroup>
            </LegacyStack>
            <div className="space-10"></div>
        </>
    );
}
