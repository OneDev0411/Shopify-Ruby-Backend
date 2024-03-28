import {
    LegacyCard,
    Button,
    Collapsible,
    Grid,
    Stack,
} from "@shopify/polaris";
import { useState, useCallback, useRef, useEffect, useContext } from "react";
import React from "react";
import tinycolor from "tinycolor2";
import {OfferContext} from "../../../contexts/OfferContext.jsx";
import { ColorPicker } from "../../molecules/index.js";

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
                            <ColorPicker
                                label="Card"
                                onChangeTextFiled={(newValue) => handleTextFieldChanges(newValue, "main", "backgroundColor")}
                                color={offer.css_options?.main?.backgroundColor}
                                onClickColorSwatchSelector={() => handleToggle("cardColorPicker")}
                                expanded={open.cardColorPicker}
                                id="basic-card-collapsible"
                                colorPickerRef={colorPickerRefs.cardColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "main", "backgroundColor")}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Border"
                                onChangeTextFiled={(newValue) => handleTextFieldChanges(newValue, "main", "borderColor")}
                                color={offer.css_options?.main?.borderColor}
                                onClickColorSwatchSelector={() => handleToggle("borderColorPicker")}
                                expanded={open.borderColorPicker}
                                id="basic-border-collapsible"
                                colorPickerRef={colorPickerRefs.borderColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "main", "borderColor")}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Button"
                                onChangeTextFiled={(newValue) => handleTextFieldChanges(newValue, "button", "backgroundColor")}
                                color={offer.css_options?.button?.backgroundColor}
                                onClickColorSwatchSelector={() => handleToggle("buttonColorPicker")}
                                expanded={open.buttonColorPicker}
                                id="basic-button-collapsible"
                                colorPickerRef={colorPickerRefs.buttonColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "button", "backgroundColor")}
                            />
                        </Grid.Cell>
                    </Grid>
                    <div style={{marginBottom: '20px'}} />
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Offer text"
                                onChangeTextFiled={(newValue) => handleTextFieldChanges(newValue, "text", "color")}
                                color={offer.css_options?.text?.color}
                                onClickColorSwatchSelector={() => handleToggle("textColorPicker")}
                                expanded={open.textColorPicker}
                                id="basic-offer-collapsible"
                                colorPickerRef={colorPickerRefs.textColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "text", "color")}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Button text"
                                onChangeTextFiled={(newValue) => handleTextFieldChanges(newValue, "button", "color")}
                                color={offer.css_options?.button?.color}
                                onClickColorSwatchSelector={() => handleToggle("btnTextColorPicker")}
                                expanded={open.btnTextColorPicker}
                                id="basic-button-text-collapsible"
                                colorPickerRef={colorPickerRefs.btnTextColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "button", "color")}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Button border"
                                onChangeTextFiled={(newValue) => handleTextFieldChanges(newValue, "button", "borderColor")}
                                color={offer.css_options?.button?.borderColor}
                                onClickColorSwatchSelector={() => handleToggle("btnBorderColorPicker")}
                                expanded={open.btnBorderColorPicker}
                                id="basic-button-border-collapsible"
                                colorPickerRef={colorPickerRefs.btnBorderColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "button", "borderColor")}
                            />
                        </Grid.Cell>
                    </Grid>
                </Collapsible>
            </Stack>
        </LegacyCard>
    );
}

export default AppearanceColor;
