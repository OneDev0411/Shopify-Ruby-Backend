import {Text, Icon, Link } from "@shopify/polaris";
import {ExternalMinor } from '@shopify/polaris-icons';

export function GenericFooter(props) {
  return (
    <div className="custom-footer">
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src={"https://incartupsell-assets.b-cdn.net/Images/info_minor.svg"} style={{marginRight: '8px'}} />
        <Text as="p">
          {props.text}
          {props.linkText ? (
            <Link url={props.linkUrl} target="_blank">{props.linkText}.
              <Icon
                source={ExternalMinor}
                color="interactive"
              />
            </Link>
          ): null}
        </Text>
      </div>
    </div>
	)
};
