import {
    LegacyStack,
    ButtonGroup,
    Button,
} from "@shopify/polaris";
import {useState, useEffect, useContext} from "react";
import React from "react";
import {Link} from "react-router-dom";
import {OfferContext} from "../../../contexts/OfferContext.jsx";
import {useShopState} from "../../../contexts/ShopContext.jsx";
import { AdvancedSettings } from "../../organisms/index.js";
import { BannerContainer } from "../../atoms/index.js";

// Advanced Tab
export function FourthTab(props) {
    const { offer, updateNestedAttributeOfOffer } = useContext(OfferContext);
    const { shopSettings, themeAppExtension } = useShopState();

    const isLegacy = themeAppExtension?.theme_version !== '2.0' || (themeAppExtension?.theme_version === '2.0' && !themeAppExtension?.theme_app_complete);

    const [themeAppUrl, setThemeAppUrl] = useState('');

    useEffect(() => {
        if (!isLegacy) {
            updateNestedAttributeOfOffer(false, "advanced_placement_setting", "advanced_placement_setting_enabled");

            let urlPlacement = '';
            let urlSection = ''
            if (offer.in_product_page) {
                urlPlacement = 'product'
                urlSection = 'mainSection';
            } else if (offer.in_cart_page){
                urlPlacement = 'cart'
                urlSection = 'newAppsSection';
            }
            setThemeAppUrl(
              `https://${shopSettings.shopify_domain}/admin/themes/current/editor?template=${urlPlacement}
              &addAppBlockId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/${urlPlacement}_app_block&target=${urlSection}`
            )
        }
    }, [])

    const handleButtonChange = () => {
        fetch(`/api/v2/merchant/theme_app_check?shop=${shopData.shopify_domain}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }})
          .then( (resp) => resp.json())
          .then( () => {
              return true
          })
    }

    return (
        <>
            { !isLegacy && !offer.in_ajax_cart &&
              (
                <div style={{marginBottom: "10px"}} className="polaris-banner-container">
                    <Banner title="You are using Shopify's Theme Editor"  tone='warning'>
                        <p>Please use the theme editor to place the offers where you would like it.</p><br/>
                        <p>
                            <a onClick={handleButtonChange} href={themeAppUrl} target="_blank">
                                Click here
                            </a>&nbsp; to go to the theme editor
                        </p>
                    </Banner>
                </div>
              )
            }

            { !isLegacy && offer.in_ajax_cart &&
              (
                <div style={{marginBottom: "10px"}} className="polaris-banner-container">
                    <Banner title="You are using Shopify's Theme Editor" status={themeAppExtension?.theme_app_embed ? 'success' : 'warning'}>
                        {!themeAppExtension?.theme_app_embed ?
                          <>
                              <p>In order to show the offer in the Ajax Cart, you need to enable it in the Theme Editor.</p><br/>
                              <p>
                                  <a onClick={handleButtonChange}
                                     href={`https://${shopSettings.shopify_domain}/admin/themes/current/editor?context=apps&template=product&activateAppId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/ajax_cart_app_block`}
                                     target="_blank"
                                  >
                                      Click here
                                  </a>to go to theme editor
                              </p>
                          </>
                          :
                          <p>Advanced settings are no longer needed for Shopify's Theme Editor. You've already enabled the app, all you need to do is publish your offer and it will appear in your Ajax cart</p>
                        }
                    </Banner>
                </div>
              )
            }

            <AdvancedSettings />
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
