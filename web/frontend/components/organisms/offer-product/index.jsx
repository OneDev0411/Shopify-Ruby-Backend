import React, {useCallback, useEffect, useRef, useState, useContext} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { OfferContext } from "../../../contexts/OfferContext.jsx";
import {useShopState} from "../../../contexts/ShopContext.jsx";

import {
    Badge,
    Button,
    ButtonGroup,
    Icon,
    LegacyCard,
    LegacyStack,
    Modal,
    RadioButton,
    Select,
    TextField
} from "@shopify/polaris";

import {InfoMinor} from '@shopify/polaris-icons';
import {ModalAddProduct} from "./../../modal_AddProduct";
import {useAuthenticatedFetch} from "../../../hooks";
import { AutopilotQuantityOptions } from "../../../shared/constants/EditOfferOptions";

const OfferProduct = (props) => {
    const { offer, updateOffer, updateProductsOfOffer, updateIncludedVariants } = useContext(OfferContext);
    const { shopSettings } = useShopState();
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    //modal controls
    const [productModal, setProductModal] = useState(false);
    const [productData, setProductData] = useState("");
    const handleModal = useCallback(() => {
        setProductModal(!productModal);
    }, [productModal]);
    const handleModalCloseEvent = useCallback(() => {
        updateOffer("included_variants", {...props.initialVariants});
        for (var i = 0; i < productData.length; i++) {
            if (!Object.keys(props.initialVariants).includes(productData[i].id.toString())) {
                productData[i].variants = [];
            }
        }
        setProductModal(false);
    }, [props.initialVariants, productData, offer.offerable_product_shopify_ids]);
    const modalRef = useRef(null);
    const activator = modalRef;

    //Available Products
    const [query, setQuery] = useState("");
    const [resourceListLoading, setResourceListLoading] = useState(false);

    //Called from chiled modal_AddProduct.jsx when the text in searchbox changes
    function updateQuery(childData) {
        setResourceListLoading(true);
        fetch(`/api/v2/merchant/element_search`, {
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
                    if (!Object.keys(offer.included_variants).includes(data[i].id.toString())) {
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
        updateIncludedVariants(selectedItem, selectedVariants);
    }

    //Called when "select product manually button clicked"
    function getProducts() {
        setResourceListLoading(true);
        fetch(`/api/v2/merchant/element_search`, {
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
                    if (!Object.keys(offer.included_variants).includes(data[i].id.toString())) {
                        data[i].variants = [];
                    }
                }
                setProductData(data);
                setSelectedItems(offer.offerable_product_shopify_ids);
                setSelectedProducts(offer.offerable_product_shopify_ids)
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
            updateOffer("included_variants", {});
            setProductData("");
            props.updateCheckKeysValidity("text", product_title_str);
        } else if (selectedProducts.length > 1) {
            props.updateCheckKeysValidity("text", "");
            updateOffer("text_a", "");
        } else if (selectedProducts.length <= 1) {
            props.updateCheckKeysValidity("text", product_title_str);
            updateOffer("text_a", product_title_str);
        }
        updateOffer("offerable_product_details", []);
        updateOffer("offerable_product_shopify_ids", []);
        props.updateInitialVariants(offer.included_variants);
        var responseCount = 0;
        const promises = selectedProducts.map((productId) =>
            fetch(`/api/v2/merchant/products/multi/${productId}?shop_id=${shopSettings.shop_id}&shop=${shopAndHost.shop}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .catch((error) => {
                console.log("# Error updateProducts > ", error.message);
                throw error;
            })
        );
        Promise.all(promises)
            .then((responses) => {
                // 'responses' will contain the data in the same order as the requests
                for (var i = 0; i < responses.length; i++) {
                    var data = responses[i]
                    data.available_json_variants = data.available_json_variants.filter((o) => offer.included_variants[data.id].includes(o.id))
                    updateProductsOfOffer(data);
                    if (responseCount == 0 && selectedProducts.length <= 1) {
                        props.updateCheckKeysValidity("text", offer.text_a.replace("{{ product_title }}", data.title));
                        props.updateCheckKeysValidity('cta', offer.cta_a);
                    }
                    responseCount++;
                }
                handleModal();
            })
            .catch((error) => {
                console.log("# Error updateProducts > ", JSON.stringify(error));
            });
    }

    //For autopilot section

    const [openAutopilotSection, setOpenAutopilotSection] = useState(false);
    const [autopilotButtonText, setAutopilotButtonText] = useState(props.autopilotCheck.isPending);
    const [autopilotQuantity, setAutopilotQuantity] = useState(offer?.autopilot_quantity);

    const navigateTo = useNavigate();

    useEffect(() => {
        fetch(`/api/v2/merchant/autopilot_details?shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
          .then((response) => {
              return response.json()
          })
          .then((data) => {
              props.setAutopilotCheck(data);

              setAutopilotButtonText(
                data.isPending === "complete"
                  ? "Configure Autopilot Settings"
                  : data.isPending === "in progress"
                    ? "setting up..."
                    : "Launch Autopilot"
              );
          })
          .catch((error) => {
              console.log("# Error AutopilotDetails > ", JSON.stringify(error));
          })
    }, [])

    useEffect(() => {
        if (offer.id != null && offer.id == props.autopilotCheck?.autopilot_offer_id && offer.autopilot_quantity != offer.offerable_product_details.length) {
            var tempArray = [];
            for (var i = 0; i < offer?.autopilot_quantity; i++) {
                if (offer.offerable_product_details.length > i) {
                    tempArray[i] = offer.offerable_product_details[i];
                }
            }
            updateOffer("offerable_product_details", tempArray);
        }
    }, [props.autopilotCheck?.autopilot_offer_id, offer.offerable_product_shopify_ids]);

    const handleAutoPilotQuantityChange = useCallback((value) => {
        var tempArray = [];
        for (var i = 0; i < parseInt(value); i++) {
            if (props.initialOfferableProductDetails.length > i) {
                tempArray[i] = props.initialOfferableProductDetails[i];
            }
        }
        updateOffer("offerable_product_details", tempArray);
        setAutopilotQuantity(parseInt(value));
        updateOffer("autopilot_quantity", parseInt(value));
    }, [props.initialOfferableProductDetails]);

    const handleAutopilotExcludedTags = useCallback((value) => {
        updateOffer("excluded_tags", value);
    }, []);

    const handleLayoutRadioClicked = useCallback((value) => {
        updateOffer("multi_layout", value);
    }, []);

    // Called to enable the autopilot feature
    function enableAutopilot() {
        if (autopilotButtonText === "Configure Autopilot Settings") {
            if (!openAutopilotSection) {
                fetch(`/api/v2/merchant/autopilot_details?shop=${shopAndHost.shop}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        updateOpenAutopilotSection(true);
                        navigateTo('/edit-offer', { state: { offerID: data.autopilot_offer_id } });
                    })
                    .catch((error) => {
                        console.log("# Error AutopilotDetails > ", JSON.stringify(error));
                    })
            }
        } else if (autopilotButtonText === "Launch Autopilot") {
            props.setIsLoading(true);
            fetch(`/api/v2/merchant/enable_autopilot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({shop_id: shopSettings.shop_id, shop: shopAndHost.shop}),
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    checkAutopilotStatus();
                    props.setIsLoading(false);
                })
                .catch((error) => {
                    console.log("# Error updateProducts > ", JSON.stringify(error));
                })
        }
    }


    function checkAutopilotStatus() {
        fetch(`/api/v2/merchant/enable_autopilot_status?shop_id=${shopSettings.shop_id}&shop=${shopAndHost.shop}`, {
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

    //Called to update the openAutopilotSection attribute
    function updateOpenAutopilotSection(value) {
        setOpenAutopilotSection(value);
    }

    return (
        <>
            {/* <LegacyCard title="Offer Product" actions={[{content: 'Learn about Autopilot'}]} sectioned> */}
            <LegacyCard title="Offer Product" sectioned>
                <LegacyStack spacing="loose" vertical>
                    {(props.autopilotCheck?.autopilot_offer_id != offer.id || !props.autopilotCheck?.autopilot_offer_id) && (
                        <p style={{color: '#6D7175'}}>What product would you like to have in the offer?</p>
                    )}

                    {offer.id == null && !props.autopilotCheck?.autopilot_offer_id && shopSettings.has_pro_features ? (
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
                    ) : (offer?.id != props.autopilotCheck?.autopilot_offer_id || !props.autopilotCheck?.autopilot_offer_id) && (
                        <div>
                            <Button id={"btnSelectProduct"} onClick={() => {
                                handleModal();
                                getProducts();
                            }} ref={modalRef}>Select product manually</Button>
                        </div>
                    )}

                    {(!shopSettings.has_pro_features) && (
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

                    {offer.offerable_product_details.length > 0 && (
                        <b>Selected Products:
                            <br/>
                            <div className="space-2" />
                            {offer.offerable_product_details.map((value, index) => (
                                <div key={index} style={{marginRight: '10px', display: "inline-block"}}>
                                    <Badge>
                                        <p style={{color: 'blue'}}>{offer.offerable_product_details[index].title}</p>
                                    </Badge>
                                </div>
                            ))}
                        </b>
                    )}

                </LegacyStack>
                {(openAutopilotSection || (offer.id != null && props.autopilotCheck?.autopilot_offer_id == offer.id)) && (
                    <>
                        <LegacyStack spacing="loose" vertical>
                            <Select
                                label="How many products would you like the customer to be able to choose from in the offer?"
                                options={AutopilotQuantityOptions}
                                onChange={handleAutoPilotQuantityChange}
                                value={autopilotQuantity}
                            />
                        </LegacyStack>
                        <LegacyStack vertical>
                            <RadioButton
                                label="Stack"
                                checked={offer.multi_layout === 'stack'}
                                onChange={() => handleLayoutRadioClicked('stack')}
                            />
                            <RadioButton
                                label="Carousel"
                                checked={offer.multi_layout === 'carousel'}
                                onChange={() => handleLayoutRadioClicked('carousel')}
                            />
                        </LegacyStack>
                        <LegacyStack spacing="loose" vertical>
                            <TextField
                                label="Exclude products with a tag"
                                helpText="Autopilot will not suggest any product with this tag."
                                value={offer?.excluded_tags}
                                onChange={handleAutopilotExcludedTags}
                            />
                        </LegacyStack>
                    </>
                )}
            </LegacyCard>
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
                                    offer={offer} updateQuery={updateQuery} shop_id={shopSettings.shop_id}
                                    productData={productData} resourceListLoading={resourceListLoading}
                                    setResourceListLoading={setResourceListLoading}
                                    updateSelectedProduct={updateSelectedProduct}/>
            </Modal>
        </>
    );
}

export default OfferProduct;
