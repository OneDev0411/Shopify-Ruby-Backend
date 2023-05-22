import {Tabs, Card, TextField,Select, Button} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import { setShopSettings } from "../../../utils/services/actions/settings";
import React from "react";

export function SettingTabs(props){
    const [currentShop, setCurrentShop] = useState(props.shop);
    
    // TextFields
    const [productDomSelector, setProductDomSelector] = useState(currentShop?.custom_product_page_dom_selector || "[class*='description']");
    const handleProductDomSelectorChange = useCallback((newValue) => setProductDomSelector(newValue), []);

    const [ajaxDomSelector, setAjaxDomSelector] = useState(currentShop?.custom_ajax_page_dom_selector || ".ajaxcart__row:first");
    const handleAjaxDomSelectorChange = useCallback((newValue) => setAjaxDomSelector(newValue), []);

    const [cartDomSelector, setCartDomSelector] = useState(currentShop?.custom_cart_page_dom_selector || "form[action^='/cart']");
    const handleCartDomSelectorChange = useCallback((newValue) => setCartDomSelector(newValue), []);
   
    //Select dropdown list
   const [productDomAction, setProductDomAction] = useState(currentShop?.custom_product_page_dom_action || 'prepend');
   const handleProductDomActionChange = useCallback((value) => setProductDomAction(value), []);

   const [ajaxDomAction, setAjaxDomAction] = useState(currentShop?.custom_ajax_page_dom_action || 'prepend');
   const handleAjaxDomActionChange = useCallback((value) => setAjaxDomAction(value), []);

   const [cartDomAction, setCartDomAction] = useState(currentShop?.custom_cart_page_dom_action || 'prepend');
   const handleCartDomActionChange = useCallback((value) => setCartDomAction(value), []);
 
   const options = [
     {label: 'Prepend', value: 'prepend'},
     {label: 'Append', value: 'append'},
     {label: 'Before', value: 'before'},
     {label: 'After', value: 'after'},
   ];
  
    // Tabs
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [],
    );
  
    const tabs = [
      {
        id: 'all-customers-1',
        content: 'Product page',
        accessibilityLabel: 'All customers',
        panelID: 'all-customers-content-1',
        innerContent:<>
                <TextField label="DOM selector"
                    value={productDomSelector}
                    onChange={handleProductDomSelectorChange}
                    autoComplete="off"
                ></TextField><br/>
                <Select
                    label="DOM action"
                    options={options}
                    onChange={handleProductDomActionChange}
                    value={productDomAction}
                />
            </>
      },
      {
        id: 'accepts-marketing-1',
        content: 'Cart page',
        panelID: 'accepts-marketing-content-1',
        innerContent:<>
                <TextField label="DOM selector"
                    value={cartDomSelector}
                    onChange={handleCartDomSelectorChange}
                    autoComplete="off"
                ></TextField><br/>
                <Select
                    label="DOM action"
                    options={options}
                    onChange={handleCartDomActionChange}
                    value={cartDomAction}
                />
            </>
      },
      {
        id: 'repeat-customers-1',
        content: 'Ajax cart',
        panelID: 'repeat-customers-content-1',
        innerContent:<>
                <TextField label="DOM selector"
                    value={ajaxDomSelector}
                    onChange={handleAjaxDomSelectorChange}
                    autoComplete="off"
                ></TextField><br/>
                <Select
                    label="DOM action"
                    options={options}
                    onChange={handleAjaxDomActionChange}
                    value={ajaxDomAction}
                />
            </>
      }
    ];

    async function saveShopSettings(){
        const shop_params = {
            custom_product_page_dom_selector: productDomSelector,
            custom_product_page_dom_action: productDomAction,
            custom_cart_page_dom_selector: cartDomSelector,
            custom_cart_page_dom_action: cartDomAction,
            custom_ajax_dom_selector: ajaxDomSelector,
            custom_ajax_dom_action: ajaxDomAction,
        }
        const response = await setShopSettings(shop_params);
        setCurrentShop(response.shop);        
    }

    return(<>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            <Card.Section>
            <div>{tabs[selected].innerContent}</div>
            <div className="space-4"></div>
            <div style={{display: 'flex', justifyContent: 'end'}}>
                <Button primary onClick={ ()=> saveShopSettings() }>Save</Button>
            </div>
            </Card.Section>
        </Tabs>
    </>);
}