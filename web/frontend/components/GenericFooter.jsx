import {Text, Icon, Link } from "@shopify/polaris";
import {ExternalMinor } from '@shopify/polaris-icons';
import {infoMinor} from "../assets/index.js";
export function GenericFooter(props) {
  return (
    <div className="custom-footer">
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src={infoMinor} style={{marginRight: '8px'}} />
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
