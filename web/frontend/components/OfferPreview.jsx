import { forwardRef, useState, useEffect, useRef } from "react";
import { 
	Text,
	LegacyCard,
	Grid
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
	},[props.shop]);

	useEffect(() => {
		setCarouselLoading(true);
		setTimeout(function(){ setCarouselLoading(false) }, 500);
	}, [props.offer]);

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
						<div style={{ marginTop: props.shop.css_options?.main.marginTop, marginLeft: '40%' }}>
							<Spinner></Spinner>
						</div>
					) : (
						<Carousel offer={props.offer} shop={props.shop} checkKeysValidity={props.checkKeysValidity} updateCheckKeysValidity={props.updateCheckKeysValidity}/>
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