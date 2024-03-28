import {
    LegacyCard,
    TextField,
    Select,
    RangeSlider,
    Grid,
    Text,
} from "@shopify/polaris";
import { useCallback, useContext } from "react";
import React from "react";
import { OfferBorderOptions, OfferFontOptions } from "../../../shared/constants/EditOfferOptions";
import {OfferContext} from "../../../contexts/OfferContext.jsx";

const OfferText = () => {
    const {offer, updateNestedAttributeOfOffer} = useContext(OfferContext);

    //Font options
    // const [fontSelect, setFontSelect] = useState("Dummy font 1");
    const handleFontSelect = useCallback((value) => updateNestedAttributeOfOffer(value, "css_options", "text", "fontFamily"), []);

    //Font sizes
    const handleFontSize = useCallback((newValue) => updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "text", "fontSize"), []);


    //Button options
    const handleBtnSelect = useCallback((value) => updateNestedAttributeOfOffer(value, "css_options", "button", "fontFamily"), []);

    //Button size
    const handleBtnSize = useCallback((newValue) => updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "button", "fontSize"), []);

    // Btn radius
    const handleRangeSliderChange = useCallback((newValue) => updateNestedAttributeOfOffer(parseInt(newValue), "css_options", "button", "borderRadius"), []);

    const handleBtnBorderWidth =useCallback((newValue) => {
        const numericValue = parseInt(newValue);
        if (isNaN(numericValue) || numericValue >= 0 && numericValue <= 5) {
          updateNestedAttributeOfOffer(
            parseInt(newValue),
            "css_options",
            "button",
            "borderWidth"
          );
        }
    }, []);

    //Button Border style drop-down menu
    const handleBtnBorderStyle = useCallback((newValue) => {
        updateNestedAttributeOfOffer(newValue, "css_options", "button", "borderStyle");
    }, []);

    return (
        <LegacyCard title="Offer text" className="input-box" sectioned>

            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Select
                        label="Font"
                        options={OfferFontOptions}
                        onChange={handleFontSelect}
                        value={offer.css_options?.text?.fontFamily}
                    />
                </Grid.Cell>

                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <TextField
                        label="Size"
                        type="number"
                        suffix="px"
                        autoComplete="off"
                        onChange={handleFontSize}
                        value={parseInt(offer.css_options?.text?.fontSize)}
                    />
                </Grid.Cell>
            </Grid>
            <hr className="legacy-card-hr" />
            <div style={{paddingBottom: '20px'}}>
                <Text variant="headingMd" as="h2">Button text</Text>
            </div>
            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Select
                        label="Font"
                        options={OfferFontOptions}
                        onChange={handleBtnSelect}
                        value={offer.css_options?.button?.fontFamily}
                    />
                </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <TextField
                            label="Size"
                            type="number"
                            suffix="px"
                            autoComplete="off"
                            onChange={handleBtnSize}
                            value={parseInt(offer.css_options?.button?.fontSize)}
                        />
                    </Grid.Cell>
                </Grid>
                <br />
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <RangeSlider
                            label="Border Radius"
                            value={offer.css_options?.button?.borderRadius || 0}
                            min={0}
                            max={16}
                            onChange={handleRangeSliderChange}
                            output
                        />
                </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <TextField
                            label="Border Width"
                            type="number"
                            suffix="px"
                            autoComplete="off"
                            onChange={handleBtnBorderWidth}
                            value={parseInt(offer.css_options?.button?.borderWidth)}
                        />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                        <Select label="Border style"
                            options={OfferBorderOptions}
                            onChange={handleBtnBorderStyle}
                            value={offer?.css_options?.button?.borderStyle}
                        />
                    </Grid.Cell>
            </Grid>
        </LegacyCard>
    );
}

export default OfferText;
