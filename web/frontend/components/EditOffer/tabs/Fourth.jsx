import {
    LegacyCard,
    LegacyStack,
    ButtonGroup,
    Button,
    TextField,
    Checkbox,
    Select, Text, Banner
} from "@shopify/polaris";
import {useState, useCallback, useEffect, useContext} from "react";
import React from "react";
import {Link} from "react-router-dom";
import { DOMActionOptions } from "../../../shared/constants/DOMActionOptions";
import {OfferContext} from "../../../OfferContext.jsx";

// Advanced Tab
export function FourthTab(props) {
    const { offer, updateOffer, updateNestedAttributeOfOffer } = useContext(OfferContext);
    const handleChange = useCallback((newChecked) => updateOffer("save_as_default_setting", newChecked), []);
    const handleProductDomSelector = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting",  "custom_product_page_dom_selector"), []);
    const handleProductDomAction = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_product_page_dom_action"), []);
    const handleCartDomSelector = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_selector"), []);
    const handleCartDomAction = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_action"), []);
    const handleAjaxDomSelector = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_selector"), []);
    const handleAjaxDomAction = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_action"), []);
    const handleOfferCss = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "custom_css"), []);
    
    const [isLegacy, setIsLegacy] = useState(props.shop.theme_version === 'Vintage');
    const [openBanner, setOpenBanner] = useState(false);

    useEffect(() => {
        if (!isLegacy) {
            updateNestedAttributeOfOffer(false, "advanced_placement_setting", "advanced_placement_setting_enabled");
        }
    }, [])

    return (
        <>
            { !isLegacy && !offer.in_ajax_cart &&
              (
                <div style={{marginBottom: "10px"}} className="polaris-banner-container">
                    <Banner title="You are using Shopify's Theme Editor"  tone='warning'>
                        <p>Please use the theme editor to place the offers where you would like it.</p><br/>
                        <p><Link
                          to={`https://${props.shop.shopify_domain}/admin/themes/current/editor?template=${offer.in_product_page ? 'product' : 'cart' }&addAppBlockId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/app_block&target=${offer.in_product_page ? 'mainSection' : 'newAppsSection'}`}
                          target="_blank">Click here</Link> to go to the theme editor</p>
                    </Banner>
                </div>
              )
            }

            { !isLegacy && offer.in_ajax_cart &&
              (
                <div style={{marginBottom: "10px"}} className="polaris-banner-container">
                    <Banner title="You are using Shopify's Theme Editor" status={props.themeAppExtension?.theme_app_embed ? 'success' : 'warning'}>
                        {!props.themeAppExtension?.theme_app_embed ?
                            <>
                                <p>In order to show the offer in the Ajax Cart, you need to enable it in the Theme Editor.</p><br/>
                                <p><Link
                                to={`https://${props.shop.shopify_domain}/admin/themes/current/editor?context=apps&template=${offer.in_product_page ? 'product' : 'cart' }&activateAppId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/app_block_embed`}
                                target="_blank">Click here</Link> to go to theme editor</p>
                            </>
                        :
                          <p>Advanced settings are no longer needed for Shopify's Theme Editor. You've already enabled the app, all you need to do is publish your offer and it will appear in your Ajax cart</p>
                        }
                    </Banner>
                </div>
              )
            }

            {/* <LegacyCard sectioned title="Offer placement - advanced settings" actions={[{ content: 'View help doc' }]}> */}
            <LegacyCard sectioned title="Offer placement - advanced settings">
                {(!offer?.advanced_placement_setting?.advanced_placement_setting_enabled) && (
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
                        value={offer?.advanced_placement_setting?.custom_product_page_dom_selector}
                        onChange={handleProductDomSelector} type="text" 
                        disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                    <div className="space-4"/>

                    <Select
                        label="DOM action"
                        id="productDomAction"
                        options={DOMActionOptions}
                        onChange={handleProductDomAction}
                        value={offer?.advanced_placement_setting?.custom_product_page_dom_action}
                        disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                </div>
                <hr className="legacy-card-hr" />

                <div>
                    <div style={{paddingBottom: '10px'}}>
                        <Text variant="headingSm" as="h2">Cart page</Text>
                    </div>
                    <TextField
                        label="DOM Selector" 
                        value={offer?.advanced_placement_setting?.custom_cart_page_dom_selector}
                        onChange={handleCartDomSelector} 
                        disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                    <div className="space-4"/>
                    <Select
                        label="DOM action"
                        id="productDomAction"
                        options={DOMActionOptions}
                        onChange={handleCartDomAction}
                        value={offer?.advanced_placement_setting?.custom_cart_page_dom_action}
                        disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />

                </div>
                <hr className="legacy-card-hr" />

                <div>
                    <div style={{paddingBottom: '10px'}}>
                        <Text variant="headingSm" as="h2">AJAX/Slider cart</Text>
                    </div>
                    <TextField
                        label="DOM Selector" 
                        value={offer?.advanced_placement_setting?.custom_ajax_dom_selector}
                        onChange={handleAjaxDomSelector} 
                        disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                    <div className="space-4"/>

                    <Select
                        label="DOM action"
                        id="productDomAction"
                        options={DOMActionOptions}
                        onChange={handleAjaxDomAction}
                        value={offer?.advanced_placement_setting?.custom_ajax_dom_action}
                        disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                    <div className="space-4"/>
                </div>

                <hr className="legacy-card-hr" />

                <div>
                    <div style={{paddingBottom: '10px'}}>
                        <Text variant="headingSm" as="h2">Custom CSS</Text>
                    </div>

                    <TextField
                        value={offer?.custom_css}
                        onChange={handleOfferCss}
                        multiline={6}
                    />
                </div>
                <br/>

                <Checkbox
                    label="Save as default settings"
                    helpText="This placement will apply to all offers created in the future.
                     They can be edited in the Settings section."
                    checked={offer?.save_as_default_setting}
                    onChange={handleChange}
                    disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
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
