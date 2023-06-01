import{LegacyCard,Grid, Button, Page} from "@shopify/polaris";
import {
	SettingsMajor
} from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react'
import { useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from "react";
import {Redirect} from '@shopify/app-bridge/actions';
import {Partners, SettingTabs, GenericTitleBar} from "../components";
import { getShop, toggleShopActivation, setShopSettings } from "../services/actions/shop";

export default function Settings() {
    const shop = useSelector(state => state.shopAndHost.shop);
    const [currentShop, setCurrentShop] = useState(null);
    const [formData, setFormData] = useState({});
    const app = useAppBridge();

    const fetchCurrentShop = useCallback(async () => {
        let redirect = Redirect.create(app);
        const response = await getShop(shop);
        if(response.redirect_to){
          redirect.dispatch(Redirect.Action.APP, response.redirect_to);
        }
        setCurrentShop(response.shop);
        setFormData({
            productDomSelector: response.shop?.custom_product_page_dom_selector || "[class*='description']",
            productDomAction: response.shop?.custom_product_page_dom_action || 'prepend',
            cartDomSelector: response.shop?.custom_cart_page_dom_selector || "form[action^='/cart']",
            cartDomAction: response.shop?.custom_cart_page_dom_action || 'prepend',
            ajaxDomSelector: response.shop?.custom_ajax_dom_selector || ".ajaxcart__row:first",
            ajaxDomAction: response.shop?.custom_ajax_dom_action || 'prepend',
        })
      }, []);

    useEffect(async () => {
        fetchCurrentShop()
    }, [fetchCurrentShop]);

    const handleFormChange = (value, id) => {
      setFormData({
          ...formData,
          [id]: value
        });
    };

    const toggleActivation = async ()=>{
      const response = await toggleShopActivation(currentShop?.shopify_domain);
      window.location.reload();
    }

    const handleSave = async ()=>{
      const data = formData;
      const shop_params = {
          custom_product_page_dom_selector: data.productDomSelector,
          custom_product_page_dom_action: data.productDomAction,
          custom_cart_page_dom_selector: data.cartDomSelector,
          custom_cart_page_dom_action: data.cartDomAction,
          custom_ajax_dom_selector: data.ajaxDomSelector,
          custom_ajax_dom_action: data.ajaxDomAction,
      }
      const response = await setShopSettings(shop_params, currentShop?.id);
      setCurrentShop(response.shop);
    }
    
  return (
    <>
      <Page>
      <GenericTitleBar title='Settings' image={SettingsMajor} buttonText='Save' handleButtonClick={handleSave} />
      {/* <TitleBar/> */}
          <LegacyCard sectioned>
              {(currentShop?.activated) ? (
              <Grid>
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 10, xl: 4}}>
                      <p>This app is activated</p>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 2, xl: 4}}>
                      <div style={{display: 'flex', justifyContent: 'end'}}> 
                          <Button onClick={toggleActivation}>Deactivate</Button>
                      </div>
                  </Grid.Cell>
              </Grid>) : (
              <Grid>
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 10, xl: 4}}>
                      <p>This app is deactivated</p>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 2, xl: 4}}>
                      <div style={{display: 'flex', justifyContent: 'end'}}> 
                          <Button onClick={toggleActivation}>Activate</Button>
                      </div>
                  </Grid.Cell>
              </Grid>
              )}
          </LegacyCard>
          <div className="space-4"></div>
          <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                  <div id="no-bg-LegacyCard">
                      <LegacyCard sectioned style={{backgroundColor: "transparent"}}>
                          <h2><strong>Default offer placement settings</strong></h2>
                          <br/>
                          <p>Only edit these settings if you know HTML.</p>
                      </LegacyCard>
                  </div>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                  <LegacyCard sectioned columnSpan={{ md: 6, lg: 6, xl: 6}}>
                      {/* Tabs */}
                      {currentShop ?  <SettingTabs formData={formData} handleFormChange={handleFormChange} /> : 'Loading...'}
                  </LegacyCard>
              </Grid.Cell>
          </Grid>
          <div className="space-4"></div>
          <Partners/>
      </Page>
  </>
  );
}
