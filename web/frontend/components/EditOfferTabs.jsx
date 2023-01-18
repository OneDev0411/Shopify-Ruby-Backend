import {Card,Stack,ButtonGroup,Button,TextField,Checkbox,Select, RangeSlider, Collapsible} from "@shopify/polaris";
import {useState,useCallback} from "react";
import React from "react";


export function EditOfferTabs() {

    return (
        <div>
        <Card title="Offer Product" actions={[{content: 'Learn about Autopilot'}]} sectioned >
            <Card.Section>
                <Stack spacing="loose" vertical>
                    <p>What product would you like to have in the offer?</p>
                    <ButtonGroup>
                        <Button>Select product manually</Button>
                        <Button primary>Launch Autopilot</Button>
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
                        autoComplete="off"
                        helpText="This title will only be visible to you so you can reference it internally"
                    />
                    <TextField
                        label="Offer text"
                        placeholder='Take advantage of this limited offer'
                        autoComplete="off" 
                    />
                    <TextField
                        label="Button text"
                        placeholder='Add to cart'
                        autoComplete="off"   
                    />
                    <Checkbox label="Enable A/B testing"/>
                </Stack>
            </Card.Section>
        </Card>
        <Card title="Display options" sectioned>
            <Card.Section>
            <Stack vertical>
                <Checkbox label="Remove product image"/>
                <Checkbox label="Remove price"/>
                <Checkbox label="Remove compare at price"/>
                <Checkbox label="Remove link to product page"/>
                <Checkbox label="Remove quantity selector"/>
                <Checkbox label="Automatically apply  discount code"/>
                <Checkbox label="Remove quantity selector"/>
                <Checkbox label="Add custom textbox"/>
            </Stack>
            </Card.Section>
        </Card>
        <div className="space-4"></div>
        <Stack distribution="center">
            <Button>Add product</Button>
        </Stack>
        <div className="space-10"></div>
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
    return(
        <div>
            <Card title="Choose placement" sectioned>
                <Card.Section>
                <Stack vertical>
                    <Select
                        options={options}
                        onChange={handleSelectChange}
                        value={selected}
                    />
                </Stack>
                </Card.Section>
            </Card>
            <Card title="Display Conditions" sectioned>
                <Card.Section>
                    <p>None selected (show offer to all customer)</p>
                    <br/>
                    <Button>Add condition</Button>
                </Card.Section>
                <Card.Section title="Condition options">
                    <Stack vertical>
                        <Checkbox label="Disable checkout button until offer is accepted" 
                            helpText="This is useful for products that can only be purchased in pairs."/>
                        <Checkbox label="If the offer requirements are no longer met. Remove the item from the cart."/>
                    </Stack>
                </Card.Section>
            </Card>
            <div className="space-4"></div>
                <Stack distribution="center">
                    <Button disabled="true">Continue to Appearance</Button>
                </Stack>
            <div className="space-10"></div>
        </div>
    );
}

export function ThirdTab(){
    const [selected, setSelected] = useState('Cart page');
    const handleSelectChange = useCallback((value) => setSelected(value), []);
    const options = [
      {label: 'Cart page', value: 'cartpage'},
      {label: 'Product page', value: 'productpage'},
      {label: 'Product and cart page', value: 'cartpageproductpage'},
      {label: 'AJAX cart (slider, pop up or dropdown)', value: 'ajax'},
      {label: 'AJAX and cart page', value: 'ajaxcartpage'}
    ];

    const [rangeValue, setRangeValue] = useState(20);
    const handleRangeSliderChange = useCallback(
        (value) => setRangeValue(value),
        [],
    );
    // Toggle for manually added color
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return(
        <div>
            <Card title="Offer box" sectioned>
                <Card.Section>
                    <Stack>
                        <Select label="Layout" options={options} onChange={handleSelectChange} value={selected}/>
                    </Stack>
                    <br/>
                    <Stack>
                        <Select label="Space above offer" options={options} onChange={handleSelectChange} value={selected}/>
                        <Select label="Space below offer" options={options} onChange={handleSelectChange} value={selected}/>
                    </Stack>
                    <br/>
                    <Stack>
                        <Select label="Border style" options={options} onChange={handleSelectChange} value={selected}/>
                        <Select label="Border width" options={options} onChange={handleSelectChange} value={selected}/>
                    </Stack>
                    <br/>
                    <Stack>
                        <RangeSlider
                            label="Border Radius"
                            value={rangeValue}
                            onChange={handleRangeSliderChange}
                            output
                        />   
                    </Stack>
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
                            <p>
                               Add color picker options here
                            </p>
                        </Collapsible>
                    </Stack>
                </Card.Section>
            </Card>
            <Card  title="Offer text" className="input-box" sectioned>
                <Card.Section>
                    <Stack>
                        <Select label="Font" options={options} onChange={handleSelectChange} value={selected}/>
                        <TextField label="Weight" type="number" suffix="px" autoComplete="off" value="12"/>
                        <TextField label="Size" type="number" suffix="px" autoComplete="off" value="10"/>
                    </Stack>
                </Card.Section>
                <Card.Section title="Button text">
                    <Stack>
                        <Select label="Font" options={options} onChange={handleSelectChange} value={selected}/>
                        <TextField label="Weight" type="number" suffix="px" autoComplete="off" value="12"/>
                        <TextField label="Size" type="number" suffix="px" autoComplete="off" value="10"/>
                    </Stack>
                    <br/>
                    <Stack>
                        <RangeSlider
                            label="Button Radius"
                            value={rangeValue}
                            onChange={handleRangeSliderChange}
                            output
                        />   
                    </Stack>
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
                        checked={false}
                        helpText="This placement will apply to all offers created in the future.
                         They can be edited in the Settings section."
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