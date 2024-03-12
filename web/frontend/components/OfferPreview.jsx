import {useState, useEffect, useContext} from "react";
import { 
	LegacyCard, TextContainer ,SkeletonBodyText
} from '@shopify/polaris';
import Compact from './layouts/template_single_compact';
import Stack from './layouts/template_multi_stack';
import Carousel from './layouts/template_multi_carousel';
import Flex from './layouts/template_multi_flex';
import {useAuthenticatedFetch} from "../hooks/index.js";
import {useSelector} from "react-redux";
import {OfferContext} from "../OfferContext.jsx";


export function OfferPreview(props) {
	const { offer, updateOffer, updateNestedAttributeOfOffer } = useContext(OfferContext);
	const shopAndHost = useSelector(state => state.shopAndHost);

	const [carouselLoading, setCarouselLoading] = useState(false);
	
	const fetch = useAuthenticatedFetch(shopAndHost.host);

	useEffect(() => {
		setCarouselLoading(true);
		combinedCss();
		setTimeout(function(){ setCarouselLoading(false) }, 500);

		if (!props.previewMode) {
			fetch(`/api/v2/merchant/offer_settings`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({offer: {include_sample_products: 0}, shop: shopAndHost.shop}),
			})
				.then((response) => {
					return response.json()
				})
				.then((data) => {
					let offerSettings = {...data};

					if(Object.keys(offer.css_options).length == 0) {
						updateOffer("css_options", props.shop.css_options)
					}
					if(!offer.placement_setting) {
						updateNestedAttributeOfOffer(true, "placement_setting", "default_product_page");
						updateNestedAttributeOfOffer(true, "placement_setting", "default_cart_page");
						updateNestedAttributeOfOffer(true, "placement_setting", "default_ajax_cart");
					}
					if(!offer.advanced_placement_setting) {
						updateNestedAttributeOfOffer(offerSettings?.product_page_dom_selector || "[class*='description']", "advanced_placement_setting",  "custom_product_page_dom_selector")
						updateNestedAttributeOfOffer(offerSettings?.product_page_dom_action ||'after', "advanced_placement_setting",  "custom_product_page_dom_action")
						updateNestedAttributeOfOffer(offerSettings?.cart_page_dom_selector || "form[action^='/cart']", "advanced_placement_setting",  "custom_cart_page_dom_selector")
						updateNestedAttributeOfOffer(offerSettings?.cart_page_dom_action || 'prepend', "advanced_placement_setting",  "custom_cart_page_dom_action")
						updateNestedAttributeOfOffer(offerSettings?.ajax_dom_selector || ".ajaxcart__row:first", "advanced_placement_setting",  "custom_ajax_dom_selector")
						updateNestedAttributeOfOffer(offerSettings?.ajax_dom_action || 'prepend', "advanced_placement_setting",  "custom_ajax_dom_action")
					}
				})
				.catch((error) => {
					console.log("Error > ", error);
				})
		}
	}, [offer, props.updatePreviousAppOffer]);

	// Called everytime when any attribute in shop changes.
	function combinedCss () {
		if(offer?.css_options?.main?.marginTop && parseInt(offer?.css_options?.main?.marginTop) > 0) {
			props.updateCheckKeysValidity("mainMarginTop", true );
		}
		else {
			props.updateCheckKeysValidity("mainMarginTop", false);
		}

		if(offer?.css_options?.main?.marginBottom && parseInt(offer?.css_options?.main?.marginBottom) > 0) {
			props.updateCheckKeysValidity("mainMarginBottom", true);
		}
		else {
			props.updateCheckKeysValidity("mainMarginbottom", false);
		}

		if(offer?.css_options?.main?.borderWidth && parseInt(offer?.css_options?.main?.borderWidth) > 0) {
			props.updateCheckKeysValidity("mainBorderWidth", true);
		}
		else {
			props.updateCheckKeysValidity("mainBorderWidth", false);
		}

		if(offer?.css_options?.main?.borderRadius && parseInt(offer?.css_options?.main?.borderRadius) != 4) {
			props.updateCheckKeysValidity("mainBorderRadius", true);
		}
		else {
			props.updateCheckKeysValidity("mainBorderRadius", false);
		}

		if(offer?.css_options?.button?.borderRadius && parseInt(offer?.css_options?.button?.borderRadius) != 4) {
			props.updateCheckKeysValidity("buttonBorderRadius", true);
		}
		else {
			props.updateCheckKeysValidity("buttonBorderRadius", false);
		}

		if(offer?.css_options?.button?.fontWeight && offer?.css_options?.button?.fontWeight != "bold") {
			props.updateCheckKeysValidity("buttonFontWeight", true);
		}
		else {
			props.updateCheckKeysValidity("buttonFontWeight", false);
		}

		if(offer?.css_options?.button?.fontFamily && (offer?.css_options?.button?.fontFamily != "inherit" && offer?.css_options?.button?.fontFamily != "")) {
			props.updateCheckKeysValidity("buttonFontFamily", true);
		}
		else {
			props.updateCheckKeysValidity("buttonFontFamily", false);
		}

		if(offer?.css_options?.button?.fontSize && parseInt(offer?.css_options?.button?.fontSize) > 0) {
			props.updateCheckKeysValidity("buttonFontSize", true);
		}
		else {
			props.updateCheckKeysValidity("buttonFontSize", false);
		}

		if(offer?.css_options?.button?.width && (offer?.css_options?.button?.width != "auto" && offer?.css_options?.button?.width != "")) {
			props.updateCheckKeysValidity("buttonWidth", true);
		}
		else {
			props.updateCheckKeysValidity("buttonWidth", false);
		}

		if(offer?.css_options?.button?.textTransform && offer?.css_options?.button?.textTransform != "inherit") {
			props.updateCheckKeysValidity("buttonTextTransform", true);
		}
		else {
			props.updateCheckKeysValidity("buttonTextTransform", false);
		}

		if(offer?.css_options?.button?.letterSpacing && offer?.css_options?.button?.letterSpacing != "0") {
			props.updateCheckKeysValidity("buttonLetterSpacing", true);
		}
		else {
			props.updateCheckKeysValidity("buttonLetterSpacing", false);
		}

		if(offer?.css_options?.text?.fontWeight != "bold") {
			props.updateCheckKeysValidity("textFontWeight", true);
		}
		else {
			props.updateCheckKeysValidity("textFontWeight", false);
		}

		if(offer?.css_options?.text?.fontFamily != "inherit") {
			props.updateCheckKeysValidity("textFontFamily", true);
		}
		else {
			props.updateCheckKeysValidity("textFontFamily", false);
		}

		if(offer?.css_options?.text?.fontSize != "16px") {
			props.updateCheckKeysValidity("textFontSize", true);
		}
		else {
			props.updateCheckKeysValidity("textFontSize", false);
		}

		if(offer?.css_options?.button?.marginTop != "0px" ||
			offer?.css_options?.button?.marginRight != "0px" ||
        	offer?.css_options?.button?.marginBottom != "5px" ||
        	offer?.css_options?.button?.marginLeft != "0px") {
			props.updateCheckKeysValidity("buttonMargin", true);
		}
		else {
			props.updateCheckKeysValidity("buttonMargin", false);
		}

		if(offer?.css_options?.button?.paddingTop != "6px" ||
			offer?.css_options?.button?.paddingRight != "10px" ||
        	offer?.css_options?.button?.paddingBottom != "6px" ||
        	offer?.css_options?.button?.paddingLeft != "10px") {
			props.updateCheckKeysValidity("buttonPadding", true);
		}
		else {
			props.updateCheckKeysValidity("buttonPadding", false);
		}

		if(offer?.selectedView == "mobile") {
			props.updateCheckKeysValidity("mobileViewWidth", true);
			props.updateCheckKeysValidity("mainMarginTop", false);
			props.updateCheckKeysValidity("mainMarginBottom", false);
		}
		else {
			props.updateCheckKeysValidity("mobileViewWidth", false);
		}

		if(offer?.css_options?.button?.borderWidth && parseInt(offer?.css_options?.button?.borderWidth) > 0) {
			props.updateCheckKeysValidity("buttonBorderWidth", true);
		}
		else {
			props.updateCheckKeysValidity("buttonBorderWidth", false);
		}
	}

	return(
		<div>
			{
				offer.multi_layout == "compact" ? (
					<Compact offer={offer} checkKeysValidity={props.checkKeysValidity}/>
				) : offer.multi_layout == "stack" ? (
					<Stack offer={offer} checkKeysValidity={props.checkKeysValidity}/>
				) : offer.multi_layout == "carousel" ? (
					carouselLoading ? (
						<LegacyCard sectioned>
							<TextContainer>
								<SkeletonBodyText lines={6} />
							</TextContainer>
						</LegacyCard>
					) : (
						<Carousel offer={offer} checkKeysValidity={props.checkKeysValidity} updateCheckKeysValidity={props.updateCheckKeysValidity}/>
					)
				) : offer.multi_layout == "flex" ? (
					<Flex offer={offer} checkKeysValidity={props.checkKeysValidity}/>
				) : (
					<div></div>
				)
			}
		</div>
	);
};