import { LegacyStack, ButtonGroup, Button } from "@shopify/polaris";
import { useContext } from "react";
import React from "react";
import {OfferContext} from "../../../contexts/OfferContext.jsx";
import { AppearanceColor, OfferBox, OfferText } from "../../organisms/index.js";

export function ThirdTab(props) {
    const {offer} = useContext(OfferContext);

    return (
        <div id="appearance-offers">
            <OfferBox autopilotCheck={props.autopilotCheck} />
            <div className="space-10" />

            <AppearanceColor />
            <div className="space-10" />

            <OfferText />
            <div className="space-10"></div>
            {(offer?.advanced_placement_setting?.advanced_placement_setting_enabled) ? (
                <>
                    <LegacyStack distribution="center">
                        <Button onClick={props.handleTabChange}>Continue to Advanced</Button>
                    </LegacyStack>
                </>) : (
                <LegacyStack distribution="center">
                    <ButtonGroup>
                        <Button onClick={() => props.saveDraft()}>Save Draft</Button>
                        <Button primary onClick={() => props.publishOffer()}>Publish</Button>
                    </ButtonGroup>
                </LegacyStack>
                )}
            <div className="space-10"></div>
        </div>
    );
}