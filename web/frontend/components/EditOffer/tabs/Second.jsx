import {
    LegacyCard,
    LegacyStack,
    Button,
    Checkbox,
    Select,
    Modal,
    Grid,
    Icon,
    RadioButton,
    Image, Badge, Text
} from "@shopify/polaris";
import {
    CancelMinor  } from '@shopify/polaris-icons';
import {ModalAddConditions} from "./../../modal_AddConditions";
import { useState, useCallback, useRef, useEffect } from "react";
import React from "react";
import { useSelector } from 'react-redux';
import { useAuthenticatedFetch } from "../../../hooks";
import SelectProductsModal from "../../SelectProductsModal";
import { SelectCollectionsModal } from "../../SelectCollectionsModal";
import product_page_image_1 from "../../../assets/images/product_page_image_1.png";
import product_page_image_2 from "../../../assets/images/product_page_image_2.png";
import product_page_image_3 from "../../../assets/images/product_page_image_3.png";
import cart_page_image_1 from "../../../assets/images/cart_page_image_1.png";
import cart_page_image_2 from "../../../assets/images/cart_page_image_2.png";
import cart_page_image_3 from "../../../assets/images/cart_page_image_3.png";
import ajax_cart_image_1 from "../../../assets/images/ajax_cart_image_1.png";
import ajax_cart_image_2 from "../../../assets/images/ajax_cart_image_2.png";
import ajax_cart_image_3 from "../../../assets/images/ajax_cart_image_3.png";

export function SecondTab(props) {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);

    const [selected, setSelected] = useState('cartpage');
    const [rule, setRule] = useState({ quantity: null, rule_selector: 'cart_at_least', item_type: 'product', item_shopify_id: null, item_name: null });
    const [quantityErrorText, setQuantityErrorText] = useState(null);
    const [itemErrorText, setItemErrorText] = useState(null);
    const quantityArray = ['cart_at_least', 'cart_at_most', 'cart_exactly'];
    const orderArray = ['total_at_least', 'total_at_most'];
    const [selectedItems, setSelectedItems] = useState([]);
    const [defaultSetting, setDefaultSetting] = useState(false);
    const [useTemplate, setUseTemplate] = useState(false);
    const [defaultSettingSecond, setDefaultSettingSecond] = useState(false);
    const [useTemplateSecond, setUseTemplateSecond] = useState(false);
    const [multipleDefaultSettings, setMultipleDefaultSettings] = useState(false);
    
    const [insertedImage1, setInsertedImage1] = useState(null);
    const [insertedImage2, setInsertedImage2] = useState(null);
    const [insertedImage3, setInsertedImage3] = useState(null);

    useEffect(() => {
        if(props.offer.in_product_page && props.offer.in_cart_page) {
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


    //Checked to see if offer is displayed in multiple pages of the app.
    useEffect(() => {
        setDefaultSetting(false);
        setUseTemplate(false);
        if(props.offer.in_product_page && props.offer.in_cart_page) {
            setMultipleDefaultSettings(true);
        }
        else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
            setMultipleDefaultSettings(true);
        }
        else if (props.offer.in_cart_page) {
            setMultipleDefaultSettings(false);
            if(props.offer.placement_setting && props.offer.placement_setting?.default_cart_page) {
                setDefaultSetting(true);   
            }
            else if(props.offer.placement_setting && !props.offer.placement_setting?.default_cart_page) {
                setUseTemplate(true);
                setInsertedImage1(props.templateImagesURL.cart_page_image_1);
                setInsertedImage2(props.templateImagesURL.cart_page_image_2);
                setInsertedImage3(props.templateImagesURL.cart_page_image_3);
            }
        }
        else if (props.offer.in_product_page) {
            setMultipleDefaultSettings(false);
            if(props.offer.placement_setting && props.offer.placement_setting?.default_product_page) {
                setDefaultSetting(true);   
            }
            else if(props.offer.placement_setting && !props.offer.placement_setting?.default_product_page) {
                setUseTemplate(true);
                setInsertedImage1(props.templateImagesURL.product_page_image_1);
                setInsertedImage2(props.templateImagesURL.product_page_image_2);
                setInsertedImage3(props.templateImagesURL.product_page_image_3);
            }
        }
        else if (props.offer.in_ajax_cart) {
            setMultipleDefaultSettings(false);
            if(props.offer.placement_setting && props.offer.placement_setting?.default_ajax_cart) {
                setDefaultSetting(true);
            }
            else if(props.offer.placement_setting && !props.offer.placement_setting?.default_ajax_cart) {
                setUseTemplate(true);
                setInsertedImage1(props.templateImagesURL.ajax_cart_image_1);
                setInsertedImage2(props.templateImagesURL.ajax_cart_image_2);
                setInsertedImage3(props.templateImagesURL.ajax_cart_image_3);
            }
        }
    }, [props.offer.in_cart_page, props.offer.in_ajax_cart, props.offer.in_product_page]);

    function upadteCondition() {
        if (quantityArray.includes(rule.rule_selector)) {
            if (!rule.quantity) {
                setQuantityErrorText("Required filed");
                return;
            }
            else if (rule.quantity < 1) {
                setQuantityErrorText("Quantity can't be less than 1");
                return;
            }
        }
        if (orderArray.includes(rule.rule_selector)) {
            if (!rule.item_name) {
                setItemErrorText("Required filed");
                return;
            }
            else if (rule.item_name < 1) {
                setItemErrorText("Amount can't be less than 1");
                return;
            }
        }
        else if (!rule.item_name) {
            setItemErrorText("Required field");
            return;
        }
        props.setOffer(prev => ({ ...prev, rules_json: [...prev.rules_json, rule] }));
        handleConditionModal();
    }

    const handleSelectChange = useCallback((value) => {
        if (value === "cartpage") {
            props.updateOffer("in_cart_page", true);
            props.updateOffer("in_product_page", false);
            props.updateOffer("in_ajax_cart", false);
        }
        else if (value === "productpage") {
            props.updateOffer("in_cart_page", false);
            props.updateOffer("in_product_page", true);
            props.updateOffer("in_ajax_cart", false);
        }
        else if (value === "cartpageproductpage") {
            props.updateOffer("in_cart_page", true);
            props.updateOffer("in_product_page", true);
            props.updateOffer("in_ajax_cart", false);
        }
        else if (value === "ajax") {
            props.updateOffer("in_cart_page", false);
            props.updateOffer("in_product_page", false);
            props.updateOffer("in_ajax_cart", true);
        }
        else if (value === "ajaxcartpage") {
            props.updateOffer("in_cart_page", true);
            props.updateOffer("in_product_page", false);
            props.updateOffer("in_ajax_cart", true);
        }
        setSelected(value);
    }, []);

    const options = [
        { label: 'Cart page', value: 'cartpage' },
        { label: 'Product page', value: 'productpage' },
        { label: 'Product and cart page', value: 'cartpageproductpage' },
        { label: 'AJAX cart (slider, pop up or dropdown)', value: 'ajax' },
        { label: 'AJAX and cart page', value: 'ajaxcartpage' }
    ]

    const handleDefaultSettingChange = useCallback((value, selectedPage) => {
         if(value) {
            props.enableOrDisablePublish(!value);
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    props.updateNestedAttributeOfOffer(null, "placement_setting", "template_product_id");
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page",);
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    props.updateNestedAttributeOfOffer(null, "placement_setting", "template_ajax_id");
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                setDefaultSetting(value);
                setUseTemplate(!value);
            }
            else if(props.offer.in_product_page) {
                props.updateNestedAttributeOfOffer(null, "placement_setting", "template_product_id");
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                setDefaultSetting(value);
                setUseTemplate(!value);
            }
            else if(props.offer.in_ajax_cart) {
                props.updateNestedAttributeOfOffer(null, "placement_setting", "template_ajax_id");
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                setDefaultSetting(value);
                setUseTemplate(!value);
            }
        }
        else {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                setDefaultSetting(value);
            }
            else if(props.offer.in_product_page) {
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                setDefaultSetting(value);
            }
            else if(props.offer.in_ajax_cart) {
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                setDefaultSetting(value);
            }
        }
    });
    

    const handleUseTemplateChange = useCallback((value, selectedPage) => {
        if(value) {
            props.enableOrDisablePublish(value);
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_product_page");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                setDefaultSetting(!value);
                setUseTemplate(value);
                setInsertedImage1(props.templateImagesURL.cart_page_image_1);
                setInsertedImage2(props.templateImagesURL.cart_page_image_2);
                setInsertedImage3(props.templateImagesURL.cart_page_image_3);
            }
            else if(props.offer.in_product_page) {
                props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_product_page");
                setDefaultSetting(!value);
                setUseTemplate(value);
                setInsertedImage1(props.templateImagesURL.product_page_image_1);
                setInsertedImage2(props.templateImagesURL.product_page_image_2);
                setInsertedImage3(props.templateImagesURL.product_page_image_3);
            }
            else if(props.offer.in_ajax_cart) {
                props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_ajax_cart");
                setDefaultSetting(!value);
                setUseTemplate(value);
                setInsertedImage1(props.templateImagesURL.ajax_cart_image_1);
                setInsertedImage2(props.templateImagesURL.ajax_cart_image_2);
                setInsertedImage3(props.templateImagesURL.ajax_cart_image_3);
                
            }
        }
        else {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                setUseTemplate(value);
            }
            else if(props.offer.in_product_page) {
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                setUseTemplate(value);
            }
            else if(props.offer.in_ajax_cart) {
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                setUseTemplate(value);
            }
        }
    });

    const handleDefaultSettingSecondChange = useCallback((value, selectedPage) => {
        if(value) {
            props.enableOrDisablePublish(!value);
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    props.updateNestedAttributeOfOffer(null, "placement_setting", "template_product_id");
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    props.updateNestedAttributeOfOffer(null, "placement_setting", "template_ajax_id");
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
            }
            else if(props.offer.in_product_page) {
                props.updateNestedAttributeOfOffer(null, "placement_setting", "template_product_id");
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
            }
            else if(props.offer.in_ajax_cart) {
                props.updateNestedAttributeOfOffer(null, "placement_setting", "template_ajax_id");
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
            }
        }
        else {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
            }
            else if(props.offer.in_product_page) {
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
            }
            else if(props.offer.in_ajax_cart) {
                props.updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
            }
        }
    });

    const handleUseTemplateSecondChange = useCallback((value, selectedPage) => {
        if(value) {
            props.enableOrDisablePublish(value);
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
            }
        }
        else {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
            }
        }
    });


    // Called on clickedImages that opened after checking Use Template checkbox
    const handleImageClick = useCallback((pageName, clickedImageNum) => {
        props.enableOrDisablePublish(false);
        if(pageName === 'product_page') {
            props.themeTemplateData.forEach(function(record){
                if(record.page_type == 'product' && record.position == clickedImageNum) {
                    props.updateNestedAttributeOfOffer(record.id, "placement_setting", "template_product_id"); 
                }
            });
        }
        else if(pageName === 'cart_page') {
            props.themeTemplateData.forEach(function(record){
                if(record.page_type == 'cart' && record.position == clickedImageNum) {
                    props.updateNestedAttributeOfOffer(record.id, "placement_setting", "template_cart_id");
                }
            });
        }
        else if(pageName === 'ajax_cart') {
            props.themeTemplateData.forEach(function(record){
                if(record.page_type == 'ajax' && record.position == clickedImageNum) {
                    props.updateNestedAttributeOfOffer(record.id, "placement_setting", "template_ajax_id");
                }
            });
        }
        else if(props.offer.in_product_page) {
            props.themeTemplateData.forEach(function(record){
                if(record.page_type == 'product' && record.position == clickedImageNum) {
                    props.updateNestedAttributeOfOffer(record.id, "placement_setting", "template_product_id");    
                }
            });
        }
        else if(props.offer.in_cart_page) {
            props.themeTemplateData.forEach(function(record){
                if(record.page_type == 'cart' && record.position == clickedImageNum) {
                    props.updateNestedAttributeOfOffer(record.id, "placement_setting", "template_cart_id");
                }
            });
        }
        else if(props.offer.in_ajax_cart) {
            props.themeTemplateData.forEach(function(record){
                if(record.page_type == 'ajax' && record.position == clickedImageNum) {
                    props.updateNestedAttributeOfOffer(record.id, "placement_setting", "template_ajax_id");
                }
            });
        }
    });

    const handleDisableCheckoutBtn = useCallback((newChecked) => props.updateOffer("must_accept", newChecked), []);
    const handleRemoveItiem = useCallback((newChecked) => props.updateOffer("remove_if_no_longer_valid", newChecked), []);
    //Modal controllers
    const [conditionModal, setConditionModal] = useState(false);
    const handleConditionModal = useCallback(() => {
        setConditionModal(!conditionModal), [conditionModal]
        setDefaultRule();
    });
    const modalCon = useRef(null);
    const activatorCon = modalCon;

    const [productModal, setProductModal] = useState(false);
    const [productData, setProductData] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleProductsModal = () => {
        setProductModal(prev => !prev);
    };

    async function handleSelectProductsModal() {
        if(props.offer.id!=null){
            await getSelectedItems('product');
        }
        handleProductsModal();
    }
    const modalProd = useRef(null);

    const [collectionModal, setCollectionModal] = useState(false);
    const [collectionData, setCollectionData] = useState("");
    const [selectedCollections, setSelectedCollections] = useState([]);

    const handleCollectionsModal = useCallback(() => {
        setCollectionModal(!collectionModal);
    }, [collectionModal]);

    const handleEnableAdvancedSetting = useCallback((newChecked) => {
        props.updateNestedAttributeOfOffer(newChecked, "advanced_placement_setting", "advanced_placement_setting_enabled");
    }, []);

    async function handleSelectCollectionsModal() {
        if(props.offer.id!=null){
            await getSelectedItems('collection');
        }
        handleCollectionsModal();
    }
    const modalColl = useRef(null);
    const activatorColl = modalColl;

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

    function getSelectedItems(item_type) {
        return fetch(`/api/merchant/offer/shopify_ids_from_rule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ offer: { offer_id: props.offer.id }, shop: shopAndHost.shop, rule_selector: 'on_product_this_product_or_in_collection', item_type: item_type }),
        })
            .then((response) => { return response.json() })
            .then(data => {
                const offerRulesIds = [];
                const offerRules = [...props.offer.rules_json];
                offerRules.forEach ((value) => {
                    offerRulesIds.push(value.item_shopify_id);
                });
                setSelectedItems(offerRulesIds);
                return data
            })
    }

    function addProductsRule() {
        if (Array.isArray(selectedProducts)) {
            var offerRules = [...props.offer.rules_json];
            for (var i = 0; i < selectedProducts.length; i++) {
                if(selectedProducts[i].id && !offerRules.some(hash => hash?.item_shopify_id == selectedProducts[i].id)){
                    const offer_rule = { quantity: null, rule_selector: "on_product_this_product_or_in_collection", item_type: "product", item_shopify_id: selectedProducts[i].id, item_name: selectedProducts[i].title }
                    offerRules.push(offer_rule);
                }
            }
            if(selectedProducts.length == 0) {
                var tempOfferRules = offerRules;
                tempOfferRules.forEach ((value) => {
                    if(!selectedItems.includes(value.item_shopify_id)) {
                       offerRules = offerRules.filter(item => item.item_shopify_id !== value.item_shopify_id);
                    }
                });
            }
            props.updateOffer('rules_json', offerRules);
            props.updateOffer('ruleset_type', "or");
        }
        setSelectedProducts([]);
        handleProductsModal();
    }

    function addCollectionsRule() {
        const offerRules = [...props.offer.rules_json];
        if (Array.isArray(selectedCollections)) {
            for (var i = 0; i < selectedCollections.length; i++) {
                const offer_rule = { quantity: null, rule_selector: "on_product_this_product_or_in_collection", item_type: "collection", item_shopify_id: selectedCollections[i].id, item_name: selectedCollections[i].title }
                offerRules.push(offer_rule);
            }
            props.updateOffer('rules_json', offerRules);
            props.updateOffer('ruleset_type', "or");
        }
        setSelectedCollections([]);
        handleCollectionsModal();
    }

    const setDefaultRule = () => {
        setRule({ quantity: null, rule_selector: 'cart_at_least', item_type: 'product', item_shopify_id: null, item_name: null });
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
        const condition = condition_options?.find(option => option.value === value);
        return condition ? condition.label : null;
    }

    function deleteRule(index) {
        const updatedRules = [...props.offer.rules_json];
        updatedRules.splice(index, 1);
        props.updateOffer('rules_json', updatedRules);
    }

    return (
        <div id="polaris-placement-cards">
            <LegacyCard title="Choose placement" sectioned>
                <p style={{color: '#6D7175', marginTop: '-20px', marginBottom: '23px'}}>Where would you like your offer to appear?</p>

                <LegacyStack spacing="loose" vertical>
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <Select
                                options={options}
                                onChange={handleSelectChange}
                                value={selected}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <Checkbox
                                label="Enable Advanced Setting"
                                checked={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                onChange={handleEnableAdvancedSetting}
                            />
                        </Grid.Cell>
                    </Grid>
                    {(props.offer.id == null || props.offer.id != props.autopilotCheck?.autopilot_offer_id) && (
                        <>
                            <div style={{marginBottom: '20px', marginTop: '16px'}}>
                                <Button onClick={handleSelectProductsModal} ref={modalProd} >Select Product</Button>
                            </div>

                            <Button onClick={handleSelectCollectionsModal} ref={modalColl}>Select Collection</Button>
                        </>
                    )}
                    <Modal
                        open={productModal}
                        onClose={handleProductsModal}
                        title="Select products from your store"
                        primaryAction={{
                            content: 'Save',
                            onAction: () => { addProductsRule(); },
                        }}>
                        <Modal.Section>
                            <SelectProductsModal selectedItems={selectedItems} setSelectedItems={setSelectedItems} offer={props.offer} shop={props.shop} handleProductsModal={handleProductsModal} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
                        </Modal.Section>
                    </Modal>
                    <Modal
                        open={collectionModal}
                        onClose={handleCollectionsModal}
                        title="Select collections from your store"
                        primaryAction={{
                            content: 'Save',
                            onAction: () => { addCollectionsRule(); },
                        }}>
                        <Modal.Section>
                            <SelectCollectionsModal selectedItems={selectedItems} setSelectedItems={setSelectedItems} offer={props.offer} shop={props.shop} handleCollectionsModal={handleCollectionsModal} selectedCollections={selectedCollections} setSelectedCollections={setSelectedCollections}/>
                        </Modal.Section>
                    </Modal>
                </LegacyStack>
                {
                    (multipleDefaultSettings ? (
                        (props.offer.in_product_page && props.offer.in_cart_page) ? (
                            <>
                                <hr className="legacy-card-hr legacy-card-hr-t20-b15" />

                                <div style={{paddingBottom: '12px'}}>
                                    <Text variant="headingSm" as="h2">Where on this page would you like the offer to appear?</Text>
                                </div>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 8}}>
                                        <RadioButton
                                            label="Use default settings for Product Page"
                                            checked={props.offer.placement_setting?.default_product_page}
                                            name="prod-settings"
                                            onChange={(event) => handleDefaultSettingChange(event, 'product')}
                                            disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                        />
                                    </Grid.Cell>
                                </Grid>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                                        <RadioButton
                                            label="Use Template for Product Page"
                                            checked={!props.offer.placement_setting?.default_product_page}
                                            name="prod-settings"
                                            onChange={(event) => handleUseTemplateChange(event, 'product')}
                                            disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                        />
                                    </Grid.Cell>
                                </Grid>
                                {!props.offer.placement_setting?.default_product_page && !props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled && (
                                    <>
                                        <div className="space-4" />
                                        <Image
                                            source={props.templateImagesURL.product_page_image_1}
                                            alt="Sample Image 1"
                                            style={{marginRight : '10px',marginTop: '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_product_id)?.position == 1 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('product_page', 1)}
                                        />
                                        <Image
                                            source={props.templateImagesURL.product_page_image_2}
                                            alt="Sample Image 2"
                                            style={{marginLeft : '10px', marginRight : '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_product_id)?.position == 2 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('product_page', 2)}
                                        />
                                        <Image
                                            source={props.templateImagesURL.product_page_image_3}
                                            alt="Sample Image 3"
                                            style={{marginLeft : '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_product_id)?.position == 3 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('product_page', 3)}
                                        />
                                    </>
                                )}
                                <hr className="legacy-card-hr legacy-card-hr-t20-b15" />
                                <div style={{paddingBottom: '12px'}}>
                                    <Text variant="headingSm" as="h2">Where on this page would you like the offer to appear?</Text>
                                </div>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                                        <RadioButton
                                            label="Use default settings for Cart Page"
                                            checked={props.offer.placement_setting?.default_cart_page}
                                            name="cart-settings"
                                            onChange={(event) => handleDefaultSettingSecondChange(event, 'cart')}
                                            disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                        />
                                    </Grid.Cell>
                                </Grid>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                                        <RadioButton
                                            label="Use Template for Cart Page"
                                            checked={!props.offer.placement_setting?.default_cart_page}
                                            name="cart-settings"
                                            onChange={(event) => handleUseTemplateSecondChange(event, 'cart')}
                                            disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                        />
                                    </Grid.Cell>
                                </Grid>
                                {!props.offer.placement_setting?.default_cart_page && !props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled && (
                                    <>
                                        <div className="space-4" />
                                        <Image
                                            source={props.templateImagesURL.cart_page_image_1}
                                            alt="Sample Image 1"
                                            style={{marginRight : '10px',marginTop: '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_cart_id)?.position == 1 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('cart_page', 1)}
                                        />
                                        <Image
                                            source={props.templateImagesURL.cart_page_image_2}
                                            alt="Sample Image 2"
                                            style={{marginLeft : '10px', marginRight : '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_cart_id)?.position == 2 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('cart_page', 2)}
                                        />
                                        <Image
                                            source={props.templateImagesURL.cart_page_image_3}
                                            alt="Sample Image 3"
                                            style={{marginLeft : '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_cart_id)?.position == 3 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('cart_page', 3)}
                                        />
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <hr className="legacy-card-hr legacy-card-hr-t20-b15" />
                                <div style={{paddingBottom: '12px'}}>
                                    <Text variant="headingSm" as="h2">Where on this page would you like the offer to appear?</Text>
                                </div>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                                        <RadioButton
                                            label="Use default settings for Ajax Cart"
                                            checked={props.offer.placement_setting?.default_ajax_cart}
                                            name="ajax-settings"
                                            onChange={(event) => handleDefaultSettingChange(event, 'ajax')}
                                            disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                            name="ajax-cart-settings"
                                        />
                                    </Grid.Cell>
                                </Grid>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                                        <RadioButton
                                            label="Use Template for Ajax Cart"
                                            checked={!props.offer.placement_setting?.default_ajax_cart}
                                            name="ajax-settings"
                                            onChange={(event) => handleUseTemplateChange(event, 'ajax')}
                                            disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                            name="ajax-cart-settings"
                                        />
                                    </Grid.Cell>
                                </Grid>
                                {props.shop.default_template_settings?.templateForAjaxCart && (
                                    <>
                                        <div className="space-4" />
                                        <Image
                                            source={props.templateImagesURL.ajax_cart_image_1}
                                            alt="Sample Image 1"
                                            style={{marginRight : '10px', marginTop: '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_ajax_id)?.position == 1 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('ajax_cart', 1)}
                                        />
                                        <Image
                                            source={props.templateImagesURL.ajax_cart_image_2}
                                            alt="Sample Image 2"
                                            style={{marginLeft : '10px', marginRight : '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_ajax_id)?.position == 2 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('ajax_cart', 2)}
                                        />
                                        <Image
                                            source={props.templateImagesURL.ajax_cart_image_3}
                                            alt="Sample Image 3"
                                            style={{marginLeft : '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_ajax_id)?.position == 3 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('ajax_cart', 3)}
                                        />
                                    </>
                                )}

                                <hr className="legacy-card-hr legacy-card-hr-t20-b15" />
                                <div style={{paddingBottom: '12px'}}>
                                    <Text variant="headingSm" as="h2">Where on this page would you like the offer to appear?</Text>
                                </div>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                                        <RadioButton
                                            label="Use default settings for Cart Page"
                                            checked={props.offer.placement_setting?.default_cart_page}
                                            name="cart-settings"
                                            onChange={(event) => handleDefaultSettingSecondChange(event, 'cart')}
                                            disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                            name="cart-page-settings"
                                        />
                                    </Grid.Cell>
                                </Grid>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                                        <RadioButton
                                            label="Use Template for Cart Page"
                                            checked={!props.offer.placement_setting?.default_cart_page}
                                            name="cart-settings"
                                            onChange={(event) => handleUseTemplateSecondChange(event, 'cart')}
                                            disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                            name="cart-page-settings"
                                        />
                                    </Grid.Cell>
                                </Grid>
                                {!props.offer.placement_setting?.default_cart_page && !props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled && (
                                    <>
                                        <div className="space-4" />
                                        <Image
                                            source={props.templateImagesURLcart_page_image_1}
                                            alt="Sample Image 1"
                                            style={{marginRight : '10px', marginTop: '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_cart_id)?.position == 1 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('cart_page', 1)}
                                        />
                                        <Image
                                            source={props.templateImagesURLcart_page_image_2}
                                            alt="Sample Image 2"
                                            style={{marginLeft : '10px', marginRight : '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_cart_id)?.position == 2 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('cart_page', 2)}
                                        />
                                        <Image
                                            source={props.templateImagesURLcart_page_image_3}
                                            alt="Sample Image 3"
                                            style={{marginLeft : '10px', cursor: 'pointer', width: '165px'}}
                                            className={ props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_cart_id)?.position == 3 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                            onClick={() => handleImageClick('cart_page', 3)}
                                        />
                                    </>
                                )}
                            </>
                        )
                    ) : (
                        <>
                            <hr className="legacy-card-hr legacy-card-hr-t20-b15" />
                            <div style={{paddingBottom: '12px'}}>
                                <Text variant="headingSm" as="h2">Where on this page would you like the offer to appear?</Text>
                            </div>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                                    <RadioButton
                                        label="Use default settings"
                                        checked={defaultSetting}
                                        onChange={(event) => handleDefaultSettingChange(event, null)}
                                        disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                        name="product-settings"
                                    />
                                </Grid.Cell>
                            </Grid>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 6, xl: 6}}>
                                    <RadioButton
                                        label="Use Template"
                                        checked={useTemplate}
                                        onChange={(event) => handleUseTemplateChange(event, null)}
                                        disabled={props.offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                        name="product-settings"
                                    />
                                </Grid.Cell>
                            </Grid>
                            {useTemplate && (
                                <>
                                    <div className="space-4" />
                                    <Image
                                        source={insertedImage1}
                                        alt="Sample Image 1"
                                        style={{marginRight : '10px', marginTop: '10px', cursor: 'pointer', width: '165px'}}
                                        className={ props.offer.in_cart_page ? (props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_cart_id)?.position == 1 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_product_page ? (props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_product_id)?.position == 1 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_ajax_cart ? (props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_ajax_id)?.position == 1 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : 'editOfferTabs_image_tag')) }
                                        onClick={() => handleImageClick(null, 1)}
                                    />
                                    <Image
                                        source={insertedImage2}
                                        alt="Sample Image 2"
                                        style={{marginLeft : '10px', marginRight : '10px', cursor: 'pointer', width: '165px'}}
                                        className={ props.offer.in_cart_page ? (props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_cart_id)?.position == 2 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_product_page ? (props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_product_id)?.position == 2 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_ajax_cart ? (props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_ajax_id)?.position == 2 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : 'editOfferTabs_image_tag')) }
                                        onClick={() => handleImageClick(null, 2)}
                                    />
                                    <Image
                                        source={insertedImage3}
                                        alt="Sample Image 3"
                                        style={{marginLeft : '10px', cursor: 'pointer', width: '165px'}}
                                        className={ props.offer.in_cart_page ? (props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_cart_id)?.position == 3 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_product_page ? (props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_product_id)?.position == 3 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_ajax_cart ? (props.themeTemplateData?.find(item => item['id'] === props.offer.placement_setting?.template_ajax_id)?.position == 3 ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : 'editOfferTabs_image_tag')) }
                                        onClick={() => handleImageClick(null, 3)}
                                    />
                                </>
                            )}
                        </>
                    ))
                }

            </LegacyCard>
            <div className="space-10" />

            {(props.offer.id == null || props.offer.id != props.autopilotCheck?.autopilot_offer_id) && (
                <>
                    <LegacyCard title="Display Conditions" sectioned>

                        {props.offer?.rules_json?.length===0 ? (
                            <p style={{color: '#6D7175', marginTop: '-10px', marginBottom: '14px'}}>None selected (show offer to all customer)</p>
                        ) : (
                            <>{Array.isArray(props.offer.rules_json) && props.offer.rules_json.map((rule, index) => (
                                <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <div style={{marginRight: '10px', display: "inline-block"}}>
                                        {getLabelFromValue(rule.rule_selector)}: &nbsp;
                                        <Badge>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                {rule.quantity && <p style={{color: 'blue', marginRight: '3px'}}>{rule.quantity} &nbsp; - &nbsp;</p> }
                                                <p style={{color: 'blue', marginRight: '3px'}}><b>{rule.item_name}</b></p>
                                                <p style={{cursor: 'pointer'}} onClick={() => deleteRule(index)}>
                                                    <Icon source={CancelMinor} color="critical" />
                                                </p>
                                            </div>
                                        </Badge>
                                    </div>
                                    {/*{getLabelFromValue(rule.rule_selector)}: &nbsp; {rule.quantity} <b>{rule.item_name}</b>*/}
                                </li>
                            ))}</>
                        )}
                        <Button onClick={handleConditionModal} ref={modalCon}>Add condition</Button>
                        <div className="space-4" />
                        <hr className="legacy-card-hr legacy-card-hr-t20-b15" />
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
                    </LegacyCard>
                </>
                )}
            <div className="space-10" />

            <div className="space-4"></div>
                <LegacyStack distribution="center">
                    <Button onClick={props.handleTabChange}>Continue to Appearance</Button>
                </LegacyStack>
            <div className="space-10"></div>
            <Modal
                activator={activatorCon}
                open={conditionModal}
                onClose={handleConditionModal}
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

