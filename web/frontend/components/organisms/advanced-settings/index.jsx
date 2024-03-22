import {
    LegacyCard,
    TextField,
    Checkbox,
    Select,
    Text,
} from "@shopify/polaris";
import {useCallback, useContext} from "react";
import React from "react";
import { DOMActionOptions } from "../../../shared/constants/DOMActionOptions";
import {OfferContext} from "../../../contexts/OfferContext.jsx";

const AdvancedSettings = () => {
    const { offer, updateOffer, updateNestedAttributeOfOffer } = useContext(OfferContext);
    const handleChange = useCallback((newChecked) => updateOffer("save_as_default_setting", newChecked), []);
    const handleProductDomSelector = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting",  "custom_product_page_dom_selector"), []);
    const handleProductDomAction = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_product_page_dom_action"), []);
    const handleCartDomSelector = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_selector"), []);
    const handleCartDomAction = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_action"), []);
    const handleAjaxDomSelector = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_selector"), []);
    const handleAjaxDomAction = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_action"), []);
    const handleOfferCss = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "custom_css"), []);

    return (
        <>
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
        </>
    );
}

export default AdvancedSettings;
