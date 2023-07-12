import { forwardRef, useState, useEffect, useRef } from "react";
import { 
	Text,
	LegacyCard,
	Grid
} from '@shopify/polaris';
import TemplateComponent from 'react-mustache-template-component';
import themeCss from '../../assets/theme.css';


export default function Compact(props) {


	const template = `<div id="nudge-offer-{{ id }}" style="background-color: {{ css_options.main.backgroundColor }}; color: {{ css_options.main.color}}; {{#mainMarginTop }} margin-top: {{css_options.main.marginTop}}; {{/mainMarginTop}} {{#mainMarginBottom }} margin-bottom: {{css_options.main.marginBottom}}; {{/mainMarginBottom}} {{#mainBorderWidth}} border: {{css_options.main.borderWidth}}px {{css_options.main.borderStyle}}; {{/mainBorderWidth}} {{#mainBorderRadius}} border-radius: {{css_options.main.borderRadius}}px; {{/mainBorderRadius}} {{ #mobileViewWidth }} width: 320px {{/ mobileViewWidth}}" class="nudge-offer custom with-image  multi compact" data-offerid="163416">
					{{#show_nothanks}}<a class="dismiss-button" onclick="InCartUpsell.dismissOffer({{ id }}); return false;">&times;</a>{{/show_nothanks}}
	        <div class="icu-offer-title"style="text-align: center; {{#textFontWeight}} font-weight: {{css_options.text.fontWeight}}; {{/textFontWeight}}{{#textFontFamily}} font-family: {{css_options.text.fontFamily}}; {{/textFontFamily}} {{#textFontSize}} font-size: {{css_options.text.fontSize}}; {{/textFontSize}}">
	            <strong>{{{ text }}}</strong>
	        </div>
	        <div class="icu-offer-items variants">
	        	{{#offerable_product_details}}
	          <div class="nudge-wrapper" style="text-align: center">

	          	<div style="display: flex; justify-content:center"> 
	          		{{#show_product_image}}           
                <img src="//{{ medium_image_url }}" class="product-image medium">
                {{/show_product_image}}
	            </div>
	            {{#link_to_product }}
					    	<a href="/products/{{ url }}">
					  	{{/link_to_product}}
	            <div class="product-title-wrapper">
	                  <span class="product-title">
	                    {{ title }}:
	                  </span>
	            </div>
	            <div>
	            		{{#show_product_price}}
	            		{{#show_compare_at_price}}
	            		{{#available_json_variants.0.price_is_minor_than_compare_at_price}}
	                <span class="product-price-wrapper compare-at-price money">
	                    {{{ available_json_variants.0.compare_at_price }}}
	                </span>
	                {{/available_json_variants.0.price_is_minor_than_compare_at_price}}
	              	{{/show_compare_at_price}}
	              	{{/show_product_price}}

	                {{#show_product_price}}
	                <span class="product-price-wrapper money">
	                    {{{ available_json_variants.0.unparenthesized_price }}}
	                </span>
	                {{/show_product_price}}  
	            </div>
	            {{#link_to_product }}
					    	</a>
					  	{{/link_to_product}}
	            <div action="/cart/add" class="variants" id="product-actions-{{ id }}" method="post">
	            	{{#show_custom_field}}
							  	<input class="custom-field {{#hide_variants_wrapper }} inline{{/hide_variants_wrapper }}" type="text" name="properties[{{custom_field_name}}]" id="icu-pcf1" placeholder="{{custom_field_placeholder}}" />
							  {{#custom_field_2_name}}
							  	<input class="custom-field" type="text" name="properties[{{custom_field_2_name}}]" id="icu-pcf2" placeholder="{{custom_field_2_placeholder}}" />
							  {{/custom_field_2_name}}
							  {{#custom_field_3_name}}
							  <input class="custom-field" type="text" name="properties[{{custom_field_3_name}}]" id="icu-pcf3" placeholder="{{custom_field_3_placeholder}}" />
							  {{/custom_field_3_name}}
							  {{/show_custom_field}}
	              <span class="variants-wrapper" {{#hide_variants_wrapper }} style="display: none" {{/hide_variants_wrapper }}>
							    <select id="product-select-{{ offer_id }}" name="id-{{ offer_id }}" onchange="InCartUpsell.handleCollectionChange(this, {{ offer_id }})">
							      {{#available_json_variants}}
							      <option value="{{ id }}"
							              data-image-url="{{ image_url }}"
							              data-variant-compare-at-price="{{{ compare_at_price }}}"
							              data-variant-price="{{{ unparenthesized_price }}}"
							              {{#currencies}}
							                data-variant-price-{{label}}="{{{ price }}}"
							                data-variant-compare-at-price-{{label}}="{{{ compare_at_price }}}"
							              {{/currencies}}>
							        {{ title }} {{#show_variant_price}} {{{ price }}} {{/show_variant_price}}
							      </option>
							      {{/available_json_variants}}
							    </select>
							  </span>
	              {{#show_variant_price}}
							    {{#hide_variants_wrapper}}
							      <span class="single-variant-price money">{{{ available_json_variants.0.price }}}</span>
							    {{/hide_variants_wrapper }}
							  {{/show_variant_price}}
							  {{#show_quantity_selector}}
							  <span class="quantity-wrapper">
							    <select id="quantity-select" name="quantity">
							      <option value="1">1</option>
							      <option value="2">2</option>
							      <option value="3">3</option>
							      <option value="4">4</option>
							      <option value="5">5</option>
							      <option value="6">6</option>
							      <option value="7">7</option>
							      <option value="8">8</option>
							      <option value="9">9</option>
							      <option value="10">10</option>
							    </select>
							  </span>
							  {{/show_quantity_selector}} {{^show_quantity_selector}}
							  <input name="quantity" type="hidden" value="1"></input>
							  {{/show_quantity_selector}}
							  {{#recharge_subscription_id}}
							  <input name="properties[interval_unit]" type="hidden" value="{{ interval_unit }}"></input>
							  <input name="properties[interval_frequency]" type="hidden" value="{{ interval_frequency }}"></input>
							  <input name="properties[recharge_subscription_id]" type="hidden" value="{{ recharge_subscription_id }}"></input>
							  {{/recharge_subscription_id}}
	              {{#show_spinner}}
							  <button type="submit" name="add" class="bttn product-price" style="background-color: {{ css_options.button.backgroundColor }}; color: {{ css_options.button.color  }}; {{#buttonBorderRadius}} border-radius: {{css_options.button.borderRadius}}px; {{/buttonBorderRadius}} {{#buttonFontWeight}} font-weight: {{css_options.button.fontWeight}}; {{/buttonFontWeight}} {{#buttonFontFamily}} font-family: {{css_options.button.fontFamily}}; {{/buttonFontFamily}} {{#button.fontSize}} {{css_options.button.fontSize}} {{/button.fontSize}}">{{{ cta }}}</button>
							  {{/show_spinner}}
							  {{^show_spinner}}
							  <input type="submit" name="add" class="bttn product-price" value="{{{ cta }}}" style="background-color: {{ css_options.button.backgroundColor }}; color: {{ css_options.button.color  }}; {{#buttonBorderRadius}} border-radius: {{css_options.button.borderRadius}}px; {{/buttonBorderRadius}} {{#buttonFontWeight}} font-weight: {{css_options.button.fontWeight}}; {{/buttonFontWeight}} {{#buttonFontFamily}} font-family: {{css_options.button.fontFamily}}; {{/buttonFontFamily}} {{#buttonFontSize}} font-size: {{css_options.button.fontSize}} {{/buttonFontSize}}" ></input>
							  {{/show_spinner}}
	            </div>
	        	</div>
			      {{/offerable_product_details}}
	        </div>
	</div>`
	

	return( 
		<TemplateComponent template={template} data={({...props.offer, ...props.shop, ...props.checkKeysValidity})}/>
	);
};