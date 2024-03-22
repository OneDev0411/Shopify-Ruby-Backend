import { TextField } from "@shopify/polaris";
import React from "react";
import CollapsibleColorPicker from "../../CollapsibleColorPicker";
import tinycolor from "tinycolor2";
import "../../../components/stylesheets/colorPickerStyles.css";
import ColorSwatchSelector from "../../ColorSwatchSelector";

const hexToHsba = (hexColor) => {
    const color = tinycolor(hexColor);
    const hsbColor = color.toHsv();
    const alpha = color.getAlpha();
    return {
        hue: hsbColor.h,
        saturation: hsbColor.s,
        brightness: hsbColor.v,
        alpha: alpha,
    };
};
  
const ColorPicker = ({
    label,
    onChangeTextFiled,
    color,
    onClickColorSwatchSelector,
    expanded,
    id,
    colorPickerRef,
    onChangeColorPicker,
}) => (
    <div className="color-picker-container">
        <TextField
            label={label}
            onChange={onChangeTextFiled}
            value={color}
            connectedRight={
                <ColorSwatchSelector
                  onClick={onClickColorSwatchSelector}
                  backgroundColor={color}
                  ariaExpanded={expanded}
                  ariaControls={id}
                />
              }
        />
        <div className="color-picker-style" ref={colorPickerRef}>
            <CollapsibleColorPicker
                open={expanded}
                id={id}
                color={hexToHsba(color)}
                onChange={onChangeColorPicker}
            />
        </div>
    </div>
);

export default ColorPicker;
