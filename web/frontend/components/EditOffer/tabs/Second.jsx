import { Button, LegacyStack } from "@shopify/polaris";
import React from "react";
import { ChoosePlacement, DisplayConditions } from "../../organisms/index.js";

export function SecondTab(props) {
    return (
        <div id="polaris-placement-cards">
            <ChoosePlacement
                autopilotCheck={props.autopilotCheck}
                enableOrDisablePublish={props.enableOrDisablePublish}
            />
            <div className="space-10"/>

            <DisplayConditions autopilotCheck={props.autopilotCheck} />
            <div className="space-10"/>

            <div className="space-4"></div>
            <LegacyStack distribution="center">
                <Button onClick={props.handleTabChange}>Continue to Appearance</Button>
            </LegacyStack>
            <div className="space-10"></div>
        </div>
    );
}

