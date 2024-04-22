import { useState, useCallback } from 'react';
import { Button, LegacyStack } from "@shopify/polaris";
import React from "react";
import { ChoosePlacement, DisplayConditions } from "../../organisms/index.js";

export function SecondTab(props) {
    const [disableCheckoutInfo, setDisableCheckoutInfo] = useState('')

    const changeDisableCheckoutInfo = useCallback((value) => {
         setDisableCheckoutInfo(value);
    }, [disableCheckoutInfo]);

    return (
        <div id="polaris-placement-cards">
            <ChoosePlacement
                autopilotCheck={props.autopilotCheck}
                enableOrDisablePublish={props.enableOrDisablePublish}
                changeDisableCheckoutInfo={changeDisableCheckoutInfo}
            />
            <div className="space-10"/>

            <DisplayConditions 
                autopilotCheck={props.autopilotCheck}
                disableCheckoutInfo={disableCheckoutInfo} 
            />
            <div className="space-10"/>

            <div className="space-4"></div>
            <LegacyStack distribution="center">
                <Button onClick={props.handleTabChange}>Continue to Appearance</Button>
            </LegacyStack>
            <div className="space-10"></div>
        </div>
    );
}

