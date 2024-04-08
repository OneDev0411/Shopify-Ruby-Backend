import {
    LegacyCard,
    TextField,
    Select,
    RangeSlider,
    Grid,
} from "@shopify/polaris";
import { useCallback, useContext } from "react";
import React from "react";
import { OfferStyleOptions, OfferBorderOptions } from "../../../shared/constants/EditOfferOptions";
import {OfferContext} from "../../../contexts/OfferContext.jsx";

const OfferBox = (props) => {
    const {offer, updateOffer, updateNestedAttributeOfOffer} = useContext(OfferContext);

    const handleLayout = useCallback((value) => {
        updateOffer("multi_layout", value);
    }, []);

    // Space above the offer
    const handleAboveSpace = useCallback((newValue) => {
        const numericValue = parseInt(newValue);
        if (isNaN(numericValue) || numericValue > 0 && numericValue <= 100) {
          updateNestedAttributeOfOffer(
            `${newValue}px`,
            "css_options",
            "main",
            "marginTop"
          );
        }
      }, []);
    // Space below the offer
    const handleBelowSpace = useCallback((newValue) => {
        const numericValue = parseInt(newValue);
        if (isNaN(numericValue) || numericValue > 0 && numericValue <= 100) {
          updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "main", "marginBottom");
        }
      }, []);
    //Border style drop-down menu
    const handleBorderStyle = useCallback((newValue) => {
        updateNestedAttributeOfOffer(newValue, "css_options", "main", "borderStyle");
    }, []);

    //Border width
    const handleBorderWidth = useCallback((newValue) => {
        const numericValue = parseInt(newValue);
        if (isNaN(numericValue) || numericValue >= 0 && numericValue <= 10) {
          updateNestedAttributeOfOffer(
            parseInt(newValue),
            "css_options",
            "main",
            "borderWidth"
          );
        }
    }, []);

    //Border range slider
    const handlesetBorderRange = useCallback((newValue) => updateNestedAttributeOfOffer(parseInt(newValue), "css_options", "main", "borderRadius"), []);

    return (
        <LegacyCard title="Offer box" sectioned>
                {(offer.id != null && props.autopilotCheck?.autopilot_offer_id == offer.id) ? (
                    <>
                    </>
                    ) : (
                    <>
                        <Grid>
                            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
                                <Select
                                    label="Layout"
                                    options={OfferStyleOptions}
                                    onChange={handleLayout}
                                    value={offer.multi_layout}
                                />
                            </Grid.Cell>
                        </Grid>
                        <br/>
                    </>
                    )
                }
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                        <TextField
                            label="Space above offer"
                            type="number"
                            onChange={handleAboveSpace}
                            value={parseInt(offer.css_options?.main?.marginTop)}
                            suffix="px"
                            placeholder="1-100px"
                        />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                        <TextField
                            label="Space below offer"
                            type="number"
                            onChange={handleBelowSpace}
                            value={parseInt(offer.css_options?.main?.marginBottom)}
                            suffix="px"
                            placeholder="1-100px"
                        />
                    </Grid.Cell>
                </Grid>
                <br />
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                        <Select label="Border style"
                            options={OfferBorderOptions}
                            onChange={handleBorderStyle}
                            value={offer?.css_options?.main?.borderStyle}
                        />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                        <TextField
                            label="Border width"
                            type="number"
                            onChange={handleBorderWidth}
                            value={parseInt(offer.css_options?.main?.borderWidth)}
                            suffix="px"
                            placeholder="0-10px"
                        />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                        <div className="range-slider-container">
                            <RangeSlider
                                label="Corner Radius"
                                value={parseInt(offer.css_options?.main?.borderRadius)}
                                min={0}
                                max={50}
                                onChange={handlesetBorderRange}
                                output
                            />
                        </div>
                    </Grid.Cell>
                </Grid>
        </LegacyCard>
    );
}

export default OfferBox;
