import {
    LegacyCard,
    Button,
    TextField,
    Collapsible,
    Grid,
    Stack,
} from "@shopify/polaris";
import { useState, useCallback, useRef, useEffect, useContext } from "react";
import React from "react";
import CollapsibleColorPicker from "../../CollapsibleColorPicker";
import tinycolor from "tinycolor2";
import "../../../components/stylesheets/colorPickerStyles.css";
import ColorSwatchSelector from "../../ColorSwatchSelector";
import {OfferContext} from "../../../contexts/OfferContext.jsx";

const AppearanceColor = () => {
    const {offer, updateNestedAttributeOfOffer} = useContext(OfferContext);

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
    );
}

export default AppearanceColor;
