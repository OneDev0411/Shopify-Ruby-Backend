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
    Text,
    Stack} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { SketchPicker } from 'react-color';
import React from "react";
import CollapsibleColorPicker from "../../CollapsibleColorPicker";
import tinycolor from "tinycolor2";
import "../../../components/stylesheets/colorPickerStyles.css";
import ColorSwatchSelector from "../../ColorSwatchSelector";

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
    const handleAboveSpace = useCallback((newValue) => {
        const numericValue = parseInt(newValue);
        if (isNaN(numericValue) || numericValue > 0 && numericValue <= 100) {
          props.updateNestedAttributeOfOffer(
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
          props.updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "main", "marginBottom");
        }
      }, []);
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

    const [openEditMenu, setOpenEditMenu] = useState(false)
    const handleMenuToggle = useCallback(() => {
        setOpenEditMenu((openEditMenu) => !openEditMenu)
        setOpen({
            cardColorPicker: false,
            borderColorPicker: false,
            buttonColorPicker: false,
            textColorPicker: false,
            btnTextColorPicker: false,
            btnBorderColorPicker: false,
        });
    }, [])

    // Toggle for color pickers
    const [open, setOpen] = useState({
        cardColorPicker: false,
        borderColorPicker: false,
        buttonColorPicker: false,
        textColorPicker: false,
        btnTextColorPicker: false,
        btnBorderColorPicker: false,
    });
    
    const handleToggle = useCallback(
        (colorPickerName) => {
            setOpen((prevState) => ({
                ...prevState,
                [colorPickerName]: !prevState[colorPickerName],
          }));
        },
        [open]
    );

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
    const handleColorChanges = useCallback((newValue, comp, property) => {
        const rgbColor = tinycolor({ h: newValue.hue, s: newValue.saturation, v: newValue.brightness, a: newValue.alpha }).toRgb();
        const hexColor = tinycolor(rgbColor).toHex();
        props.updateNestedAttributeOfOffer(`#${hexColor}`, "css_options", `${comp}`, `${property}`);
    }, []);

    const handleTextFieldChanges = useCallback((newValue, comp, property) => {
        props.updateNestedAttributeOfOffer(newValue, "css_options", `${comp}`, `${property}`);
    }, []);

    const hexToHsba = (hexColor) =>  {
        const color = tinycolor(hexColor);
        const hsbColor = color.toHsv();
        const alpha = color.getAlpha();
        return {
          hue: hsbColor.h,
          saturation: hsbColor.s,
          brightness: hsbColor.v,
          alpha: alpha,
        };
    }

    return (
        <div id="appearance-offers">
            <LegacyCard title="Offer box" sectioned>
                    {(props.offer.id != null && props.autopilotCheck?.autopilot_offer_id == props.offer.id) ? (
                        <>
                        </>
                        ) : (
                        <>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
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
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                            <TextField
                                label="Space above offer"
                                type="number"
                                onChange={handleAboveSpace}
                                value={parseInt(props.offer.css_options?.main?.marginTop)}
                                suffix="px"
                                placeholder="1-100px"
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                            <TextField
                                label="Space below offer"
                                type="number"
                                onChange={handleBelowSpace}
                                value={parseInt(props.offer.css_options?.main?.marginBottom)}
                                suffix="px"
                                placeholder="1-100px"
                            />
                        </Grid.Cell>
                    </Grid>
                    <br />
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                            <Select label="Border style"
                                options={BorderOptions}
                                onChange={handleBorderStyle}
                                value={props.offer?.css_options?.main?.borderStyle}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                            <TextField
                                label="Border width"
                                type="number"
                                onChange={handleBorderWidth}
                                value={parseInt(props.offer.css_options?.main?.borderWidth)}
                                suffix="px"
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                            <div className="range-slider-container">
                                <RangeSlider
                                    label="Corner Radius"
                                    value={parseInt(props.offer.css_options?.main?.borderRadius)}
                                    onChange={handlesetBorderRange}
                                    output
                                />
                            </div>
                        </Grid.Cell>
                    </Grid>
            </LegacyCard>
            <div className="space-10" />

            <LegacyCard title="Color" sectioned>
                <Stack vertical>
                    <Button>Choose Template</Button>
                    <Button
                        onClick={handleMenuToggle}
                        ariaExpanded={openEditMenu}
                        ariaControls="basic-menu-collapsible"
                    >Manually Edit Colors</Button>
                    <Collapsible
                        open={openEditMenu}
                        id="basic-menu-collapsible"
                        transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                        expandOnPrint
                    >
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                <div className="color-picker-container">
                                    <TextField
                                        label="Card"
                                        onChange={(newValue) => handleTextFieldChanges(newValue, 'main', 'backgroundColor')}
                                        value={props.offer.css_options?.main?.backgroundColor}
                                        connectedRight={
                                            <ColorSwatchSelector
                                                onClick={() => handleToggle('cardColorPicker')}
                                                backgroundColor={props.offer.css_options?.main?.backgroundColor}
                                                ariaExpanded={open.cardColorPicker}
                                                ariaControls="basic-card-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style">
                                        <CollapsibleColorPicker
                                            open={open.cardColorPicker}
                                            id="basic-card-collapsible"
                                            color={hexToHsba(props.offer.css_options?.main?.backgroundColor)}
                                            onChange={(newValue) => handleColorChanges(newValue, 'main', 'backgroundColor')}
                                        />
                                    </div>
                                </div>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                <div className="color-picker-container">
                                    <TextField
                                        label="Border"
                                        onChange={(newValue) => handleTextFieldChanges(newValue, 'main', 'borderColor')}
                                        value={props.offer.css_options?.main?.borderColor}
                                        connectedRight={
                                            <ColorSwatchSelector
                                                onClick={() => handleToggle('borderColorPicker')}
                                                backgroundColor={props.offer.css_options?.main?.borderColor}
                                                ariaExpanded={open.borderColorPicker}
                                                ariaControls="basic-border-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style">
                                        <CollapsibleColorPicker
                                            open={open.borderColorPicker}
                                            id="basic-border-collapsible"
                                            color={hexToHsba(props.offer.css_options?.main?.borderColor)}
                                            onChange={(newValue) => handleColorChanges(newValue, 'main', 'borderColor')}
                                        />
                                    </div>
                                </div>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                <div className="color-picker-container">
                                    <TextField
                                        label="Button"
                                        onChange={(newValue) => handleTextFieldChanges(newValue, 'button', 'backgroundColor')}
                                        value={props.offer.css_options?.button?.backgroundColor}
                                        connectedRight={
                                            <ColorSwatchSelector 
                                                onClick={() => handleToggle('buttonColorPicker')}
                                                backgroundColor={props.offer.css_options?.button?.backgroundColor}
                                                ariaExpanded={open.buttonColorPicker}
                                                ariaControls="basic-button-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style">
                                        <CollapsibleColorPicker
                                            open={open.buttonColorPicker}
                                            id="basic-button-collapsible"
                                            color={hexToHsba(props.offer.css_options?.button?.backgroundColor)}
                                            onChange={(newValue) => handleColorChanges(newValue, 'button', 'backgroundColor')}
                                        />
                                    </div>
                                </div>
                            </Grid.Cell>
                        </Grid>
                        <div style={{marginBottom: '20px'}} />
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                <div className="color-picker-container">
                                    <TextField
                                        label="Offer text"
                                        onChange={(newValue) => handleTextFieldChanges(newValue, 'text', 'color')}
                                        value={props.offer.css_options?.text?.color}
                                        connectedRight={
                                            <ColorSwatchSelector 
                                                onClick={() => handleToggle('textColorPicker')}
                                                backgroundColor={props.offer.css_options?.text?.color}
                                                ariaExpanded={open.textColorPicker}
                                                ariaControls="basic-card-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style">
                                        <CollapsibleColorPicker
                                            open={open.textColorPicker}
                                            id="basic-card-collapsible"
                                            color={hexToHsba(props.offer?.css_options?.text?.color)}
                                            onChange={(newValue) => handleColorChanges(newValue, 'text', 'color')}
                                        />
                                    </div>
                                </div>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                <div className="color-picker-container">
                                    <TextField
                                        label="Button text"
                                        onChange={(newValue) => handleTextFieldChanges(newValue, 'button', 'color')}
                                        value={props.offer.css_options?.button?.color}
                                        connectedRight={
                                            <ColorSwatchSelector 
                                                onClick={() => handleToggle('btnTextColorPicker')}
                                                backgroundColor={props.offer.css_options?.button?.color}
                                                ariaExpanded={open.btnTextColorPicker}
                                                ariaControls="basic-card-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style">
                                        <CollapsibleColorPicker
                                            open={open.btnTextColorPicker}
                                            id="basic-border-collapsible"
                                            color={hexToHsba(props.offer.css_options?.button?.color)}
                                            onChange={(newValue) => handleColorChanges(newValue, 'button', 'color')}
                                        />
                                    </div>
                                </div>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                <div className="color-picker-container">
                                    <TextField
                                        label="Button border"
                                        onChange={(newValue) => handleTextFieldChanges(newValue, 'button', 'borderColor')}
                                        value={props.offer.css_options?.button?.borderColor}
                                        connectedRight={
                                            <ColorSwatchSelector
                                                onClick={() => handleToggle('btnBorderColorPicker')}
                                                backgroundColor={props.offer.css_options?.button?.borderColor}
                                                ariaExpanded={open.btnBorderColorPicker}
                                                ariaControls="basic-card-collapsible"
                                                disabled
                                            />}
                                        disabled
                                    />
                                    <div className="color-picker-style">
                                        <CollapsibleColorPicker
                                            open={open.btnBorderColorPicker}
                                            id="basic-button-collapsible"
                                            color={hexToHsba(props.offer.css_options?.button?.borderColor)}
                                            onChange={(newValue) => handleColorChanges(newValue, 'button', 'borderColor')}
                                        />
                                    </div>
                                </div>
                            </Grid.Cell>
                        </Grid>
                    </Collapsible>
                </Stack>
            </LegacyCard>
            <div className="space-10" />

            <LegacyCard title="Offer text" className="input-box" sectioned>

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
                <hr className="legacy-card-hr" />
                <div style={{paddingBottom: '20px'}}>
                    <Text variant="headingMd" as="h2">Button text</Text>
                </div>
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
                                value={parseInt(props.offer.css_options?.button.fontWeightInPixel)}
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
                                value={props.offer.css_options?.button?.borderRadius || 0}

                                onChange={handleRangeSliderChange}
                                output
                            />
                    </Grid.Cell>
                </Grid>
            </LegacyCard>
            <div className="space-10"></div>
            {(props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled) ? (
                <>
                    <LegacyStack distribution="center">
                        <Button onClick={props.handleTabChange}>Continue to Advanced</Button>
                    </LegacyStack>
                </>) : (
                <LegacyStack distribution="center">
                    <ButtonGroup>
                        <Button onClick={() => props.saveDraft()}>Save Draft</Button>
                        <Button primary disabled={props.enablePublish} onClick={() => props.publishOffer()}>Publish</Button>
                    </ButtonGroup>
                </LegacyStack>
                )}
            <div className="space-10"></div>
        </div>
    );
}