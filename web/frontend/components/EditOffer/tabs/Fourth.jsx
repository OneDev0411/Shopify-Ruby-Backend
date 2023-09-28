import {
    LegacyCard,
    LegacyStack,
    ButtonGroup,
    Button,
    TextField,
    Checkbox,
    Select, Text
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import React from "react";

// Advanced Tab
export function FourthTab(props) {

    const [checked, setChecked] = useState(false);
    const handleChange = useCallback((newChecked) => props.updateOffer("save_as_default_setting", newChecked), []);
    const handleProductDomSelector = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting",  "custom_product_page_dom_selector"), []);
    const handleProductDomAction = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_product_page_dom_action"), []);
    const handleCartDomSelector = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_selector"), []);
    const handleCartDomAction = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_action"), []);
    const handleAjaxDomSelector = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_selector"), []);
    const handleAjaxDomAction = useCallback((newValue) => props.updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_action"), []);
    const handleAjaxRefreshCode = useCallback((newValue) => props.updateShop(newValue, "advanced_placement_setting", "ajax_refresh_code"), []);
    const handleOfferCss = useCallback((newValue) => props.updateShop(newValue, "offer_css"), []);

    const options = [
        {label: 'prepend()', value: 'prepend'},
        {label: 'append()', value: 'append'},
        {label: 'after()', value: 'after'},
        {label: 'before()', value: 'before'}
    ];

    return (
        <>
            <LegacyCard sectioned title="Offer placement - advanced settings" actions={[{ content: 'View help doc' }]}>
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

                    <TextField
                        label="AJAX refresh code"
                        value={props.shop.ajax_refresh_code}
                        onChange={handleAjaxRefreshCode}
                        multiline={6}
                    />
                    <div className="space-4"/>

                    <Select
                        label="DOM action"
                        id="productDomAction"
                        options={options}
                        onChange={handleCartDomAction}
                        value={props.shop.custom_cart_page_dom_action}
                    />
                </div>

                <hr className="legacy-card-hr" />

                <div>
                    <div style={{paddingBottom: '10px'}}>
                        <Text variant="headingSm" as="h2">Custom CSS</Text>
                    </div>

                    <TextField
                        value={props.shop.offer_css}
                        onChange={handleOfferCss}
                        multiline={6}
                    />
                </div>
                <LegacyCard.Section title="Custom CSS">
                    <TextField value={props.shop.offer_css} onChange={handleOfferCss} multiline={6}></TextField>
                    <br />

                    <Checkbox
                        label="Save as default settings"
                        helpText="This placement will apply to all offers created in the future.
                         They can be edited in the Settings section."
                        checked={props.offer?.save_as_default_setting}
                        onChange={handleChange}
                        disabled={!props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                    />
                </LegacyCard.Section>
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
