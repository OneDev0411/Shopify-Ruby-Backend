import {
  Banner,
  Grid,
  LegacyCard,
  Page,
  SkeletonBodyText,
  TextContainer
} from "@shopify/polaris";
import React, {useContext, useEffect, useState} from "react";
import {useAuthenticatedFetch, useShopSettings} from "../hooks/index.js";
import {useShopState} from "../contexts/ShopContext.jsx";
import {onCLS, onFID, onLCP} from "web-vitals";
import {traceStat} from "../services/firebase/perf.js";
import ErrorPage from "../components/ErrorPage.jsx";
import {useSelector} from "react-redux";
import Compact from "../components/layouts/template_single_compact.jsx";
import Stack from "../components/layouts/template_multi_stack.jsx";
import Carousel from "../components/layouts/template_multi_carousel.jsx";
import Flex from "../components/layouts/template_multi_flex.jsx";
import {OfferContext} from "../contexts/OfferContext.jsx";
import {AppearanceColor, OfferBox, OfferText} from "../components/organisms/index.js";
import {TitleBar, useAppBridge} from "@shopify/app-bridge-react";
import {Toast} from "@shopify/app-bridge/actions";
import {CustomTitleBar} from "../components/index.js";
import {LoadingSpinner} from "../components/atoms/index.js";
import {OFFER_DEFAULTS} from "../shared/constants/EditOfferOptions.js";
import {Link} from "react-router-dom";

export default function OffersAppearance() {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const { fetchShopSettings, updateShopSettings } = useShopSettings();
  const { shopSettings, setShopSettings, updateShopSettingsAttributes } = useShopState();
  const [error, setError] = useState(null);
  const [checkKeysValidity, setCheckKeysValidity] = useState({});
  const {offer, setOffer } = useContext(OfferContext);
  const [isLoading, setIsLoading] = useState(false);
  const [carouselLoading, setCarouselLoading] = useState(false);
  const app = useAppBridge();

  useEffect(()=> {
    onLCP(traceStat, {reportSoftNavs: true});
    onFID(traceStat, {reportSoftNavs: true});
    onCLS(traceStat, {reportSoftNavs: true});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setCarouselLoading(true);
    fetchShopSettings({admin: null})
      .then((response) => response.json() )
      .then((data) => {
        setShopSettings(data.shop_settings);

        fetch(`/api/v2/merchant/single_offer?shop=${data.shop_settings.shopify_domain}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(resp => resp.json())
          .then(offerData => {

            if (offerData.offer) {
              offerData.offer.css_options = data.shop_settings.css_options
              setOffer(offerData.offer);

              if (offerData.offer.offerable_product_details.length > 0) {
                updateCheckKeysValidity('text', offerData.offer.text_a.replace("{{ product_title }}", offerData.offer.offerable_product_details[0]?.title));
              }
              updateCheckKeysValidity('cta', offerData.offer.cta_a);

              combinedCss()
              setTimeout(function(){ setCarouselLoading(false) }, 500);
              setIsLoading(false);
            }
          })

      })
      .catch((error) => {
        setError(error);
        console.log("Error > ", error);
      })

    return function cleanup() {
      setOffer(OFFER_DEFAULTS);
    };
  }, []);

  function updateCheckKeysValidity(updatedKey, updatedValue) {
    setCheckKeysValidity(previousState => {
      return {...previousState, [updatedKey]: updatedValue};
    });
  }

  const combinedCss = () => {
    if(offer?.css_options?.main?.marginTop && parseInt(offer?.css_options?.main?.marginTop) > 0) {
      updateCheckKeysValidity("mainMarginTop", true );
    }
    else {
      updateCheckKeysValidity("mainMarginTop", false);
    }

    if(offer?.css_options?.main?.marginBottom && parseInt(offer?.css_options?.main?.marginBottom) > 0) {
      updateCheckKeysValidity("mainMarginBottom", true);
    }
    else {
      updateCheckKeysValidity("mainMarginbottom", false);
    }

    if(offer?.css_options?.main?.borderWidth && parseInt(offer?.css_options?.main?.borderWidth) > 0) {
      updateCheckKeysValidity("mainBorderWidth", true);
    }
    else {
      updateCheckKeysValidity("mainBorderWidth", false);
    }

    if(offer?.css_options?.main?.borderRadius && parseInt(offer?.css_options?.main?.borderRadius) != 4) {
      updateCheckKeysValidity("mainBorderRadius", true);
    }
    else {
      updateCheckKeysValidity("mainBorderRadius", false);
    }

    if(offer?.css_options?.button?.borderRadius && parseInt(offer?.css_options?.button?.borderRadius) != 4) {
      updateCheckKeysValidity("buttonBorderRadius", true);
    }
    else {
      updateCheckKeysValidity("buttonBorderRadius", false);
    }

    if(offer?.css_options?.button?.fontWeight && offer?.css_options?.button?.fontWeight != "bold") {
      updateCheckKeysValidity("buttonFontWeight", true);
    }
    else {
      updateCheckKeysValidity("buttonFontWeight", false);
    }

    if(offer?.css_options?.button?.fontFamily && (offer?.css_options?.button?.fontFamily != "inherit" && offer?.css_options?.button?.fontFamily != "")) {
      updateCheckKeysValidity("buttonFontFamily", true);
    }
    else {
      updateCheckKeysValidity("buttonFontFamily", false);
    }

    if(offer?.css_options?.button?.fontSize && parseInt(offer?.css_options?.button?.fontSize) > 0) {
      updateCheckKeysValidity("buttonFontSize", true);
    }
    else {
      updateCheckKeysValidity("buttonFontSize", false);
    }

    if(offer?.css_options?.button?.width && (offer?.css_options?.button?.width != "auto" && offer?.css_options?.button?.width != "")) {
      updateCheckKeysValidity("buttonWidth", true);
    }
    else {
      updateCheckKeysValidity("buttonWidth", false);
    }

    if(offer?.css_options?.button?.textTransform && offer?.css_options?.button?.textTransform != "inherit") {
      updateCheckKeysValidity("buttonTextTransform", true);
    }
    else {
      updateCheckKeysValidity("buttonTextTransform", false);
    }

    if(offer?.css_options?.button?.letterSpacing && offer?.css_options?.button?.letterSpacing != "0") {
      updateCheckKeysValidity("buttonLetterSpacing", true);
    }
    else {
      updateCheckKeysValidity("buttonLetterSpacing", false);
    }

    if(offer?.css_options?.text?.fontWeight != "bold") {
      updateCheckKeysValidity("textFontWeight", true);
    }
    else {
      updateCheckKeysValidity("textFontWeight", false);
    }

    if(offer?.css_options?.text?.fontFamily != "inherit") {
      updateCheckKeysValidity("textFontFamily", true);
    }
    else {
      updateCheckKeysValidity("textFontFamily", false);
    }

    if(offer?.css_options?.text?.fontSize != "16px") {
      updateCheckKeysValidity("textFontSize", true);
    }
    else {
      updateCheckKeysValidity("textFontSize", false);
    }

    if(offer?.css_options?.button?.marginTop != "0px" ||
      offer?.css_options?.button?.marginRight != "0px" ||
      offer?.css_options?.button?.marginBottom != "5px" ||
      offer?.css_options?.button?.marginLeft != "0px") {
      updateCheckKeysValidity("buttonMargin", true);
    }
    else {
      updateCheckKeysValidity("buttonMargin", false);
    }

    if(offer?.css_options?.button?.paddingTop != "6px" ||
      offer?.css_options?.button?.paddingRight != "10px" ||
      offer?.css_options?.button?.paddingBottom != "6px" ||
      offer?.css_options?.button?.paddingLeft != "10px") {
      updateCheckKeysValidity("buttonPadding", true);
    }
    else {
      updateCheckKeysValidity("buttonPadding", false);
    }

    if(offer?.selectedView == "mobile") {
      updateCheckKeysValidity("mobileViewWidth", true);
      updateCheckKeysValidity("mainMarginTop", false);
      updateCheckKeysValidity("mainMarginBottom", false);
    }
    else {
      updateCheckKeysValidity("mobileViewWidth", false);
    }

    if(offer?.css_options?.button?.borderWidth && parseInt(offer?.css_options?.button?.borderWidth) > 0) {
      updateCheckKeysValidity("buttonBorderWidth", true);
    }
    else {
      updateCheckKeysValidity("buttonBorderWidth", false);
    }
  }

  const saveShopSettings = (updateAll) => {
    setIsLoading(true)
    const newShop = {...shopSettings}
    newShop.css_options = offer.css_options
    newShop.multi_layout = offer.multi_layout;

    if (updateAll) {
      newShop.update_all_offers = true;
    } else {
      newShop.update_all_offers = false;
    }

    updateShopSettings(newShop)
      .then((response) => { return response.json(); })
      .then((data) => {
        updateShopSettings(newShop);
        setIsLoading(false)

        const toastNotice = Toast.create(app, {
          message: 'Offers Look & Feel is saved',
          duration: 3000,
          isError: false,
        });

        toastNotice.dispatch(Toast.Action.SHOW);
      })
      .catch((error) => {
        const toastOptions = {
          message: "Error saving shop settings",
          duration: 3000,
          isError: false,
        };
        const toastNotice = Toast.create(app, toastOptions);
        toastNotice.dispatch(Toast.Action.SHOW);
      })
  }


  if (error) { return < ErrorPage showBranding={true} />; }

  return (
    isLoading && shopSettings.shop_id === undefined ?
      <LoadingSpinner />
    :
      <Page>
        <CustomTitleBar
          title='Offers Look & Feel'
          buttonText='Save'
          handleButtonClick={() => saveShopSettings(false)}
          secondaryButtonText='Save & Apply to Existing Offers'
          handleSecondaryButtonClick={() => saveShopSettings(true)}
          image={"https://assets.incartupsell.com/images/ICU-Logo-Small.png"}
        />
        <Banner status="info" >
          <p>
            Here you can edit the look and feel of all your offers.<br />
            If you would like to have all the existing offers and new offers have the change, click the grey button above..<br />
            Iff you would like to only have the new offers have this change, click the blue 'Save' button
          </p>
        </Banner>
        <div className="space-4" />
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 8, xl: 8}}>
            <OfferBox />
            <AppearanceColor />
            <OfferText />
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 4, xl: 4}}>
            <div className="widget-visibility">
              <div>
                {
                  offer.multi_layout == "compact" ? (
                    <Compact offer={offer} checkKeysValidity={checkKeysValidity}/>
                  ) : offer.multi_layout == "stack" ? (
                    <Stack offer={offer} checkKeysValidity={checkKeysValidity}/>
                  ) : offer.multi_layout == "carousel" ? (
                    carouselLoading ? (
                      <LegacyCard sectioned>
                        <TextContainer>
                          <SkeletonBodyText lines={6} />
                        </TextContainer>
                      </LegacyCard>
                    ) : (
                      <Carousel offer={offer} checkKeysValidity={checkKeysValidity} updateCheckKeysValidity={updateCheckKeysValidity}/>
                    )
                  ) : offer.multi_layout == "flex" ? (
                    <Flex offer={offer} checkKeysValidity={checkKeysValidity}/>
                  ) : (
                    <div></div>
                  )
                }
              </div>
            </div>
          </Grid.Cell>
        </Grid>
      </Page>
  )
}