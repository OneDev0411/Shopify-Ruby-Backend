import React, {useCallback, useEffect, useState, useContext} from "react";
import { OfferContext } from "../../../contexts/OfferContext.jsx";

import { Button, LegacyStack, Spinner } from "@shopify/polaris";

import { OfferContent, DisplayOptions, OfferProduct } from "../../organisms/index.js";


export function FirstTab(props) {
    const { offer } = useContext(OfferContext);
    const [isLoading, setIsLoading] = useState(false);

    const publishButtonFuntional =
        props.enableOrDisablePublish &&
        useCallback((newValue) => props.enableOrDisablePublish(newValue), []);

    useEffect(() => {
        if (publishButtonFuntional) {
            publishButtonFuntional(!(offer.offerable_product_details.length > 0 && offer.title !== '' && (offer.uses_ab_test ? (offer.text_b.length > 0 && offer.cta_b.length > 0) : true)))
        }
    }, [offer.offerable_product_details.length, offer.title, offer.uses_ab_test, offer.text_b, offer.cta_b]);

    return (
        <div id="first-tab-offer">
            {isLoading ? (
                <div style={{
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}>
                    <Spinner size="large" color="teal"/>
                </div>
            ) : (
                <>
                    <OfferProduct
                        setIsLoading={setIsLoading}
                        autopilotCheck={props.autopilotCheck}
                        setAutopilotCheck={props.setAutopilotCheck}
                        initialVariants={props.initialVariants}
                        updateInitialVariants={props.updateInitialVariants}
                        updateCheckKeysValidity={props.updateCheckKeysValidity}
                        initialOfferableProductDetails={props.initialOfferableProductDetails}
                    />
                    <div className="space-10" />

                    <OfferContent
                        autopilotCheck={props.autopilotCheck}
                        updateCheckKeysValidity={props.updateCheckKeysValidity}
                    />
                    <div className="space-10"/>

                    <DisplayOptions />
                    <div className="space-10"/>

                    <div className="space-4"/>
                    <LegacyStack distribution="center">
                        <Button onClick={props.handleTabChange}>Continue To Placement</Button>
                    </LegacyStack>

                    <div className="space-10"></div>
                </>
            )}
        </div>
    );
}
