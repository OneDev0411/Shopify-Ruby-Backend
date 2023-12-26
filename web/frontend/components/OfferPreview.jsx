import { forwardRef, useState, useEffect, useRef } from "react";
import { 
	Text,
	LegacyCard,
	Grid, TextContainer ,SkeletonBodyText
} from '@shopify/polaris';
import TemplateComponent from 'react-mustache-template-component';
import themeCss from '../assets/theme.css';
import Compact from './layouts/template_single_compact';
import Stack from './layouts/template_multi_stack';
import Carousel from './layouts/template_multi_carousel';
import Flex from './layouts/template_multi_flex';
import Siema from 'siema'
import { Spinner } from '@shopify/polaris';


export function OfferPreview(props) {

	const [carouselLoading, setCarouselLoading] = useState(false);

	useEffect(() => {
		setCarouselLoading(true);
		combinedCss();
		setTimeout(function(){ setCarouselLoading(false) }, 500);
		if (!props.previewMode) {
			if(Object.keys(props.offer.css_options).length == 0) {
				props.updateOffer("css_options", props.shop.css_options)
			}
			if(!props.offer.placement_setting) {
				props.updateNestedAttributeOfOffer(true, "placement_setting", "default_product_page");
				props.updateNestedAttributeOfOffer(true, "placement_setting", "default_cart_page");
				props.updateNestedAttributeOfOffer(true, "placement_setting", "default_ajax_cart");
			}
			if(!props.offer.advanced_placement_setting) {
				props.updateNestedAttributeOfOffer(props.offerSettings?.product_page_dom_selector || "[class*='description']", "advanced_placement_setting",  "custom_product_page_dom_selector")
				props.updateNestedAttributeOfOffer(props.offerSettings?.product_page_dom_action ||'after', "advanced_placement_setting",  "custom_product_page_dom_action")
				props.updateNestedAttributeOfOffer(props.offerSettings?.cart_page_dom_selector || "form[action^='/cart']", "advanced_placement_setting",  "custom_cart_page_dom_selector")
				props.updateNestedAttributeOfOffer(props.offerSettings?.cart_page_dom_action || 'prepend', "advanced_placement_setting",  "custom_cart_page_dom_action")
				props.updateNestedAttributeOfOffer(props.offerSettings?.ajax_dom_selector || ".ajaxcart__row:first", "advanced_placement_setting",  "custom_ajax_dom_selector")
				props.updateNestedAttributeOfOffer(props.offerSettings?.ajax_dom_action || 'prepend', "advanced_placement_setting",  "custom_ajax_dom_action")
			}
		}
		
	}, [props.offer, props.updatePreviousAppOffer]);

	// Called everytime when any attribute in shop changes.
	function combinedCss () {
		if(props.offer?.css_options?.main?.marginTop && parseInt(props.offer?.css_options?.main?.marginTop) > 0) {
			props.updateCheckKeysValidity("mainMarginTop", true );
		}
		else {
			props.updateCheckKeysValidity("mainMarginTop", false);
		}

		if(props.offer?.css_options?.main?.marginBottom && parseInt(props.offer?.css_options?.main?.marginBottom) > 0) {
			props.updateCheckKeysValidity("mainMarginBottom", true);
		}
		else {
			props.updateCheckKeysValidity("mainMarginbottom", false);
		}

		if(props.offer?.css_options?.main?.borderWidth && parseInt(props.offer?.css_options?.main?.borderWidth) > 0) {
			props.updateCheckKeysValidity("mainBorderWidth", true);
		}
		else {
			props.updateCheckKeysValidity("mainBorderWidth", false);
		}

		if(props.offer?.css_options?.main?.borderRadius && parseInt(props.offer?.css_options?.main?.borderRadius) != 4) {
			props.updateCheckKeysValidity("mainBorderRadius", true);
		}
		else {
			props.updateCheckKeysValidity("mainBorderRadius", false);
		}

		if(props.offer?.css_options?.button?.borderRadius && parseInt(props.offer?.css_options?.button?.borderRadius) != 4) {
			props.updateCheckKeysValidity("buttonBorderRadius", true);
		}
		else {
			props.updateCheckKeysValidity("buttonBorderRadius", false);
		}

		if(props.offer?.css_options?.button?.fontWeight && props.offer?.css_options?.button?.fontWeight != "bold") {
			props.updateCheckKeysValidity("buttonFontWeight", true);
		}
		else {
			props.updateCheckKeysValidity("buttonFontWeight", false);
		}

		if(props.offer?.css_options?.button?.fontFamily && (props.offer?.css_options?.button?.fontFamily != "inherit" && props.offer?.css_options?.button?.fontFamily != "")) {
			props.updateCheckKeysValidity("buttonFontFamily", true);
		}
		else {
			props.updateCheckKeysValidity("buttonFontFamily", false);
		}

		if(props.offer?.css_options?.button?.fontSize && parseInt(props.offer?.css_options?.button?.fontSize) > 0) {
			props.updateCheckKeysValidity("buttonFontSize", true);
		}
		else {
			props.updateCheckKeysValidity("buttonFontSize", false);
		}

		if(props.offer?.css_options?.button?.width && (props.offer?.css_options?.button?.width != "auto" && props.offer?.css_options?.button?.width != "")) {
			props.updateCheckKeysValidity("buttonWidth", true);
		}
		else {
			props.updateCheckKeysValidity("buttonWidth", false);
		}

		if(props.offer?.css_options?.button?.textTransform && props.offer?.css_options?.button?.textTransform != "inherit") {
			props.updateCheckKeysValidity("buttonTextTransform", true);
		}
		else {
			props.updateCheckKeysValidity("buttonTextTransform", false);
		}

		if(props.offer?.css_options?.button?.letterSpacing && props.offer?.css_options?.button?.letterSpacing != "0") {
			props.updateCheckKeysValidity("buttonLetterSpacing", true);
		}
		else {
			props.updateCheckKeysValidity("buttonLetterSpacing", false);
		}

		if(props.offer?.css_options?.text?.fontWeight != "bold") {
			props.updateCheckKeysValidity("textFontWeight", true);
		}
		else {
			props.updateCheckKeysValidity("textFontWeight", false);
		}

		if(props.offer?.css_options?.text?.fontFamily != "inherit") {
			props.updateCheckKeysValidity("textFontFamily", true);
		}
		else {
			props.updateCheckKeysValidity("textFontFamily", false);
		}

		if(props.offer?.css_options?.text?.fontSize != "16px") {
			props.updateCheckKeysValidity("textFontSize", true);
		}
		else {
			props.updateCheckKeysValidity("textFontSize", false);
		}

		if(props.offer?.css_options?.button?.marginTop != "0px" || 
			props.offer?.css_options?.button?.marginRight != "0px" ||
        	props.offer?.css_options?.button?.marginBottom != "5px" ||
        	props.offer?.css_options?.button?.marginLeft != "0px") {
			props.updateCheckKeysValidity("buttonMargin", true);
		}
		else {
			props.updateCheckKeysValidity("buttonMargin", false);
		}

		if(props.offer?.css_options?.button?.paddingTop != "6px" || 
			props.offer?.css_options?.button?.paddingRight != "10px" ||
        	props.offer?.css_options?.button?.paddingBottom != "6px" ||
        	props.offer?.css_options?.button?.paddingLeft != "10px") {
			props.updateCheckKeysValidity("buttonPadding", true);
		}
		else {
			props.updateCheckKeysValidity("buttonPadding", false);
		}

		if(props.offer?.selectedView == "mobile") {
			props.updateCheckKeysValidity("mobileViewWidth", true);
			props.updateCheckKeysValidity("mainMarginTop", false);
			props.updateCheckKeysValidity("mainMarginBottom", false);
		}
		else {
			props.updateCheckKeysValidity("mobileViewWidth", false);
		}

		if(props.offer?.css_options?.button?.borderWidth && parseInt(props.offer?.css_options?.button?.borderWidth) > 0) {
			props.updateCheckKeysValidity("buttonBorderWidth", true);
		}
		else {
			props.updateCheckKeysValidity("buttonBorderWidth", false);
		}
	}


	return(
		<div>
			{
				props.offer.multi_layout == "compact" ? (
					<Compact offer={props.offer} checkKeysValidity={props.checkKeysValidity}/>
				) : props.offer.multi_layout == "stack" ? (
					<Stack offer={props.offer} checkKeysValidity={props.checkKeysValidity}/>
				) : props.offer.multi_layout == "carousel" ? (
					carouselLoading ? (
						<LegacyCard sectioned>
							<TextContainer>
								<SkeletonBodyText lines={6} />
							</TextContainer>
						</LegacyCard>
					) : (
						<Carousel offer={props.offer} checkKeysValidity={props.checkKeysValidity} updateCheckKeysValidity={props.updateCheckKeysValidity}/>
					)
				) : props.offer.multi_layout == "flex" ? (
					<Flex offer={props.offer} checkKeysValidity={props.checkKeysValidity}/>
				) : (
					<div></div>
				)
			}
		</div>
	);
};