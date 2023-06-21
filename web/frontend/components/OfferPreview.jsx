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


export function OfferPreview(props) {


	const [checkKeysValidity, setCheckKeysValidity] = useState({});

	function initCarousal() {
		var mySiema, prev, next;
		if (document.querySelector(".offer-collection") && document.querySelector('.js-prev')) {
      debugger;
      if (mySiema) {
        mySiema.destroy(true);
      }
      mySiema = new Siema({
        selector: '.offer-collection',
        loop: true
      });
      prev = document.querySelector('.js-prev');
      prev.addEventListener('click', function () { mySiema.prev() });
      next = document.querySelector('.js-next');
      next.addEventListener('click', function () { mySiema.next() });
    }
	}

	// runs on first render and when shop attribute changes to apply checks on the attribute for the layout

	useEffect(() => {
		if(props.shop.css_options.main.marginTop && parseInt(props.shop.css_options.main.marginTop) > 0) {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, mainMarginTop: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, mainMarginTop: false };
	        });
		}

		if(props.shop.css_options.main.marginBottom && parseInt(props.shop.css_options.main.marginBottom) > 0) {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, mainMarginBottom: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, mainMarginbottom: false };
	        });
		}

		if(props.shop.css_options.main.borderWidth && parseInt(props.shop.css_options.main.borderWidth) > 0) {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, mainBorderWidth: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, mainBorderWidth: false };
	        });
		}

		if(props.shop.css_options.main.borderRadius && parseInt(props.shop.css_options.main.borderRadius) != 4) {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, mainBorderRadius: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, mainBorderRadius: false };
	        });
		}

		if(props.shop.css_options.button.borderRadius && parseInt(props.shop.css_options.button.borderRadius) != 4) {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonBorderRadius: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonBorderRadius: false };
	        });
		}

		if(props.shop.css_options.button.fontWeight && props.shop.css_options.button.fontWeight != "bold") {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonFontWeight: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonFontWeight: false };
	        });
		}

		if(props.shop.css_options.button.fontFamily && (props.shop.css_options.button.fontFamily != "inherit" && props.shop.css_options.button.fontFamily != "")) {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonFontFamily: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonFontFamily: false };
	        });
		}

		if(props.shop.css_options.button.fontSize && parseInt(props.shop.css_options.button.fontSize) > 0) {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonFontSize: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonFontSize: false };
	        });
		}

		if(props.shop.css_options.button.width && (props.shop.css_options.button.width != "auto" && props.shop.css_options.button.width != "")) {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonWidth: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonWidth: false };
	        });
		}

		if(props.shop.css_options.button.textTransform && props.shop.css_options.button.textTransform != "inherit") {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonTextTransform: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonTextTransform: false };
	        });
		}

		if(props.shop.css_options.button.letterSpacing && props.shop.css_options.button.letterSpacing != "0") {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonLetterSpacing: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonLetterSpacing: false };
	        });
		}

		if(props.shop.css_options.text.fontWeight != "bold") {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, textFontWeight: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, textFontWeight: false };
	        });
		}

		if(props.shop.css_options.text.fontFamily != "inherit") {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, textFontFamily: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, textFontFamily: false };
	        });
		}

		if(props.shop.css_options.text.fontSize != "16px") {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, textFontSize: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, textFontSize: false };
	        });
		}

		if(props.shop.css_options.button.marginTop != "0px" || 
			props.shop.css_options.button.marginRight != "0px" ||
        	props.shop.css_options.button.marginBottom != "5px" ||
        	props.shop.css_options.button.marginLeft != "0px") {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonMargin: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonMargin: false };
	        });
		}

		if(props.shop.css_options.button.paddingTop != "6px" || 
			props.shop.css_options.button.paddingRight != "10px" ||
        	props.shop.css_options.button.paddingBottom != "6px" ||
        	props.shop.css_options.button.paddingLeft != "10px") {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonPadding: true };
	        });
		}
		else {
			setCheckKeysValidity(previousState => {
	        	return { ...previousState, buttonPadding: false };
	        });
		}
			debugger;
	},[props.shop]);



	if(props.offer.multi_layout == "compact") {
		props.shop.checkKeysValidity = checkKeysValidity;
		debugger;
		return <Compact offer={props.offer} shop={props.shop}/>;
	}
	else if(props.offer.multi_layout == "stack") {
		props.shop.checkKeysValidity = checkKeysValidity;
		debugger;
		return <Stack offer={props.offer} shop={props.shop}/>
	}
	else if(props.offer.multi_layout == "carousel") {
		initCarousal();
		props.shop.checkKeysValidity = checkKeysValidity;
		debugger;
		return <Carousel offer={props.offer} shop={props.shop}/>
	}
	else if(props.offer.multi_layout == "flex") {
		props.shop.checkKeysValidity = checkKeysValidity;
		debugger;
		return <Flex offer={props.offer} shop={props.shop}/>
	}
};