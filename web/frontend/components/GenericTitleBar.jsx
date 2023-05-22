import {DisplayText, Image } from "@shopify/polaris";

export function GenericTitleBar(props) {
	return (
		<>
	        <div style={{ display: 'flex', height: '24px'}}>
	          <Image
	            src={props.image}
	            alt="Header Image"
	            className="offer-header-img"
	          />
	          <div className="offer-header-title">
	            <DisplayText element="h1">
	              {props.title}
	            </DisplayText>
	          </div>
	        </div>
    	</>
	)
};
