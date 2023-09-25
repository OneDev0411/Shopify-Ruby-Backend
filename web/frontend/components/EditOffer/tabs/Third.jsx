import {
    LegacyCard,
    LegacyStack,
    ButtonGroup,
    Button,
    TextField,
    Select,
    RangeSlider,
    Collapsible,
    Grid,
    Stack} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { SketchPicker } from 'react-color';
import React from "react";

export function ThirdTab(props) {

    const [selected, setSelected] = useState(props.offer.css_options?.main?.borderStyle);
    const options = [
        { label: 'Compact', value: 'compact' },
        { label: 'Stack', value: 'stack' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Flex', value: 'flex' },
    ];

    const handleLayout = useCallback((value) => {
        props.updateOffer("multi_layout", value);
    }, []);
    const handleSelectChange = useCallback((value) => setSelected(value), []);

    // Space above the offer
    const handleAboveSpace = useCallback((newValue) => props.updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "main", "marginTop"), []);
    // Space below the offer
    const handleBelowSpace = useCallback((newValue) => props.updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "main", "marginBottom"), []);
    //Border style drop-down menu
    const handleBorderStyle = useCallback((newValue) => {
        props.updateNestedAttributeOfOffer(newValue, "css_options", "main", "borderStyle");
        setSelected(newValue);
    }, []);
    const BorderOptions = [
        { label: 'No border', value: 'none' },
        { label: 'Dotted lines', value: 'dotted' },
        { label: 'Dashed line', value: 'dashed' },
        { label: 'Solid line', value: 'solid' },
        { label: 'Double line', value: 'double' },
        { label: 'Groove line', value: 'groove' },
        { label: 'Ridge line', value: 'ridge' },
        { label: 'Inset line', value: 'inset' },
        { label: 'Outset line', value: 'outset' },
        { label: 'Hidden line', value: 'hidden' },
    ];

    //Border width
    const handleBorderWidth = useCallback((newValue) => props.updateNestedAttributeOfOffer(parseInt(newValue), "css_options", "main", "borderWidth"), []);

    //Border range slider
    const handlesetBorderRange = useCallback((newValue) => props.updateNestedAttributeOfOffer(parseInt(newValue), "css_options", "main", "borderRadius"), []);

    // Toggle for manually added color
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);


    //Font options
    // const [fontSelect, setFontSelect] = useState("Dummy font 1");
    const handleFontSelect = useCallback((value) => props.updateNestedAttributeOfOffer(value, "css_options", "text", "fontFamily"), []);
    const fontOptions = [
        { label: 'None', value: 'None' },
        { label: 'Arial', value: 'Arial' },
        { label: 'Caveat', value: 'Caveat' },
        { label: 'Confortaa', value: 'Confortaa' },
        { label: 'Comic Sans MS', value: 'Comic Sans MS' },
        { label: 'Courier New', value: 'Courier New' },
        { label: 'EB Garamond', value: 'EB Garamond' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Impact', value: 'Impact' },
        { label: 'Lexend', value: 'Lexend' },
        { label: 'Lobster', value: 'Lobster' },
        { label: 'Lora', value: 'Lora' },
        { label: 'Merriweather', value: 'Merriweather' },
        { label: 'Montserrat', value: 'Montserrat' },
        { label: 'Oswald', value: 'Oswald' },
        { label: 'Pacifico', value: 'Pacifico' },
        { label: 'Playfair Display', value: 'Playfair Display' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Spectral', value: 'Spectral' },
        { label: 'Trebuchet MS', value: 'Trebuchet MS' },
        { label: 'Verdana', value: 'Verdana' },
    ];

    //Font weight
    // const handleFontWeight = useCallback((newValue) => {
    //     props.updateShop(`${newValue}px`, "css_options", "text", "fontWeightInPixel");
    //     if (parseInt(newValue) > 400 && props.shop.css_options.text.fontWeight != "bold") {
    //         props.updateShop("bold", "css_options", "text", "fontWeight");
    //     }
    //     else if (parseInt(newValue) <= 400 && props.shop.css_options.text.fontWeight != "Normal" && props.shop.css_options.text.fontWeight != "inherit") {
    //         props.updateShop("Normal", "css_options", "text", "fontWeight");
    //     }
    // }, []);

    //Font sizes
    const handleFontSize = useCallback((newValue) => props.updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "text", "fontSize"), []);


    //Button options
    const handleBtnSelect = useCallback((value) => props.updateNestedAttributeOfOffer(value, "css_options", "button", "fontFamily"), []);
    const btnOptions = [
        { label: 'None', value: 'None' },
        { label: 'Arial', value: 'Arial' },
        { label: 'Caveat', value: 'Caveat' },
        { label: 'Confortaa', value: 'Confortaa' },
        { label: 'Comic Sans MS', value: 'Comic Sans MS' },
        { label: 'Courier New', value: 'Courier New' },
        { label: 'EB Garamond', value: 'EB Garamond' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Impact', value: 'Impact' },
        { label: 'Lexend', value: 'Lexend' },
        { label: 'Lobster', value: 'Lobster' },
        { label: 'Lora', value: 'Lora' },
        { label: 'Merriweather', value: 'Merriweather' },
        { label: 'Montserrat', value: 'Montserrat' },
        { label: 'Oswald', value: 'Oswald' },
        { label: 'Pacifico', value: 'Pacifico' },
        { label: 'Playfair Display', value: 'Playfair Display' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Spectral', value: 'Spectral' },
        { label: 'Trebuchet MS', value: 'Trebuchet MS' },
        { label: 'Verdana', value: 'Verdana' },
    ];

    //Button weight
    // const handleBtnWeight = useCallback((newValue) => {
    //     props.updateShop(`${newValue}px`, "css_options", "button", "fontWeightInPixel");
    //     if (parseInt(newValue) > 400 && props.shop.css_options.button.fontWeight != "bold") {
    //         props.updateShop("bold", "css_options", "button", "fontWeight");
    //     }
    //     else if (parseInt(newValue) <= 400 && props.shop.css_options.button.fontWeight != "Normal" && props.shop.css_options.button.fontWeight != "inherit") {
    //         props.updateShop("Normal", "css_options", "button", "fontWeight");
    //     }
    // }, []);

    //Button size
    const handleBtnSize = useCallback((newValue) => props.updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "button", "fontSize"), []);

    // Btn radius
    const [rangeValue, setRangeValue] = useState(20);
    const handleRangeSliderChange = useCallback((newValue) => props.updateNestedAttributeOfOffer(parseInt(newValue), "css_options", "button", "borderRadius"), []);

    //Sketch picker
    const handleOfferBackgroundColor = useCallback((newValue) => {
        props.updateNestedAttributeOfOffer(newValue.hex, "css_options", "main", "backgroundColor");
    }, []);

    return (
        <div>
            <LegacyCard title="Offer box" sectioned>
                <LegacyCard.Section>
                    {(props.offer.id != null && props.autopilotCheck?.autopilot_offer_id == props.offer.id) ? (
                        <>
                        </>
                        ) : (
                        <>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                    <Select
                                        label="Layout"
                                        options={options}
                                        onChange={handleLayout}
                                        value={props.offer.multi_layout}
                                    />
                                </Grid.Cell>
                            </Grid>
                            <br/>
                        </>
                        )
                    }
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <TextField
                                label="Space above offer"
                                type="number"
                                onChange={handleAboveSpace}
                                value={parseInt(props.offer.css_options?.main?.marginTop)}
                                suffix="px"
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <TextField
                                label="Space below offer"
                                type="number"
                                onChange={handleBelowSpace}
                                value={parseInt(props.offer.css_options?.main?.marginBottom)}
                                suffix="px"
                            />
                        </Grid.Cell>
                    </Grid>
                    <br />
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <Select label="Border style"
                                options={BorderOptions}
                                onChange={handleBorderStyle}
                                value={selected}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <TextField
                                label="Border width"
                                type="number"
                                onChange={handleBorderWidth}
                                value={parseInt(props.offer.css_options?.main?.borderWidth)}
                                suffix="px"
                            />
                        </Grid.Cell>
                    </Grid>
                    <br />
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <RangeSlider
                                label="Corner Radius"
                                value={parseInt(props.offer.css_options?.main?.borderRadius)}
                                onChange={handlesetBorderRange}
                                output
                            />
                        </Grid.Cell>
                    </Grid>
                </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard title="Color" sectioned>
                <LegacyCard.Section>
                    <ButtonGroup>
                        <Button
                            onClick={handleToggle}
                            ariaExpanded={open}
                            ariaControls="basic-collapsible"
                        >Manually select colors</Button>
                        {/*<Button primary>Choose template</Button>*/}
                    </ButtonGroup>
                    <Stack vertical>
                        <Collapsible
                            open={open}
                            id="basic-collapsible"
                            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                            expandOnPrint
                        >
                            <br /><SketchPicker onChange={handleOfferBackgroundColor} color={props.offer.css_options?.main?.backgroundColor} />
                            {/*<br/><SketchPicker onChange={handleOfferBackgroundColor} color={props.shop.css_options.main.backgroundColor} />*/}
                        </Collapsible>
                    </Stack>
                </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard title="Offer text" className="input-box" sectioned>
                <LegacyCard.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <Select
                                label="Font"
                                options={fontOptions}
                                onChange={handleFontSelect}
                                value={props.offer.css_options?.text?.fontFamily}
                            />
                        </Grid.Cell>
                        {/*<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <TextField
                                label="Weight"
                                type="number"
                                suffix="px"
                                autoComplete="off"
                                onChange={handleFontWeight}
                                value={parseInt(props.shop.css_options.text.fontWeightInPixel)}
                            />
                        </Grid.Cell>*/}
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <TextField
                                label="Size"
                                type="number"
                                suffix="px"
                                autoComplete="off"
                                onChange={handleFontSize}
                                value={parseInt(props.offer.css_options?.text?.fontSize)}
                            />
                        </Grid.Cell>
                    </Grid>
                </LegacyCard.Section>
                <LegacyCard.Section title="Button text">
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <Select
                                label="Font"
                                options={btnOptions}
                                onChange={handleBtnSelect}
                                value={props.offer.css_options?.button?.fontFamily}
                            />
                        </Grid.Cell>
                        {/*<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <TextField
                                label="Weight"
                                type="number"
                                suffix="px"
                                autoComplete="off"
                                onChange={handleBtnWeight}
                                value={parseInt(props.shop.css_options.button.fontWeightInPixel)}
                            />
                        </Grid.Cell>*/}
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <TextField
                                label="Size"
                                type="number"
                                suffix="px"
                                autoComplete="off"
                                onChange={handleBtnSize}
                                value={parseInt(props.offer.css_options?.button?.fontSize)}
                            />
                        </Grid.Cell>
                    </Grid>
                    <br />
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <RangeSlider
                                label="Border Radius"
                                value={props.offer.css_options?.button?.borderRadius}
                                onChange={handleRangeSliderChange}
                                output
                            />
                        </Grid.Cell>
                    </Grid>
                </LegacyCard.Section>
            </LegacyCard>
            <div className="space-4"></div>
            <LegacyStack distribution="center">
                <ButtonGroup>
                    <Button onClick={() => props.saveDraft()}>Save Draft</Button>
                    <Button primary disabled={props.enablePublish} onClick={() => props.publishOffer()}>Publish</Button>
                </ButtonGroup>
            </LegacyStack>
            <div className="space-10"></div>
        </div>
    );
}