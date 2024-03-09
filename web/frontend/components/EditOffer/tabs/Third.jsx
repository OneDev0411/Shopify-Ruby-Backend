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
import { useState, useCallback, useRef, useEffect, useContext } from "react";
import React from "react";
import CollapsibleColorPicker from "../../CollapsibleColorPicker";
import tinycolor from "tinycolor2";
import "../../../components/stylesheets/colorPickerStyles.css";
import ColorSwatchSelector from "../../ColorSwatchSelector";
import {
    OfferStyleOptions,
    OfferBorderOptions,
    OfferFontOptions
} from "../../../shared/constants/EditOfferOptions";
import {OfferContext} from "../../../contexts/OfferContext.jsx";

export function ThirdTab(props) {
    const {offer, updateOffer, updateNestedAttributeOfOffer} = useContext(OfferContext);
    const [selected, setSelected] = useState(offer.css_options?.main?.borderStyle);

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
        setSelected(newValue);
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

    const colorPickerRefs = {
        cardColorPicker: useRef(null),
        borderColorPicker: useRef(null),
        buttonColorPicker: useRef(null),
        textColorPicker: useRef(null),
        btnTextColorPicker: useRef(null),
        btnBorderColorPicker: useRef(null),
    };

    const handleOutsideClick = (event) => {
        for (const [colorPickerName, ref] of Object.entries(colorPickerRefs)) {
            if (ref.current && !ref.current.contains(event.target)) {
            setOpen((prevState) => ({ ...prevState, [colorPickerName]: false }));
          }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

    return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
    };
    }, []);

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
        setSelected(newValue);
    }, []);

    //Sketch picker
    const handleColorChanges = useCallback((newValue, comp, property) => {
        const rgbColor = tinycolor({ h: newValue.hue, s: newValue.saturation, v: newValue.brightness, a: newValue.alpha }).toRgb();
        const hexColor = tinycolor(rgbColor).toHex();
        updateNestedAttributeOfOffer(`#${hexColor}`, "css_options", `${comp}`, `${property}`);
    }, []);

    const handleTextFieldChanges = useCallback((newValue, comp, property) => {
        updateNestedAttributeOfOffer(newValue, "css_options", `${comp}`, `${property}`);
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
            <div className="space-10" />

            <LegacyCard title="Color" sectioned>
                <Stack vertical>
                    {/*<Button>Choose Template</Button>*/}
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
                                        value={offer.css_options?.main?.backgroundColor}
                                        connectedRight={
                                            <ColorSwatchSelector
                                                onClick={() => handleToggle('cardColorPicker')}
                                                backgroundColor={offer.css_options?.main?.backgroundColor}
                                                ariaExpanded={open.cardColorPicker}
                                                ariaControls="basic-card-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style" ref={colorPickerRefs.cardColorPicker}>
                                        <CollapsibleColorPicker
                                            open={open.cardColorPicker}
                                            id="basic-card-collapsible"
                                            color={hexToHsba(offer.css_options?.main?.backgroundColor)}
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
                                        value={offer.css_options?.main?.borderColor}
                                        connectedRight={
                                            <ColorSwatchSelector
                                                onClick={() => handleToggle('borderColorPicker')}
                                                backgroundColor={offer.css_options?.main?.borderColor}
                                                ariaExpanded={open.borderColorPicker}
                                                ariaControls="basic-border-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style" ref={colorPickerRefs.borderColorPicker}>
                                        <CollapsibleColorPicker
                                            open={open.borderColorPicker}
                                            id="basic-border-collapsible"
                                            color={hexToHsba(offer.css_options?.main?.borderColor)}
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
                                        value={offer.css_options?.button?.backgroundColor}
                                        connectedRight={
                                            <ColorSwatchSelector 
                                                onClick={() => handleToggle('buttonColorPicker')}
                                                backgroundColor={offer.css_options?.button?.backgroundColor}
                                                ariaExpanded={open.buttonColorPicker}
                                                ariaControls="basic-button-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style" ref={colorPickerRefs.buttonColorPicker}>
                                        <CollapsibleColorPicker
                                            open={open.buttonColorPicker}
                                            id="basic-button-collapsible"
                                            color={hexToHsba(offer.css_options?.button?.backgroundColor)}
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
                                        value={offer.css_options?.text?.color}
                                        connectedRight={
                                            <ColorSwatchSelector 
                                                onClick={() => handleToggle('textColorPicker')}
                                                backgroundColor={offer.css_options?.text?.color}
                                                ariaExpanded={open.textColorPicker}
                                                ariaControls="basic-card-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style" ref={colorPickerRefs.textColorPicker}>
                                        <CollapsibleColorPicker
                                            open={open.textColorPicker}
                                            id="basic-card-collapsible"
                                            color={hexToHsba(offer?.css_options?.text?.color)}
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
                                        value={offer.css_options?.button?.color}
                                        connectedRight={
                                            <ColorSwatchSelector 
                                                onClick={() => handleToggle('btnTextColorPicker')}
                                                backgroundColor={offer.css_options?.button?.color}
                                                ariaExpanded={open.btnTextColorPicker}
                                                ariaControls="basic-card-collapsible"
                                            />
                                        }
                                    />
                                    <div className="color-picker-style" ref={colorPickerRefs.btnTextColorPicker}>
                                        <CollapsibleColorPicker
                                            open={open.btnTextColorPicker}
                                            id="basic-border-collapsible"
                                            color={hexToHsba(offer.css_options?.button?.color)}
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
                                        value={offer.css_options?.button?.borderColor}
                                        connectedRight={
                                            <ColorSwatchSelector
                                                onClick={() => handleToggle('btnBorderColorPicker')}
                                                backgroundColor={offer.css_options?.button?.borderColor}
                                                ariaExpanded={open.btnBorderColorPicker}
                                                ariaControls="basic-card-collapsible"
                                            />}
                                    />
                                    <div className="color-picker-style" ref={colorPickerRefs.btnBorderColorPicker}>
                                        <CollapsibleColorPicker
                                            open={open.btnBorderColorPicker}
                                            id="basic-button-collapsible"
                                            color={hexToHsba(offer.css_options?.button?.borderColor)}
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
                        <Button primary disabled={props.enablePublish} onClick={() => props.publishOffer()}>Publish</Button>
                    </ButtonGroup>
                </LegacyStack>
                )}
            <div className="space-10"></div>
        </div>
    );
}