import {
    VerticalStack,
    LegacyCard,
    LegacyStack,
    ButtonGroup,
    Button,
    TextField,
    Checkbox,
    Select,
    RangeSlider,
    Collapsible,
    Modal,
    Grid,
    ColorPicker,
    Stack,
    Icon
} from "@shopify/polaris";
import {
    CancelMajor
  } from '@shopify/polaris-icons';
import {ModalAddProduct} from "./modal_AddProduct";
import {ModalAddConditions} from "./modal_AddConditions";
import HomePage from "../pages/subscription";
import {useState,useCallback,useRef,useEffect} from "react";
import { SketchPicker } from 'react-color';
import React from "react";
import Subscription from "../pages/subscription";
import tinycolor from "tinycolor2";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { elementSearch, productsMulti } from "../services/products/actions/product";

export function EditOfferTabs(props) {
    const shopAndHost = useSelector(state => state.shopAndHost);

    const [altOfferText, setAltOfferText] = useState("");
    const [altBtnTitle, setAltBtnTitle] = useState("");
    const handleTitleChange = useCallback((newValue) => props.updateOffer("title", newValue), []);
    const handleTextChange = useCallback((newValue) => {
        props.updateOffer("text_a", newValue);
        if(props.offer.offerable_product_details.length > 0) {
            props.updateCheckKeysValidity("text", newValue.replace("{{ product_title }}", props.offer.offerable_product_details[0].title));
        }
    }, [props.offer.offerable_product_details]);
    const handleAltTextChange = useCallback((newValue) => props.updateOffer("text_b", newValue), []);
    const handleBtnChange = useCallback((newValue) => {
        props.updateOffer("cta_a", newValue);
        props.updateCheckKeysValidity('cta', newValue);
    }, []);
    const handleAltBtnChange = useCallback((newValue) => props.updateOffer("cta_b", newValue), []);
    //checkbox controls
    const [abTestCheck, setAbTestCheck] = useState(false);
    // const [removeImg, setRemoveImg] = useState(false);
    // const [removePriceCheck, setRemovePriceCheck] = useState(false);
    const [removeComparePrice, setRemoveComparePrice] = useState(false);
    const [removeProductPage, setRemoveProductPage] = useState(false);
    const [removeQtySelector, setRemoveQtySelector] = useState(false);
    const [autoDiscount, setAutoDiscount] = useState(false);
    const [addCustomtext, setAddCustomtext] = useState(false);

    const handleAbChange = useCallback((newChecked) => setAbTestCheck(newChecked), []);
    const handleImageChange = useCallback((newChecked) => props.updateOffer("show_product_image", !newChecked), []);
    const handlePriceChange = useCallback((newChecked) => props.updateOffer("show_product_price", !newChecked), []);
    const handleCompareChange = useCallback((newChecked) => props.updateOffer("show_compare_at_price", !newChecked), []);
    const handleProductPageChange = useCallback((newChecked) => props.updateOffer("link_to_product", !newChecked), []);
    const handleQtySelectorChange = useCallback((newChecked) => props.updateOffer("show_quantity_selector", !newChecked), []);
    const handleDiscountChange = useCallback((newChecked) => {
        if (newChecked) {
            props.updateOffer("discount_target_type", "code");
        }
        else {
            props.updateOffer("discount_target_type", "none");
        }
    },[]);
    const handleCustomTextChange = useCallback((newChecked) => props.updateOffer("show_custom_field", newChecked), []);
    //modal controls
    const [productModal, setProductModal] = useState(false);
    const handleModal = useCallback(() => {
        setProductModal(!productModal);
    }, [productModal]);
    const modalRef = useRef(null);
    const activator = modalRef;

    //Available Products
    const [query, setQuery] = useState("");
    const [productData, setProductData] = useState("");
    const [resourceListLoading, setResourceListLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    //Called from chiled modal_AddProduct.jsx when the text in searchbox changes
    function updateQuery (childData) {
        setResourceListLoading(true);
        fetch(`/api/merchant/element_search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product: { query: childData, type: 'product' }, shop: shopAndHost.shop}),
        })
        .then( (response) => { return response.json() })
        .then( (data) => {
            setProductData(data);
            setResourceListLoading(false);
        })
        .catch((error) => {
            console.log("Error > ", error);
        })

      setQuery(childData);
    }

    //Called when the selected product or variants of selected product changes in popup modal
    function updateSelectedProduct(selectedItem, selectedVariants) {
        if (Array.isArray(selectedItem)) {
            setSelectedProducts(selectedItem);
        }
        props.updateIncludedVariants(selectedItem, selectedVariants);
    }

    //Called when "select product manually button clicked"
    function getProducts() {
        props.updateOffer("included_variants", {});

        setResourceListLoading(true);
        fetch(`/api/merchant/element_search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product: { query: query, type: 'product' }, shop: shopAndHost.shop}),
        })
        .then( (response) => { return response.json() })
        .then( (data) => {
            setProductData(data);
            setResourceListLoading(false);
        })
        .catch((error) => {
            console.log("# Error getProducts > ", JSON.stringify(error));
        })
    }

    //Called when the save button of popup modal is clicked
    function updateProducts() {
        if(selectedProducts.length > 0) {
            props.updateOffer("offerable_product_details", []);
            props.updateOffer("offerable_product_shopify_ids", []);
        }
        var responseCount = 0;
        for(var i=0; i<selectedProducts.length; i++) {
            fetch(`/api/merchant/products/multi/${selectedProducts[i]}?shop_id=${props.shop.shop_id}&shop=${shopAndHost.shop}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            })
            .then( (response) => { return response.json() })
            .then( (data) => {
                props.updateProductsOfOffer(data);
                setProductData("");
                if(responseCount == 0) {
                    props.updateCheckKeysValidity("text", props.offer.text_a.replace("{{ product_title }}", data.title));
                    props.updateCheckKeysValidity('cta', props.offer.cta_a);
                }
                responseCount++;
            })
            .catch((error) => {
                console.log("# Error updateProducts > ", JSON.stringify(error));
            })
        }
        handleModal();
    }


    //Collapsible controls
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
        <div>
        <LegacyCard title="Offer Product" actions={[{content: 'Learn about Autopilot'}]} sectioned >
            <LegacyCard.Section>
                <LegacyStack spacing="loose" vertical>
                    <p>What product would you like to have in the offer?</p>
                    <ButtonGroup>
                        <Button id={"btnSelectProduct"} onClick={ () => { handleModal(); getProducts(); } } ref={modalRef}>Select product manually</Button>
                        <Button id={"btnLaunchAI"} primary>Launch Autopilot</Button>
                    </ButtonGroup>
                </LegacyStack>
            </LegacyCard.Section>
        </LegacyCard>
        <LegacyCard title="Text" sectioned >
            <LegacyCard.Section>
                <LegacyStack spacing="loose" vertical>
                    <TextField
                        label="Offer title"
                        placeholder='Offer #1'
                        value={props.offer.title}
                        onChange={handleTitleChange}
                        autoComplete="off"
                        helpText="This title will only be visible to you so you can reference it internally"
                    />
                    <TextField
                        label="Offer text"
                        placeholder='Take advantage of this limited offer'
                        autoComplete="off"
                        value={props.offer.text_a}
                        onChange={handleTextChange}
                    />
                    <TextField
                        label="Button text"
                        placeholder='Add to cart'
                        value={props.offer.cta_a}
                        onChange={handleBtnChange}
                        autoComplete="off"
                    />
                    <Checkbox id={"abTesting"}
                        label="Enable A/B testing"
                        checked={abTestCheck}
                        onChange={handleAbChange}
                    />
                    <Collapsible
                        open={abTestCheck}
                        id="basic-collapsible"
                        transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                        // expandOnPrint
                    >
                    <Collapsible
                      open={!props.offerSettings.has_ab_testing}
                      id="ab-testing-not-present-collapsible"
                      transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                      expandOnPrint
                    >
                      <VerticalStack>
                        <p>
                            A/B testing is available on our Professional plan. Please <Link to="/subscription">upgrade your subscription</Link> to enable it.
                        </p>
                      </VerticalStack>
                    </Collapsible>
                        <Collapsible
                            open={props.offerSettings.has_ab_testing}
                            id="ab-testing-present-collapsible"
                            transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                            expandOnPrint
                        >
                        <TextField
                          label="Alternative offer text"
                          placeholder='Take advantage of this limited offer'
                          autoComplete="off"
                          value={props.offer.text_b}
                          onChange={handleAltTextChange}
                        />
                            <TextField
                                label="Alternative button text"
                                placeholder='Add to cart'
                                autoComplete="off"
                                value={props.offer.cta_b}
                                onChange={handleAltBtnChange}
                            />
                        </Collapsible>
                    </Collapsible>
                </LegacyStack>
            </LegacyCard.Section>
        </LegacyCard>
        <LegacyCard title="Display options" sectioned>
            <LegacyCard.Section>
            <LegacyStack vertical>
                <Checkbox id={"removeImg"}
                    checked={!props.offer.show_product_image}
                    onChange={handleImageChange}
                    label="Remove product image"
                />
                <Checkbox id={"removePrice"}
                    checked={!props.offer.show_product_price}
                    onChange={handlePriceChange}
                    label="Remove price"
                />
                <Checkbox id={"removeComparePrice"}
                    checked={!props.offer.show_compare_at_price}
                    onChange={handleCompareChange}
                    label="Remove compare at price"
                />
                <Checkbox id={"removeProductPage"}
                    checked={!props.offer.link_to_product}
                    onChange={handleProductPageChange}
                    label="Remove link to product page"
                />
                <Checkbox id={"autoDiscount"}
                    label="Automatically apply discount code"
                    checked={props.offer.discount_target_type == "code"}
                    onChange={handleDiscountChange}
                />
                <Checkbox id={"removeQtySelector"}
                    checked={!props.offer.show_quantity_selector}
                    onChange={handleQtySelectorChange}
                    label="Remove quantity selector"
                />
                <Checkbox id={"addCustomtext"}
                    checked={props.offer.show_custom_field}
                    onChange={handleCustomTextChange}
                    label="Add custom textbox"
                />
            </LegacyStack>
            </LegacyCard.Section>
        </LegacyCard>
        <div className="space-4"></div>
        <LegacyStack distribution="center">
            <Button id={"btnAddProduct"} onClick={handleModal} ref={modalRef}>Add product</Button>
        </LegacyStack>
        <div className="space-10"></div>
        {/* Modal */}
        <Modal
        activator={activator}
        open={productModal}
        onClose={handleModal}
        title="Select products from your store"
        primaryAction={{
          content: 'Save',
          onAction: updateProducts,
        }}
      >
        <Modal.Section>
            <ModalAddProduct updateQuery={updateQuery} shop_id={props.shop.shop_id} productData={productData} resourceListLoading={resourceListLoading} updateSelectedProduct={updateSelectedProduct}/>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export function SecondTab(props){
    const [selected, setSelected] = useState('cartpage');
    const [rule, setRule] = useState({quantity: null, rule_selector: 'cart_at_least', item_type: 'product', item_shopify_id: null, item_name: null});
    const [quantityErrorText, setQuantityErrorText] = useState(null);
    const [itemErrorText, setItemErrorText] = useState(null);
    const quantityArray = ['cart_at_least', 'cart_at_most', 'cart_exactly'];
    const orderArray = ['total_at_least', 'total_at_most']

    function upadteCondition () {
        if(quantityArray.includes(rule.rule_selector)){
            if(!rule.quantity){
                setQuantityErrorText("Required filed");
                return;
            }
            else if(rule.quantity<1){
                setQuantityErrorText("Quantity can't be less than 1");
                return;
            }
        }
        if(orderArray.includes(rule.rule_selector)){
            if(!rule.item_name){
                setItemErrorText("Required filed");
                return;
            }
            else if(rule.item_name<1){
                setItemErrorText("Amount can't be less than 1");
                return;
            }
        }
        else if(!rule.item_name){
            setItemErrorText("Required field");
            return;
        }
        props.setOffer(prev => ({ ...prev, rules_json: [...prev.rules_json, rule] }));
        handleModal();
    }

    const handleSelectChange = useCallback((value) => {
        if(value === "cartpage") {
            props.updateOffer("in_cart_page", true);
            props.updateOffer("in_product_page", false);
            props.updateOffer("in_ajax_cart", false);
        }
        else if(value === "productpage") {
            props.updateOffer("in_cart_page", false);
            props.updateOffer("in_product_page", true);
            props.updateOffer("in_ajax_cart", false);
        }
        else if(value === "cartpageproductpage") {
            props.updateOffer("in_cart_page", true);
            props.updateOffer("in_product_page", true);
            props.updateOffer("in_ajax_cart", false);
        }
        else if(value === "ajax") {
            props.updateOffer("in_cart_page", false);
            props.updateOffer("in_product_page", false);
            props.updateOffer("in_ajax_cart", true);
        }
        else if(value === "ajaxcartpage") {
            props.updateOffer("in_cart_page", true);
            props.updateOffer("in_product_page", false);
            props.updateOffer("in_ajax_cart", true);
        }
      setSelected(value);
    }, []);

  const options = [
      {label: 'Cart page', value: 'cartpage'},
      {label: 'Product page', value: 'productpage'},
      {label: 'Product and cart page', value: 'cartpageproductpage'},
      {label: 'AJAX cart (slider, pop up or dropdown)', value: 'ajax'},
      {label: 'AJAX and cart page', value: 'ajaxcartpage'}
    ];

    const handleDisableCheckoutBtn = useCallback((newChecked) => props.updateOffer("must_accept", newChecked), []);
    const handleRemoveItiem = useCallback((newChecked) => props.updateOffer("remove_if_no_longer_valid", newChecked), []);
    //Modal controllers
    const [conditionModal, setConditionModal] = useState(false);
    const handleModal = useCallback(() => {
        setConditionModal(!conditionModal), [conditionModal]
        setDefaultRule();
    });
    const modalCon = useRef(null);
    const activatorCon = modalCon;

    useEffect(() => {
        if (props.offer.in_product_page && props.offer.in_cart_page) {
            setSelected("cartpageproductpage");
        }
        else if (props.offer.in_ajax_cart && props.offer.in_cart_page) {
            setSelected("ajaxcartpage");
        }
        else if (props.offer.in_cart_page) {
            setSelected("cartpage");
        }
        else if (props.offer.in_product_page) {
            setSelected("productpage");
        }
        else if (props.offer.in_ajax_cart) {
            setSelected("ajax");
        }
        else {
            setSelected("cartpage");
        }
    }, []);

    const setDefaultRule = ()=>{
        setRule({quantity: null, rule_selector: 'cart_at_least', item_type: 'product', item_shopify_id: null, item_name: null});
        setQuantityErrorText(null);
        setItemErrorText(null);
    }

    const condition_options = [
        { label: 'Cart contains at least', value: 'cart_at_least' },
        { label: 'Cart contains at most', value: 'cart_at_most' },
        { label: 'Cart contains exactly', value: 'cart_exactly' },
        { label: 'Cart does not contain any', value: 'cart_does_not_contain' },
        { label: 'Cart contains variant', value: 'cart_contains_variant' },
        { label: 'Cart does not contain variant', value: 'cart_does_not_contain_variant' },
        { label: 'Cart contains a product from vendor', value: 'cart_contains_item_from_vendor' },
        { label: 'Cart does not contain any product from vendor', value: 'cart_does_not_contain_item_from_vendor' },
        { label: 'Order Total Is At Least', value: 'total_at_least' },
        { label: 'Order Total Is At Most', value: 'total_at_most' },
        { label: 'Cookie is set', value: 'cookie_is_set' },
        { label: 'Cookie is not set', value: 'cookie_is_not_set' },
        { label: 'Customer is tagged', value: 'customer_is_tagged' },
        { label: 'Customer is not tagged', value: 'customer_is_not_tagged' },
        { label: 'Product/Cart URL contains', value: 'url_contains' },
        { label: 'Product/Cart URL does not contain', value: 'url_does_not_contain' },
        { label: 'Customer is located in', value: 'in_location' },
        { label: 'Customer is not located in', value: 'not_in_location' },
        { label: 'Customer is viewing this product/collection', value: 'on_product_this_product_or_in_collection' },
        { label: 'Customer is not viewing this product/collection', value: 'on_product_not_this_product_or_not_in_collection' },
    ];

    function getLabelFromValue(value) {
        const condition = condition_options.find(option => option.value === value);
        return condition ? condition.label : null;
    }

    function deleteRule(index){
        const updatedRules = [...props.offer.rules_json];
        updatedRules.splice(index, 1);
        props.updateOffer('rules_json', updatedRules);
    }

    return(
        <div>
            <LegacyCard title="Choose placement" sectioned>
                <LegacyCard.Section>
                <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                        <Select
                            options={options}
                            onChange={handleSelectChange}
                            value={selected}
                        />
                    </Grid.Cell>
                </Grid>
                </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard title="Display Conditions" sectioned>
                <LegacyCard.Section>
                    {props.offer.rules_json.length===0 ? (
                        <p>None selected (show offer to all customer)</p>
                    ): (
                        <>{Array.isArray(props.offer.rules_json) && props.offer.rules_json.map((rule, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center'}}>{getLabelFromValue(rule.rule_selector)} {rule.quantity} {rule.item_name}
                            <p onClick={()=> deleteRule(index) }>
                                <Icon source={CancelMajor} color="critical"/>
                            </p>
                        </li>
                        ))}</>
                    )}
                    <br/>
                    <Button onClick={handleModal} ref={modalCon}>Add condition</Button>
                </LegacyCard.Section>
                <LegacyCard.Section title="Condition options">
                    <LegacyStack vertical>
                        <Checkbox
                            label="Disable checkout button until offer is accepted"
                            helpText="This is useful for products that can only be purchased in pairs."
                            checked={props.offer.must_accept}
                            onChange={handleDisableCheckoutBtn}
                        />
                        <Checkbox
                            label="If the offer requirements are no longer met. Remove the item from the cart."
                            checked={props.offer.remove_if_no_longer_valid}
                            onChange={handleRemoveItiem}
                        />
                    </LegacyStack>
                </LegacyCard.Section>
            </LegacyCard>
            <div className="space-4"></div>
                <LegacyStack distribution="center">
                    <Button disabled="true">Continue to Appearance</Button>
                </LegacyStack>
            <div className="space-10"></div>
            <Modal
                activator={activatorCon}
                open={conditionModal}
                onClose={handleModal}
                title="Select products from your store"
                primaryAction={{
                content: 'Save',
                onAction: upadteCondition,
                }}
            >
                <Modal.Section>
                   <ModalAddConditions quantityErrorText={quantityErrorText} itemErrorText={itemErrorText} condition_options={condition_options} updateOffer={props.updateOffer} rule={rule} setRule={setRule} />
                </Modal.Section>
            </Modal>
        </div>
    );
}

export function ThirdTab(props){
    const [selected, setSelected] = useState(props.shop.css_options.main.borderStyle);
    const options = [
        {label: 'Compact', value: 'compact'},
        {label: 'Stack', value: 'stack'},
        {label: 'Carousel', value: 'carousel'},
        {label: 'Flex', value: 'flex'},
    ];

    const handleLayout = useCallback((value) => {
         props.updateOffer("multi_layout", value);
    }, []);
    const handleSelectChange = useCallback((value) => setSelected(value), []);

    // Space above the offer
    const handleAboveSpace = useCallback((newValue) => props.updateShop(`${newValue}px`, "css_options", "main", "marginTop"), []);
    // Space below the offer
    const handleBelowSpace = useCallback((newValue) => props.updateShop(`${newValue}px`, "css_options", "main", "marginBottom"), []);
    //Border style drop-down menu
    const handleBorderStyle = useCallback((newValue) => { 
        props.updateShop(newValue, "css_options", "main", "borderStyle");
        setSelected(newValue);
    }, []);
    const BorderOptions = [
        {label: 'No border', value: 'none'},
        {label: 'Dotted lines', value: 'dotted'},
        {label: 'Dashed line', value: 'dashed'},
        {label: 'Solid line', value: 'solid'},
        {label: 'Double line', value: 'double'},
        {label: 'Groove line', value: 'groove'},
        {label: 'Ridge line', value: 'ridge'},
        {label: 'Inset line', value: 'inset'},
        {label: 'Outset line', value: 'outset'},
        {label: 'Hidden line', value: 'hidden'},
    ];

    //Border width
    const handleBorderWidth = useCallback((newValue) => props.updateShop(parseInt(newValue), "css_options", "main", "borderWidth"), []);

    //Border range slider
    const handlesetBorderRange = useCallback((newValue) => props.updateShop(parseInt(newValue), "css_options", "main", "borderRadius"), []);

    // Toggle for manually added color
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);


    //Font options
    // const [fontSelect, setFontSelect] = useState("Dummy font 1");
    const handleFontSelect = useCallback((value)=> props.updateShop(value, "css_options", "text", "fontFamily"),[]);
    const fontOptions = [
        {label: 'None', value: 'None'},
        {label: 'Arial', value: 'Arial'},
        {label: 'Caveat', value: 'Caveat'},
        {label: 'Confortaa', value: 'Confortaa'},
        {label: 'Comic Sans MS', value: 'Comic Sans MS'},
        {label: 'Courier New', value: 'Courier New'},
        {label: 'EB Garamond', value: 'EB Garamond'},
        {label: 'Georgia', value: 'Georgia'},
        {label: 'Impact', value: 'Impact'},
        {label: 'Lexend', value: 'Lexend'},
        {label: 'Lobster', value: 'Lobster'},
        {label: 'Lora', value: 'Lora'},
        {label: 'Merriweather', value: 'Merriweather'},
        {label: 'Montserrat', value: 'Montserrat'},
        {label: 'Oswald', value: 'Oswald'},
        {label: 'Pacifico', value: 'Pacifico'},
        {label: 'Playfair Display', value: 'Playfair Display'},
        {label: 'Roboto', value: 'Roboto'},
        {label: 'Spectral', value: 'Spectral'},
        {label: 'Trebuchet MS', value: 'Trebuchet MS'},
        {label: 'Verdana', value: 'Verdana'},
      ];

    //Font weight
    const handleFontWeight = useCallback((newValue) => {
        props.updateShop(`${newValue}px`, "css_options", "text", "fontWeightInPixel");
            if(parseInt(newValue) > 400 && props.shop.css_options.text.fontWeight != "bold") {
                props.updateShop("bold", "css_options", "text", "fontWeight");
            }
            else if(parseInt(newValue) <= 400 && props.shop.css_options.text.fontWeight != "Normal" && props.shop.css_options.text.fontWeight != "inherit") {
                props.updateShop("Normal", "css_options", "text", "fontWeight");
            }
    }, []);

    //Font sizes
    const handleFontSize = useCallback((newValue) => props.updateShop(`${newValue}px`, "css_options", "text", "fontSize"), []);


    //Button options
    const handleBtnSelect = useCallback((value)=> props.updateShop(value, "css_options", "button", "fontFamily"),[]);
    const btnOptions = [
        {label: 'None', value: 'None'},
        {label: 'Arial', value: 'Arial'},
        {label: 'Caveat', value: 'Caveat'},
        {label: 'Confortaa', value: 'Confortaa'},
        {label: 'Comic Sans MS', value: 'Comic Sans MS'},
        {label: 'Courier New', value: 'Courier New'},
        {label: 'EB Garamond', value: 'EB Garamond'},
        {label: 'Georgia', value: 'Georgia'},
        {label: 'Impact', value: 'Impact'},
        {label: 'Lexend', value: 'Lexend'},
        {label: 'Lobster', value: 'Lobster'},
        {label: 'Lora', value: 'Lora'},
        {label: 'Merriweather', value: 'Merriweather'},
        {label: 'Montserrat', value: 'Montserrat'},
        {label: 'Oswald', value: 'Oswald'},
        {label: 'Pacifico', value: 'Pacifico'},
        {label: 'Playfair Display', value: 'Playfair Display'},
        {label: 'Roboto', value: 'Roboto'},
        {label: 'Spectral', value: 'Spectral'},
        {label: 'Trebuchet MS', value: 'Trebuchet MS'},
        {label: 'Verdana', value: 'Verdana'},
      ];

    //Button weight
    const handleBtnWeight = useCallback((newValue) => {
        props.updateShop(`${newValue}px`, "css_options", "button", "fontWeightInPixel");
            if(parseInt(newValue) > 400 && props.shop.css_options.button.fontWeight != "bold") {
                props.updateShop("bold", "css_options", "button", "fontWeight");
            }
            else if(parseInt(newValue) <= 400 && props.shop.css_options.button.fontWeight != "Normal" && props.shop.css_options.button.fontWeight != "inherit") {
                props.updateShop("Normal", "css_options", "button", "fontWeight");
            }
    }, []);

    //Button size
    const handleBtnSize = useCallback((newValue) => props.updateShop(`${newValue}px`, "css_options", "button", "fontSize"), []);

    // Btn radius
    const [rangeValue, setRangeValue] = useState(20);
    const handleRangeSliderChange = useCallback((newValue) => props.updateShop(parseInt(newValue), "css_options", "button", "borderRadius"), []);

    //Sketch picker
    const handleOfferBackgroundColor = useCallback((newValue) => {
        props.updateShop(newValue.hex, "css_options", "main", "backgroundColor");
    }, []);

    return(
        <div>
            <LegacyCard title="Offer box" sectioned>
                <LegacyCard.Section>
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
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField
                                label="Space above offer"
                                type="number"
                                onChange={handleAboveSpace}
                                value={parseInt(props.shop.css_options.main.marginTop)}
                                suffix="px"
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField
                                label="Space below offer"
                                type="number"
                                onChange={handleBelowSpace}
                                value={parseInt(props.shop.css_options.main.marginBottom)}
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
                                value={selected}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField
                                label="Border width"
                                type="number"
                                onChange={handleBorderWidth}
                                value={parseInt(props.shop.css_options.main.borderWidth)}
                                suffix="px"
                            />
                        </Grid.Cell>
                    </Grid>
                    <br/>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <RangeSlider
                                label="Border Radius"
                                value={parseInt(props.shop.css_options.main.borderRadius)}
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
                        <Button primary>Choose template</Button>
                    </ButtonGroup>
                    <Stack vertical>
                        <Collapsible
                            open={open}
                            id="basic-collapsible"
                            transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                            expandOnPrint
                        >
                        <br/><SketchPicker onChange={handleOfferBackgroundColor} color={props.shop.css_options.main.backgroundColor} />
                        {/*<br/><SketchPicker onChange={handleOfferBackgroundColor} color={props.shop.css_options.main.backgroundColor} />*/}
                        </Collapsible>
                    </Stack>
                </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard  title="Offer text" className="input-box" sectioned>
                <LegacyCard.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <Select
                                label="Font"
                                options={fontOptions}
                                onChange={handleFontSelect}
                                value={props.shop.css_options.text.fontFamily}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField
                                label="Weight"
                                type="number"
                                suffix="px"
                                autoComplete="off"
                                onChange={handleFontWeight}
                                value={parseInt(props.shop.css_options.text.fontWeightInPixel)}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField
                                label="Size"
                                type="number"
                                suffix="px"
                                autoComplete="off"
                                onChange={handleFontSize}
                                value={parseInt(props.shop.css_options.text.fontSize)}
                            />
                        </Grid.Cell>
                    </Grid>
                </LegacyCard.Section>
                <LegacyCard.Section title="Button text">
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <Select
                                label="Font"
                                options={btnOptions}
                                onChange={handleBtnSelect}
                                value={props.shop.css_options.button.fontFamily}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField
                                label="Weight"
                                type="number"
                                suffix="px"
                                autoComplete="off"
                                onChange={handleBtnWeight}
                                value={parseInt(props.shop.css_options.button.fontWeightInPixel)}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <TextField
                                label="Size"
                                type="number"
                                suffix="px"
                                autoComplete="off"
                                onChange={handleBtnSize}
                                value={parseInt(props.shop.css_options.button.fontSize)}
                            />
                        </Grid.Cell>
                    </Grid>
                    <br/>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <RangeSlider
                                label="Button Radius"
                                value={props.shop.css_options.button.borderRadius}
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
                    <Button>Save Draft</Button>
                    <Button primary>Publish</Button>
                </ButtonGroup>
            </LegacyStack>
            <div className="space-10"></div>
        </div>
    );
}

// Advanced Tab
export function FourthTab(props){

     const [checked, setChecked] = useState(false);
    const handleChange = useCallback((newChecked) => setChecked(newChecked), []);
    const handleProductDomSelector = useCallback((newValue) => props.updateShop(newValue,"custom_product_page_dom_selector"), []);
    const handleProductDomAction = useCallback((newValue) => props.updateShop(newValue, "custom_product_page_dom_action"), []);
    const handleCartDomSelector = useCallback((newValue) => props.updateShop(newValue,"custom_cart_page_dom_selector"), []);
    const handleCartDomAction = useCallback((newValue) => props.updateShop(newValue,"custom_cart_page_dom_action"), []);
    const handleAjaxDomSelector = useCallback((newValue) => props.updateShop(newValue,"custom_ajax_dom_selector"), []);
    const handleAjaxDomAction = useCallback((newValue) => props.updateShop(newValue, "custom_ajax_dom_action"), []);
    const handleAjaxRefreshCode = useCallback((newValue) => props.updateShop(newValue, "ajax_refresh_code"), []);
    const handleOfferCss = useCallback((newValue) => props.updateShop(newValue, "offer_css"), []);

    return(
        <>
            <LegacyCard sectioned title="Offer placement - advanced settings" actions={[{content: 'View help doc'}]}>
                <LegacyCard.Section title="Product page">
                    <TextField label="DOM Selector" value={props.shop.custom_product_page_dom_selector} onChange={handleProductDomSelector} type="text"></TextField>
                    <TextField label="DOM Action" value={props.shop.custom_product_page_dom_action} onChange={handleProductDomAction}></TextField>
                </LegacyCard.Section>
                <LegacyCard.Section title="Cart page">
                    <TextField label="DOM Selector" value={props.shop.custom_cart_page_dom_selector} onChange={handleCartDomSelector}></TextField>
                    <TextField label="DOM Action" value={props.shop.custom_cart_page_dom_action} onChange={handleCartDomAction}></TextField>
                </LegacyCard.Section>
                <LegacyCard.Section title="AJAX/Slider cart">
                    <TextField label="DOM Selector" value={props.shop.custom_ajax_dom_selector} onChange={handleAjaxDomSelector}></TextField>
                    <TextField label="DOM Action" value={props.shop.custom_ajax_dom_action} onChange={handleAjaxDomAction}></TextField>
                    <TextField label="AJAX refresh code" value={props.shop.ajax_refresh_code} onChange={handleAjaxRefreshCode} multiline={6}></TextField>
                </LegacyCard.Section>
                <LegacyCard.Section title="Custom CSS">
                    <TextField value={props.shop.offer_css} onChange={handleOfferCss} multiline={6}></TextField>
                    <br/>
                    <Checkbox
                        label="Save as default settings"
                        helpText="This placement will apply to all offers created in the future.
                         They can be edited in the Settings section."
                        checked={checked}
                        onChange={handleChange}
                    />
                </LegacyCard.Section>
            </LegacyCard>
            <div className="space-4"></div>
            <LegacyStack distribution="center">
                <ButtonGroup>
                    <Button>Save draft</Button>
                    <Button primary>Publish</Button>
                </ButtonGroup>
            </LegacyStack>
            <div className="space-10"></div>
        </>
    );
}
