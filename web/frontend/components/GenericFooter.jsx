import { Text, Icon, Link, LegacyStack } from "@shopify/polaris";
import {
  AlertMinor, ExternalSmallMinor
} from '@shopify/polaris-icons';

export function GenericFooter(props) {
	return (
		<>
    <style>
    {
      `.Polaris-Link {
          display: inline-flex;
        }`
    }
    </style>
    <div style={{ marginTop: '60px'}}></div>
		<div style={{display: 'flex', justifyContent: 'center'}}> 
			<LegacyStack>
          <Icon
            source={AlertMinor}
            color="base"
          />
          <Text size="small">
            {props.text}
            {props.linkText ? (
              <Link url={props.linkUrl} target="blank">{props.linkText}.
                <Icon
                  source={ExternalSmallMinor}
                  color="base"
                />
              </Link>
            ): null}
          </Text>
      </LegacyStack>
			<div className="space-10"></div>
    </div>
		</>
	)
};
