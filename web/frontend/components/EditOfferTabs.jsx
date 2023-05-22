import {
    Card,
    Stack,
    ButtonGroup,
    Button,
    TextField,
    Checkbox,
    Select,
    RangeSlider,
    Collapsible,
    Modal,
    Grid,
    ColorPicker
} from "@shopify/polaris";
import {ModalAddProduct} from './modal_AddProduct';
import {ModalAddConditions} from './modal_AddConditions';
import {useState,useCallback,useRef} from "react";
import React from 'react';


export function EditOfferTabs() {
    const [offerTitle, setOfferTitle] = useState("");
    const [offerText, setofferText] = useState("");
    const [altOfferText, setAltOfferText] = useState("");
    const [btnTitle, setBtnTitle] = useState("");
    const [altBtnTitle, setAltBtnTitle] = useState("");
    const handleTitleChange = useCallback((newValue) => setOfferTitle(newValue), []);
    const handleTextChange = useCallback((newValue) => setofferText(newValue), []);
    const handleAltTextChange = useCallback((newValue) => setAltOfferText(newValue), []);
    const handleBtnChange = useCallback((newValue) => setBtnTitle(newValue), []);
    const handleAltBtnChange = useCallback((newValue) => setAltBtnTitle(newValue), []);
    //checkbox controls
    const [abTestCheck, setAbTestCheck] = useState(false);
    const [removeImg, setRemoveImg] = useState(false);
    const [removePriceCheck, setRemovePriceCheck] = useState(false);
    const [removeComparePrice, setRemoveComparePrice] = useState(false);
    const [removeProductPage, setRemoveProductPage] = useState(false);
    const [removeQtySelector, setRemoveQtySelector] = useState(false);
    const [autoDiscount, setAutoDiscount] = useState(false);
    const [addCustomtext, setAddCustomtext] = useState(false);

    const handleAbChange = useCallback((newChecked) => setAbTestCheck(newChecked), []);
    const handleImageChange = useCallback((newChecked) => setRemoveImg(newChecked), []);
    const handlePriceChange = useCallback((newChecked) => setRemovePriceCheck(newChecked), []);
    const handleCompareChange = useCallback((newChecked) => setRemoveComparePrice(newChecked), []);
    const handleProductPageChange = useCallback((newChecked) => setRemoveProductPage(newChecked), []);
    const handleQtySelectorChange = useCallback((newChecked) => setRemoveQtySelector(newChecked), []);
    const handleDiscountChange = useCallback((newChecked) => setAutoDiscount(newChecked), []);
    const handleCustomTextChange = useCallback((newChecked) => setAddCustomtext(newChecked), []);
    //modal controls
    const [productModal, setProductModal] = useState(false);
    const handleModal = useCallback(() => setProductModal(!productModal), [productModal]);
    const modalRef = useRef(null);
    const activator = modalRef;

    //Collapsible controls
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
        <div>
        <Card title="Offer Product" actions={[{content: 'Learn about Autopilot'}]} sectioned >
            <Card.Section>
                <Stack spacing="loose" vertical>
                    <p>What product would you like to have in the offer?</p>
                    <ButtonGroup>
                        <Button id={"btnSelectProduct"} onClick={handleModal} ref={modalRef}>Select product manually</Button>
                        <Button id={"btnLaunchAI"} primary>Launch Autopilot</Button>
                    </ButtonGroup>
                </Stack>
            </Card.Section>
        </Card> 
        <Card title="Text" sectioned >
            <Card.Section>
                <Stack spacing="loose" vertical>
                    <TextField
                        label="Offer title"
                        placeholder='Offer #1'
                        value={offerTitle}
                        onChange={handleTitleChange}
                        autoComplete="off"
                        helpText="This title will only be visible to you so you can reference it internally"
                    />
                    <TextField
                        label="Offer text"
                        placeholder='Take advantage of this limited offer'
                        autoComplete="off" 
                        value={offerText}
                        onChange={handleTextChange}
                    />
                    <TextField
                        label="Button text"
                        placeholder='Add to cart'
                        value={btnTitle}
                        onChange={handleBtnChange}
                        autoComplete="off"   
                    />
                    <Checkbox id={"abTesting"} 
                        label="Enable A/B testing"
                        checked={abTestCheck}
                        onChange={handleAbChange}
                        onFocus={handleToggle}
                    />
                    <Collapsible
                        open={open}
                        id="basic-collapsible"
                        transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                        expandOnPrint
                    >
                        <TextField
                            label="Alternative offer text"
                            placeholder='Take advantage of this limited offer'
                            autoComplete="off" 
                            value={altOfferText}
                            onChange={handleAltTextChange}
                        />
                        <TextField
                            label="Alternative button text"
                            placeholder='Add to cart'
                            autoComplete="off" 
                            value={altBtnTitle}
                            onChange={handleAltBtnChange}
                        />
                    </Collapsible>
                </Stack>
            </Card.Section>
        </Card>
        <Card title="Display options" sectioned>
            <Card.Section>
            <Stack vertical>
                <Checkbox id={"removeImg"} 
                    checked={removeImg}
                    onChange={handleImageChange}
                    label="Remove product image"
                />
                <Checkbox id={"removePrice"} 
                    checked={removePriceCheck}
                    onChange={handlePriceChange}
                    label="Remove price"
                />
                <Checkbox id={"removeComparePrice"} 
                    checked={removeComparePrice}
                    onChange={handleCompareChange}
                    label="Remove compare at price"
                />
                <Checkbox id={"removeProductPage"} 
                    checked={removeProductPage}
                    onChange={handleProductPageChange}
                    label="Remove link to product page"
                />
                <Checkbox id={"autoDiscount"} 
                    label="Automatically apply  discount code"
                    checked={autoDiscount}
                    onChange={handleDiscountChange}
                />
                <Checkbox id={"removeQtySelector"}
                    checked={removeQtySelector}
                    onChange={handleQtySelectorChange} 
                    label="Remove quantity selector"
                />
                <Checkbox id={"addCustomtext"}
                    checked={addCustomtext}
                    onChange={handleCustomTextChange} 
                    label="Add custom textbox"
                />
            </Stack>
            </Card.Section>
        </Card>
        <div className="space-4"></div>
        <Stack distribution="center">
            <Button id={"btnAddProduct"} onClick={handleModal} ref={modalRef}>Add product</Button>
        </Stack>
        <div className="space-10"></div>
        {/* Modal */}
        <Modal
        activator={activator}
        open={productModal}
        onClose={handleModal}
        title="Select products from your store"
        primaryAction={{
          content: 'Save',
        }}
      >
        <Modal.Section>
            <ModalAddProduct/>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export function SecondTab(){
    const [selected, setSelected] = useState('Cart page');
    const handleSelectChange = useCallback((value) => setSelected(value), []);
  
    const options = [
      {label: 'Cart page', value: 'cartpage'},
      {label: 'Product page', value: 'productpage'},
      {label: 'Product and cart page', value: 'cartpageproductpage'},
      {label: 'AJAX cart (slider, pop up or dropdown)', value: 'ajax'},
      {label: 'AJAX and cart page', value: 'ajaxcartpage'}
      
    ];

    const [disableCheckoutBtn, setDisableCheckoutBtn] = useState(false);
    const [removeItiem, setRemoveItiem] = useState(false);
    const handleDisableCheckoutBtn = useCallback((newChecked) => setDisableCheckoutBtn(newChecked), []);
    const handleRemoveItiem = useCallback((newChecked) => setRemoveItiem(newChecked), []);
    //Modal controllers
    const [conditionModal, setConditionModal] = useState(false);
    const handleModal = useCallback(() => setConditionModal(!conditionModal), [conditionModal]);
    const modalCon = useRef(null);
    const activatorCon = modalCon;

    return(
        <div>
            <Card title="Choose placement" sectioned>
                <Card.Section>
                <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                        <Select
                            options={options}
                            onChange={handleSelectChange}
                            value={selected}
                        />
                    </Grid.Cell>
                </Grid>
                </Card.Section>
            </Card>
            <Card title="Display Conditions" sectioned>
                <Card.Section>
                    <p>None selected (show offer to all customer)</p>
                    <br/>
                    <Button onClick={handleModal} ref={modalCon}>Add condition</Button>
                </Card.Section>
                <Card.Section title="Condition options">
                    <Stack vertical>
                        <Checkbox 
                            label="Disable checkout button until offer is accepted" 
                            helpText="This is useful for products that can only be purchased in pairs."
                            checked={disableCheckoutBtn}
                            onChange={handleDisableCheckoutBtn}
                        />
                        <Checkbox 
                            label="If the offer requirements are no longer met. Remove the item from the cart."
                            checked={removeItiem}
                            onChange={handleRemoveItiem}
                        />
                    </Stack>
                </Card.Section>
            </Card>
            <div className="space-4"></div>
                <Stack distribution="center">
                    <Button disabled="true">Continue to Appearance</Button>
                </Stack>
            <div className="space-10"></div>
            <Modal
                activator={activatorCon}
                open={conditionModal}
                onClose={handleModal}
                title="Select products from your store"
                primaryAction={{
                content: 'Save',
                }}
            >
                <Modal.Section>
                   <ModalAddConditions/> 
                </Modal.Section>
            </Modal>
        </div>
    );
}

export function ThirdTab(){
    const [layout, setLayout] = useState('Cart page');
    const [selected, setSelected] = useState('Cart page');
    const options = [
        {label: 'Cart page', value: 'cartpage'},
        {label: 'Product page', value: 'productpage'},
        {label: 'Product and cart page', value: 'cartpageproductpage'},
        {label: 'AJAX cart (slider, pop up or dropdown)', value: 'ajax'},
        {label: 'AJAX and cart page', value: 'ajaxcartpage'}
      ];
      
    const handleLayout = useCallback((value) => setLayout(value), []);
    const handleSelectChange = useCallback((value) => setSelected(value), []);

    // Space above the offer
    const [aboveSpace, setAboveSpace] = useState('10');
    const handleAboveSpace = useCallback(
        (value) => setAboveSpace(value),
        [],
    );
    // Space below the offer
    const [belowSpace, setBelowSpace] = useState('10');
    const handleBelowSpace = useCallback(
        (value) => setBelowSpace(value),
        [],
    );
    //Border style drop-down menu
    const [borderStyle, setBorderStyle] = useState("No border")
    const handleBorderStyle = useCallback((value) => setBorderStyle(value), []);
    const BorderOptions = [
        {label: 'No border', value: 'No border'},
        {label: 'Dotted lines', value: 'Dotted lines'},
        {label: 'Straight line', value: 'Straight line'},
      ];

    //Border width
    const [borderWidth, setBorderWidth] = useState('10');
    const handleBorderWidth = useCallback(
        (value) => setBorderWidth(value),
        [],
    );

    //Border range slider
    const [borderRange, setBorderRange] = useState(10);
    const handlesetBorderRange = useCallback(
        (value) => setBorderRange(value),
        [],
    );
 
    // Toggle for manually added color
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    //Color picker
    const [color, setColor] = useState({
        hue: 300,
        brightness: 1,
        saturation: 0.7,
        alpha: 0.7,
      });

    //Font options
    const [fontSelect, setFontSelect] = useState("Dummy font 1");
    const handleFontSelect = useCallback((value)=> setFontSelect(value),[]);
    const fontOptions = [
        {label: 'Dummy font 1', value: 'Dummy font 1'},
        {label: 'Dummy font 2', value: 'Dummy font 2'},
        {label: 'Dummy font 3', value: 'Dummy font 3'},
        {label: 'Dummy font 4', value: 'Dummy font 4'},
        {label: 'Dummy font 5', value: 'Dummy font 5'},
      ];

    //Font weight
    const [fontWeight, setFontWeight] = useState('10');
    const handleFontWeight = useCallback(
        (value) => setFontWeight(value),
        [],
    );

    //Font size
    const [fontsize, setFontSize] = useState('10');
    const handleFontSize = useCallback(
        (value) => setFontSize(value),
        [],
    );


    //Button options
    const [btnSelect, setBtnSelect] = useState("Dummy font 1");
    const handleBtnSelect = useCallback((value)=> setBtnSelect(value),[]);
    const btnOptions = [
        {label: 'Dummy font 1', value: 'Dummy font 1'},
        {label: 'Dummy font 2', value: 'Dummy font 2'},
        {label: 'Dummy font 3', value: 'Dummy font 3'},
        {label: 'Dummy font 4', value: 'Dummy font 4'},
        {label: 'Dummy font 5', value: 'Dummy font 5'},
      ];

    //Button weight
    const [btnWeight, setBtnWeight] = useState('10');
    const handleBtnWeight = useCallback(
        (value) => setBtnWeight(value),
        [],
    );

    //Button size
    const [btnSize, setBtnSize] = useState('10');
    const handleBtnSize = useCallback(
        (value) => setBtnSize(value),
        [],
    );
    
    // Btn radius
    const [rangeValue, setRangeValue] = useState(20);
    const handleRangeSliderChange = useCallback(
        (value) => setRangeValue(value),
        [],
    );
   
    return(
        <div>
            <Card title="Offer box" sectioned>
                <Card.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <Select 
                                label="Layout" 
                                options={options} 
                                onChange={handleLayout} 
                                value={layout}
                            />
                        </Grid.Cell>
                    </Grid>
                    <br/>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField 
                                label="Space above offer" 
                                type="number"
                                onChange={handleAboveSpace} 
                                value={aboveSpace}
                                suffix="px"
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField 
                                label="Space below offer" 
                                type="number"
                                onChange={handleBelowSpace} 
                                value={belowSpace}
                                suffix="px"
                            />
                        </Grid.Cell>    
                    </Grid>
                    <br/>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <Select label="Border style" 
                                options={BorderOptions} 
                                onChange={handleBorderStyle} 
                                value={borderStyle}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField 
                                label="Border width" 
                                type="number"
                                onChange={handleBorderWidth} 
                                value={borderWidth}
                                suffix="px"
                            />
                        </Grid.Cell>
                    </Grid>
                    <br/>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <RangeSlider
                                label="Border Radius"
                                value={borderRange}
                                onChange={handlesetBorderRange}
                                output
                            />  
                        </Grid.Cell> 
                    </Grid>
                </Card.Section>
            </Card>
            <Card title="Color" sectioned>
                <Card.Section>
                    <ButtonGroup>
                        <Button
                            onClick={handleToggle}
                            ariaExpanded={open}
                            ariaControls="basic-collapsible"
                        >Manually select colors</Button>
                        <Button primary>Choose template</Button>
                    </ButtonGroup>
                    <Stack vertical>
                        <Collapsible
                            open={open}
                            id="basic-collapsible"
                            transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                            expandOnPrint
                        >  
                           <br/><ColorPicker onChange={setColor} color={color} allowAlpha />
                        </Collapsible>
                    </Stack>
                </Card.Section>
            </Card>
            <Card  title="Offer text" className="input-box" sectioned>
                <Card.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <Select 
                                label="Font" 
                                options={fontOptions} 
                                onChange={handleFontSelect} 
                                value={fontSelect}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField 
                                label="Weight" 
                                type="number" 
                                suffix="px" 
                                autoComplete="off"
                                onChange={handleFontWeight}
                                value={fontWeight}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField 
                                label="Size" 
                                type="number" 
                                suffix="px" 
                                autoComplete="off"
                                onChange={handleFontSize}
                                value={fontsize}
                            />
                        </Grid.Cell>                                
                    </Grid>
                </Card.Section>
                <Card.Section title="Button text">
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <Select 
                                label="Font" 
                                options={btnOptions} 
                                onChange={handleBtnSelect} 
                                value={btnSelect}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField 
                                label="Weight" 
                                type="number" 
                                suffix="px" 
                                autoComplete="off"
                                onChange={handleBtnWeight}
                                value={btnWeight}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField 
                                label="Size" 
                                type="number" 
                                suffix="px" 
                                autoComplete="off"
                                onChange={handleBtnSize}
                                value={btnSize}
                            />
                        </Grid.Cell>
                    </Grid>
                    <br/>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <RangeSlider
                                label="Button Radius"
                                value={rangeValue}
                                onChange={handleRangeSliderChange}
                                output
                            /> 
                        </Grid.Cell>   
                    </Grid>
                </Card.Section>
            </Card>
            <div className="space-4"></div>
            <Stack distribution="center">
                <ButtonGroup>
                    <Button>Save dratf</Button>
                    <Button primary>Publish</Button>
                </ButtonGroup>
            </Stack> 
            <div className="space-10"></div>
        </div>
    );
}

// Advanced Tab
export function FourthTab(){

    const [checked, setChecked] = useState(false);
    const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

    return(
        <>
            <Card sectioned title="Offer placement - advanced settings" actions={[{content: 'View help doc'}]}>
                <Card.Section title="Product page">
                    <TextField label="DOM Selector" type="text"></TextField>
                    <TextField label="DOM Action"></TextField>
                </Card.Section>
                <Card.Section title="Cart page">
                    <TextField label="DOM Selector"></TextField>
                    <TextField label="DOM Action"></TextField>
                </Card.Section>
                <Card.Section title="AJAX/Slider cart">
                    <TextField label="DOM Selector"></TextField>
                    <TextField label="DOM Action"></TextField>
                    <TextField label="AJAX refresh code" multiline={6}></TextField>
                </Card.Section>
                <Card.Section title="Custom CSS">
                    <TextField multiline={6}></TextField>
                    <br/>
                    <Checkbox
                        label="Save as default settings"
                        helpText="This placement will apply to all offers created in the future.
                         They can be edited in the Settings section."
                        checked={checked}
                        onChange={handleChange}
                    />
                </Card.Section>
            </Card>
            <div className="space-4"></div>
            <Stack distribution="center">
                <ButtonGroup>
                    <Button>Save dratf</Button>
                    <Button primary>Publish</Button>
                </ButtonGroup>
            </Stack>
            <div className="space-10"></div>
        </>
    );
}
