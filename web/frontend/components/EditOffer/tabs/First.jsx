import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {
    Badge,
    Button,
    ButtonGroup,
    Checkbox, Collapsible,
    Icon,
    LegacyCard,
    LegacyStack,
    Modal,
    RadioButton,
    Select,
    Spinner,
    Text,
    TextField
} from "@shopify/polaris";

import {InfoMinor} from '@shopify/polaris-icons';
import {ModalAddProduct} from "./../../modal_AddProduct";
import {useAuthenticatedFetch} from "../../../hooks";

export function FirstTab(props) {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const handleTitleChange = useCallback((newValue) => props.updateOffer("title", newValue), []);
    const handleTextChange = useCallback((newValue) => {
        props.updateOffer("text_a", newValue);
        if (props.offer.offerable_product_details.length > 0) {
            props.updateCheckKeysValidity("text", newValue.replace("{{ product_title }}", props.offer.offerable_product_details[0].title));
        } else {
            props.updateCheckKeysValidity("text", newValue);
        }
    }, [props.offer.offerable_product_details]);

    const handleAltTextChange = useCallback((newValue) => props.updateOffer("text_b", newValue), []);
    const handleBtnChange = useCallback((newValue) => {
        props.updateOffer("cta_a", newValue);
        props.updateCheckKeysValidity('cta', newValue);
    }, []);
    const handleAltBtnChange = useCallback((newValue) => props.updateOffer("cta_b", newValue), []);
    //checkbox controls
    // const [removeImg, setRemoveImg] = useState(false);
    // const [removePriceCheck, setRemovePriceCheck] = useState(false);
    const [removeComparePrice, setRemoveComparePrice] = useState(false);
    const [removeProductPage, setRemoveProductPage] = useState(false);
    const [removeQtySelector, setRemoveQtySelector] = useState(false);
    const [autoDiscount, setAutoDiscount] = useState(false);
    const [addCustomtext, setAddCustomtext] = useState(false);

    const handleAbChange = useCallback((newChecked) => props.updateOffer("uses_ab_test", newChecked), []);
    const handleImageChange = useCallback((newChecked) => props.updateOffer("show_product_image", !newChecked), []);
    const handlePriceChange = useCallback((newChecked) => props.updateOffer("show_product_price", !newChecked), []);
    const handleCompareChange = useCallback((newChecked) => props.updateOffer("show_compare_at_price", !newChecked), []);
    const handleProductPageChange = useCallback((newChecked) => props.updateOffer("link_to_product", !newChecked), []);
    const handleQtySelectorChange = useCallback((newChecked) => props.updateOffer("show_quantity_selector", !newChecked), []);
    const handleDiscountChange = useCallback((newChecked) => {
        if (newChecked) {
            props.updateOffer("discount_target_type", "code");
        } else {
            props.updateOffer("discount_target_type", "none");
        }
    }, []);
    const handleDiscountCodeChange = useCallback((value) => props.updateOffer("discount_code", value), []);
    const handleCustomTextChange = useCallback((newChecked) => props.updateOffer("show_custom_field", newChecked), []);
    const handleShowNoThanksChange = useCallback((newChecked) => props.updateOffer("show_nothanks", !newChecked), []);

    //modal controls
    const [productModal, setProductModal] = useState(false);
    const [productData, setProductData] = useState("");
    const handleModal = useCallback(() => {
        setProductModal(!productModal);
    }, [productModal]);
    const handleModalCloseEvent = useCallback(() => {
        props.updateOffer("included_variants", {...props.initialVariants});
        for (var i = 0; i < productData.length; i++) {
            if (!Object.keys(props.initialVariants).includes(productData[i].id.toString())) {
                productData[i].variants = [];
            }
        }
        setProductModal(false);
    }, [props.initialVariants, productData, props.offer.offerable_product_shopify_ids]);
    const modalRef = useRef(null);
    const activator = modalRef;

    //Available Products
    const [query, setQuery] = useState("");
    const [resourceListLoading, setResourceListLoading] = useState(false);

    //Called from chiled modal_AddProduct.jsx when the text in searchbox changes
    function updateQuery(childData) {
        setResourceListLoading(true);
        fetch(`/api/merchant/element_search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({product: {query: childData, type: 'product'}, shop: shopAndHost.shop}),
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                for (var i = 0; i < data.length; i++) {
                    if (!Object.keys(props.offer.included_variants).includes(data[i].id.toString())) {
                        data[i].variants = [];
                    }
                }
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
        setResourceListLoading(true);
        fetch(`/api/merchant/element_search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({product: {query: query, type: 'product'}, shop: shopAndHost.shop}),
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                for (var i = 0; i < data.length; i++) {
                    if (!Object.keys(props.offer.included_variants).includes(data[i].id.toString())) {
                        data[i].variants = [];
                    }
                }
                setProductData(data);
                setSelectedItems(props.offer.offerable_product_shopify_ids);
                setSelectedProducts(props.offer.offerable_product_shopify_ids)
                setResourceListLoading(false);
            })
            .catch((error) => {
                console.log("# Error getProducts > ", JSON.stringify(error));
            })
    }

    //Called when the save button of popup modal is clicked
    function updateProducts() {
        var product_title_str = "Would you like to add a {{ product_title }}?";

        if (selectedProducts.length == 0) {
            props.updateOffer("included_variants", {});
            setProductData("");
            props.updateCheckKeysValidity("text", product_title_str);
        } else if (selectedProducts.length > 1) {
            props.updateCheckKeysValidity("text", "");
            props.updateOffer("text_a", "");
        } else if (selectedProducts.length <= 1) {
            props.updateCheckKeysValidity("text", product_title_str);
            props.updateOffer("text_a", product_title_str);
        }
        props.updateOffer("offerable_product_details", []);
        props.updateOffer("offerable_product_shopify_ids", []);
        props.updateInitialVariants(props.offer.included_variants);
        var responseCount = 0;
        for (var i = 0; i < selectedProducts.length; i++) {
            fetch(`/api/merchant/products/multi/${selectedProducts[i]}?shop_id=${props.shop.shop_id}&shop=${shopAndHost.shop}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    data.available_json_variants = data.available_json_variants.filter((o) => props.offer.included_variants[data.id].includes(o.id))
                    props.updateProductsOfOffer(data);
                    if (responseCount == 0 && selectedProducts.length <= 1) {
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

    //For autopilot section

    const [autopilotButtonText, setAutopilotButtonText] = useState(props.autopilotCheck.isPending);
    const [autopilotQuantity, setAutopilotQuantity] = useState(props.offer?.autopilot_quantity);
    const autopilotQuantityOptions = [
        {label: '1 (recommended)', value: 1},
        {label: '2', value: 2},
        {label: '3', value: 3},
        {label: '4', value: 4},
        {label: '5', value: 5}
    ];

    const navigateTo = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setAutopilotButtonText(
            props.autopilotCheck.isPending === "complete"
                ? "Configure Autopilot Settings"
                : props.autopilotCheck.isPending === "in progress"
                    ? "setting up..."
                    : "Launch Autopilot"
        );
    }, [props.autopilotCheck])

    useEffect(() => {
        if (props.offer.id != null && props.offer.id == props.autopilotCheck?.autopilot_offer_id && props.offer.autopilot_quantity != props.offer.offerable_product_details.length) {
            var tempArray = [];
            for (var i = 0; i < props.offer?.autopilot_quantity; i++) {
                if (props.offer.offerable_product_details.length > i) {
                    tempArray[i] = props.offer.offerable_product_details[i];
                }
            }
            props.updateOffer("offerable_product_details", tempArray);
        }
    }, [props.autopilotCheck?.autopilot_offer_id, props.offer.offerable_product_shopify_ids]);

    const handleAutoPilotQuantityChange = useCallback((value) => {
        var tempArray = [];
        for (var i = 0; i < parseInt(value); i++) {
            if (props.initialOfferableProductDetails.length > i) {
                tempArray[i] = props.initialOfferableProductDetails[i];
            }
        }
        props.updateOffer("offerable_product_details", tempArray);
        setAutopilotQuantity(parseInt(value));
        props.updateOffer("autopilot_quantity", parseInt(value));
    }, [props.initialOfferableProductDetails]);

    const handleAutopilotExcludedTags = useCallback((value) => {
        props.updateOffer("excluded_tags", value);
    }, []);

    const handleLayoutRadioClicked = useCallback((value) => {
        props.updateOffer("multi_layout", value);
    }, []);

    // Called to enable the autopilot feature
    function enableAutopilot() {
        if (autopilotButtonText === "Configure Autopilot Settings") {
            if (!props.openAutopilotSection) {
                fetch(`/api/merchant/autopilot_details?shop=${shopAndHost.shop}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        localStorage.setItem('Offer-ID', data.autopilot_offer_id);
                        navigateTo('/edit-offer-view', { state: { offerID: data.autopilot_offer_id } });
                    })
                    .catch((error) => {
                        console.log("# Error AutopilotDetails > ", JSON.stringify(error));
                    })
            }
        } else {
            setIsLoading(true);
            fetch(`/api/merchant/enable_autopilot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({shop_id: props.shop.shop_id, shop: shopAndHost.shop}),
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    checkAutopilotStatus();
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log("# Error updateProducts > ", JSON.stringify(error));
                })
        }
    }


    function checkAutopilotStatus() {
        fetch(`/api/merchant/enable_autopilot_status?shop_id=${props.shop.shop_id}&shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setAutopilotButtonText(
                    data.message === "complete"
                        ? "Configure Autopilot Settings"
                        : data.message === "in progress"
                            ? "setting up..."
                            : "Launch Autopilot"
                );
                if (data.message != 'complete') {
                    checkAutopilotStatus();
                }
            })
            .catch((error) => {
                console.log("# Error updateProducts > ", JSON.stringify(error));
            })
    }

    const publishButtonFuntional =
        props.enableOrDisablePublish &&
        useCallback((newValue) => props.enableOrDisablePublish(newValue), []);

    useEffect(() => {
        if (publishButtonFuntional) {
            publishButtonFuntional(!(props.offer.offerable_product_details.length > 0 && props.offer.title !== '' && (props.offer.uses_ab_test ? (props.offer.text_b.length > 0 && props.offer.cta_b.length > 0) : true)))
        }
    }, [props.offer.offerable_product_details.length, props.offer.title, props.offer.uses_ab_test, props.offer.text_b, props.offer.cta_b]);


    //Collapsible controls
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
        <div id="first-tab-offer">
            {isLoading ? (
                <div style={{
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}>
                    <Spinner size="large" color="teal"/>
                </div>
            ) : (
                <>
                    <LegacyCard title="Offer Product" actions={[{content: 'Learn about Autopilot'}]} sectioned>
                        <LegacyStack spacing="loose" vertical>
                            {(props.autopilotCheck?.autopilot_offer_id != props.offer.id || !props.autopilotCheck?.autopilot_offer_id) && (
                                <p style={{color: '#6D7175'}}>What product would you like to have in the offer?</p>
                            )}

                            {props.offer.id == null && !props.autopilotCheck?.autopilot_offer_id ? (
                                <>
                                    <div style={{marginBottom: '20px'}}>
                                        <Button id={"btnLaunchAI"}
                                                primary
                                                onClick={() => enableAutopilot()}>{autopilotButtonText}</Button>
                                    </div>

                                    <Button id={"btnSelectProduct"} onClick={() => {
                                        handleModal();
                                        getProducts();
                                    }} ref={modalRef}>Select product manually</Button>
                                </>
                            ) : (props.offer?.id != props.autopilotCheck?.autopilot_offer_id || !props.autopilotCheck?.autopilot_offer_id) && (
                                <div>
                                    <Button id={"btnSelectProduct"} onClick={() => {
                                        handleModal();
                                        getProducts();
                                    }} ref={modalRef}>Select product manually</Button>
                                </div>
                            )}

                            {(props.offer.id == null && !props.autopilotCheck?.autopilot_offer_id) && (
                                <ButtonGroup>
                                    <>
                                        <div>
                                            <div style={{display: 'flex'}}>
                                                <Icon source={InfoMinor} color="base"/>
                                                <Link to="/subscription" style={{marginLeft: '5px'}}>
                                                    Autopilot is available on the Paid Plan.
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                </ButtonGroup>
                            )}

                            {props.offer.offerable_product_details.length > 0 && (
                                <b>Selected Products:
                                    <br/>
                                    <div className="space-2" />
                                    {props.offer.offerable_product_details.map((value, index) => (
                                        <div style={{marginRight: '10px', display: "inline-block"}}>
                                            <Badge>
                                                <p style={{color: 'blue'}}>{props.offer.offerable_product_details[index].title}</p>
                                            </Badge>
                                        </div>
                                    ))}
                                </b>
                            )}

                        </LegacyStack>
                        {props.openAutopilotSection || (props.offer.id != null && props.autopilotCheck?.autopilot_offer_id == props.offer.id) && (
                            <>
                                <LegacyStack spacing="loose" vertical>
                                    <Select
                                        label="How many products would you like the customer to be able to choose from in the offer?"
                                        options={autopilotQuantityOptions}
                                        onChange={handleAutoPilotQuantityChange}
                                        value={autopilotQuantity}
                                    />
                                </LegacyStack>
                                <LegacyStack vertical>
                                    <RadioButton
                                        label="Stack"
                                        checked={props.offer.multi_layout === 'stack'}
                                        onChange={() => handleLayoutRadioClicked('stack')}
                                    />
                                    <RadioButton
                                        label="Carousel"
                                        checked={props.offer.multi_layout === 'carousel'}
                                        onChange={() => handleLayoutRadioClicked('carousel')}
                                    />
                                </LegacyStack>
                                <LegacyStack spacing="loose" vertical>
                                    <TextField
                                        label="Exclude products with a tag"
                                        helpText="Autopilot will not suggest any product with this tag."
                                        value={props.offer?.excluded_tags}
                                        onChange={handleAutopilotExcludedTags}
                                    />
                                </LegacyStack>
                            </>
                        )}
                    </LegacyCard>
                    <div className="space-10" />

                    <LegacyCard title="Text" sectioned>
                        <LegacyStack spacing="loose" vertical>
                            {(props.offer.id == null || props.offer.id != props.autopilotCheck?.autopilot_offer_id) && (
                                <>
                                    <TextField
                                        label="Offer title"
                                        placeholder='Offer #1'
                                        value={props.offer.title}
                                        onChange={handleTitleChange}
                                        autoComplete="off"
                                        helpText="This title will only be visible to you so you can reference it internally"
                                    />
                                </>
                            )}
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
                            {props.offer.uses_ab_test && <hr className="legacy-card-hr legacy-card-hr-t20-b15" />}
                            <Checkbox id={"abTesting"}
                                label="Enable A/B testing"
                                checked={props.offer.uses_ab_test}
                                onChange={handleAbChange}
                            />
                            <Collapsible
                                open={props.offer.uses_ab_test}
                                id="basic-collapsible"
                                transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                            >
                                {!props.offerSettings.has_ab_testing ? (
                                    <div style={{maxWidth: '476px', marginTop: '10px'}}>
                                        <Text as="p" variant="headingSm" fontWeight="regular">
                                            A/B testing is available on our Professional plan. Please <Link
                                            to="/subscription">upgrade your subscription</Link> to enable it.
                                        </Text>
                                    </div>
                                ) : (
                                    <>
                                        <TextField
                                            label="Alternative offer text"
                                            placeholder='Take advantage of this limited offer'
                                            autoComplete="off"
                                            value={props.offer.text_b}
                                            onChange={handleAltTextChange}
                                        />

                                        <div className="space-4" />

                                        <TextField
                                            label="Alternative button text"
                                            placeholder='Add to cart'
                                            autoComplete="off"
                                            value={props.offer.cta_b}
                                            onChange={handleAltBtnChange}
                                        />
                                    </>
                                )}
                               <Collapsible
                                    open = {(props.offer.cta_b === '' && props.offer.text_b != '') || (props.offer.cta_b != '' && props.offer.text_b === '')}
                                    transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                                    expandOnPrint
                                >
                                    <br/>
                                    <Text color="critical">
                                        If you are A/B testing, you must have a B version of both the Offer Text and the Button Text.
                                    </Text>
                                </Collapsible>                                
                            </Collapsible>
                        </LegacyStack>
                    </LegacyCard>
                    <div className="space-10"/>

                    <LegacyCard title="Display options" sectioned>
                        <LegacyStack spacing="baseTight" vertical>
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
                            {props.offer.discount_target_type == "code" && (
                                <div>
                                    <TextField
                                        label="Discount Code"
                                        value={props.offer.discount_code}
                                        onChange={handleDiscountCodeChange}
                                        autoComplete="off"
                                    />
                                    <p>Make sure you have already set up this discount code in your <Link
                                        to={`https://admin.shopify.com/store/${shopAndHost.shop.replace(/\.myshopify\.com$/, '')}/discounts`}
                                        target="blank">discount code</Link> section.
                                        The discount will apply automatically at checkout
                                    </p>
                                </div>
                            )}
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
                            <Checkbox id={"showNoThanks"}
                                      checked={!props.offer.show_nothanks}
                                      onChange={handleShowNoThanksChange}
                                      label="Customer can't dismiss offer"
                            />
                        </LegacyStack>
                    </LegacyCard>
                    <div className="space-10"/>

                    <div className="space-4"/>
                    <LegacyStack distribution="center">
                        <Button onClick={props.handleTabChange}>Continue To Placement</Button>
                    </LegacyStack>

                    <div className="space-10"></div>
                    {/* Modal */}
                    <Modal
                        activator={activator}
                        open={productModal}
                        onClose={handleModalCloseEvent}
                        title="Select products from your store"
                        primaryAction={{
                            content: 'Save',
                            onAction: updateProducts,
                            disabled: selectedItems.length === 0
                        }}
                    >
                        <ModalAddProduct selectedItems={selectedItems} setSelectedItems={setSelectedItems}
                                         offer={props.offer} updateQuery={updateQuery} shop_id={props.shop.shop_id}
                                         productData={productData} resourceListLoading={resourceListLoading}
                                         setResourceListLoading={setResourceListLoading}
                                         updateSelectedProduct={updateSelectedProduct}/>
                    </Modal>
                </>
            )}
        </div>
    );
}
