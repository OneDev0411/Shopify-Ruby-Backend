import { Grid, Image, RadioButton, Text } from "@shopify/polaris";
import React from "react";

const OfferPlacement = ({
    defalutLabel,
    templateLabel,
    isDefault,
    isTemplate = !isDefault,
    radioName,
    onChangeDefault,
    onChangeTemplate,
    disabled,
    showImages = !isDefault && !disabled,
    images,
    onClickImage,
    placementPosition,
  }) => (
    <>
        <hr className="legacy-card-hr legacy-card-hr-t20-b15"/>

        <div style={{paddingBottom: '12px'}}>
            <Text variant="headingSm" as="h2">
                Where on this page would you like the offer to appear?
            </Text>
        </div>
        <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 8}}>
                <RadioButton
                    label={defalutLabel}
                    checked={isDefault}
                    name={radioName}
                    onChange={onChangeDefault}
                    disabled={disabled}
                />
            </Grid.Cell>
        </Grid>
        <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                <RadioButton
                    label={templateLabel}
                    checked={isTemplate}
                    name={radioName}
                    onChange={onChangeTemplate}
                    disabled={disabled}
                />
            </Grid.Cell>
        </Grid>
        {showImages && (
            <>
                <div className="space-4"/>
                {images.map((image, index) => (
                    <Image
                        key={index}
                        source={image}
                        alt={`Sample Image ${index + 1}`}
                        style={index === 0 ? {
                            marginRight: "10px",
                            marginTop: "10px",
                            cursor: "pointer",
                            width: "165px",
                        } : index === 1 ? {
                            marginLeft: '10px',
                            marginRight: '10px',
                            cursor: 'pointer',
                            width: '165px'
                        } : {marginLeft: '10px', cursor: 'pointer', width: '165px'}}
                        className={
                            placementPosition == index + 1
                                ? "editOfferTabs_image_clicked"
                                : "editOfferTabs_image_tag"
                        }
                        onClick={() => onClickImage(index + 1)}
                    />
                ))}
            </>
        )}
    </>
);

export default OfferPlacement;
