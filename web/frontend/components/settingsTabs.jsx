import {Tabs, Card, TextField, Select, Checkbox} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import React from "react";

export function SettingTabs(props){
 
   const options = [
     {label: 'prepend()', value: 'prepend'},
     {label: 'append()', value: 'append'},
     {label: 'after()', value: 'after'},
     {label: 'before()', value: 'before'},
   ];
  
    // Tabs
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [],
    );
    const handleAjaxRefreshCode = useCallback((newValue) => props.updateShop(newValue, "ajax_refresh_code"), []);
    const handleUsesAjaxCartChange = useCallback((newValue) => props.updateShop(newValue, "uses_ajax_cart"), []);
  
    const tabs = [
      {
        id: 'all-customers-1',
        content: 'Product page',
        accessibilityLabel: 'All customers',
        panelID: 'all-customers-content-1',
        innerContent:<>
                <TextField label="DOM selector"
                    id="productDomSelector"
                    value={props.formData.productDomSelector}
                    onChange={props.handleFormChange}
                    autoComplete="off"
                ></TextField><br/>
                <Select
                    label="DOM action"
                    id="productDomAction"
                    options={options}
                    onChange={props.handleFormChange}
                    value={props.formData.productDomAction}
                />
            </>
      },
      {
        id: 'accepts-marketing-1',
        content: 'Cart page',
        panelID: 'accepts-marketing-content-1',
        innerContent:<>
                <TextField label="DOM selector"
                    id="cartDomSelector"
                    value={props.formData.cartDomSelector}
                    onChange={props.handleFormChange}
                    autoComplete="off"
                ></TextField><br/>
                <Select
                    label="DOM action"
                    id="cartDomAction"
                    options={options}
                    onChange={props.handleFormChange}
                    value={props.formData.cartDomAction}
                />
            </>
      },
      {
        id: 'repeat-customers-1',
        content: 'Ajax cart',
        panelID: 'repeat-customers-content-1',
        innerContent:<>
                <TextField label="DOM selector"
                    id="ajaxDomSelector"
                    value={props.formData.ajaxDomSelector}
                    onChange={props.handleFormChange}
                    autoComplete="off"
                ></TextField><br/>
                <Select
                    label="DOM action"
                    id="ajaxDomAction"
                    options={options}
                    onChange={props.handleFormChange}
                    value={props.formData.ajaxDomAction}
                />
                <br/>
                <Checkbox
                    label="My store uses an AJAX (popup or drawer-style) cart"
                    checked={props.currentShop.uses_ajax_cart}
                    onChange={handleUsesAjaxCartChange}
                ></Checkbox>
                {(props.currentShop.uses_ajax_cart) && (
                    <>
                        <br/><br/>
                        <TextField label="AJAX refresh code" value={props.currentShop.ajax_refresh_code} onChange={handleAjaxRefreshCode} multiline={6}></TextField>
                    </>
                )}
            </>
      }
    ];

    return(<>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            <Card.Section>
            <div>{tabs[selected].innerContent}</div>
            <div className="space-4"></div>
            </Card.Section>
        </Tabs>
    </>);
}