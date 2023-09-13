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
    Image} from "@shopify/polaris";
import {
    CancelMajor  } from '@shopify/polaris-icons';
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
    const [defaultTemplateSettings, setDefaultTemplateSettings] = useState({
        defaultSettingsForProductPage: false,
        defaultSettingsForAjaxCart: false,
        defaultSettingsForCartPage: false,
        templateForProductPage: false,
        templateForAjaxCart: false,
        templateForCartPage: false,
    });
    const [insertedImage1, setInsertedImage1] = useState(null);
    const [insertedImage2, setInsertedImage2] = useState(null);
    const [insertedImage3, setInsertedImage3] = useState(null);

    const [productIsClicked, setProductIsClicked] = useState([false, false, false]);
    const [cartIsClicked, setCartIsClicked] = useState([false, false, false]);
    const [ajaxIsClicked, setAjaxIsClicked] = useState([false, false, false]);

    const defaultSettingsToDisplayOffer = {
        Dawn: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'after',
            ajax_cart_selector: '.cart-notification-product',
            ajax_cart_action: 'before'
        },
        Colorblock: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'before',
            ajax_cart_selector: '.cart-notification-product',
            ajax_cart_action: 'before'
        },
        Publisher: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'after',
            ajax_cart_selector: '.cart-item:first',
            ajax_cart_action: 'before'
        },
        Crave: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'after',
            ajax_cart_selector: '.cart-notification-product',
            ajax_cart_action: 'before'
        },
        Studio: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'after',
            ajax_cart_selector: '.cart-notification-product',
            ajax_cart_action: 'before'
        },
        Taste: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'after',
            ajax_cart_selector: '.cart-notification-product ',
            ajax_cart_action: 'before'
        },
        Spotlight: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'after',
            ajax_cart_selector: '.cart-notification-product',
            ajax_cart_action: 'before'
        },
        Ride: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'after',
            ajax_cart_selector: '.cart-notification-product',
            ajax_cart_action: 'before'
        },
        Origin: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'after',
            ajax_cart_selector: '.cart-item:first',
            ajax_cart_action: 'before'
        },
        Sense: {
            cart_page_selector: '.cart-items',
            cart_page_action: 'before',
            product_page_selector: "[class*='product__description']",
            product_page_action: 'before',
            ajax_cart_selector: '#cart-notification-product',
            ajax_cart_action: 'before'
        },
        Craft: {
            cart_page_selector: '.cart-items',
            cart_page_action: 'before',
            product_page_selector: "[class*='product__description']",
            product_page_action: 'before',
            ajax_cart_selector: '#cart-notification-product',
            ajax_cart_action: 'before'
        },
        Refresh: {
            cart_page_selector: '#cart',
            cart_page_action: 'before',
            product_page_selector: '.product-form',
            product_page_action: 'before',
            ajax_cart_selector: '#CartDrawer-Form',
            ajax_cart_action: 'prepend'
        }
    };
    const useTemplatesToDisplayOffer = {
        Refresh: {
            cart_page_selector: ['.cart-items', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ["[class*='product__description']", '.product-form__quantity', '.product-form__quantity'],
            product_page_action: ['before', 'before', 'after'],
            ajax_cart_selector: ['#CartDrawer-Form', '#cart-notification-button', '#cart-notification-button'],
            ajax_cart_action: ['prepend', 'before', 'before']
        },
        Craft: {
            cart_page_selector: ['.cart-items', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ["[class*='product__description']", '.product-form__quantity', '.product-form__quantity'],
            product_page_action: ['before', 'before', 'after'],
            ajax_cart_selector: ['#cart-notification-product', '#cart-notification-button', '#cart-notification-button'],
            ajax_cart_action: ['before', 'before', 'before']
        },
        Sense: {
            cart_page_selector: ['.cart-items', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ["[class*='product__description']", '.product-form__quantity', '.product-form__quantity'],
            product_page_action: ['before', 'before', 'after'],
            ajax_cart_selector: ['#cart-notification-product', '#cart-notification-button', '#cart-notification-button'],
            ajax_cart_action: ['before', 'before', 'before']
        },
        Origin: {
            cart_page_selector: ['#cart', '#cart__ctas', '#cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ['.product-form', '.product-form__quantity', '.product-form__quantity'],
            product_page_action: ['after', 'before', 'after'],
            ajax_cart_selector: ['.cart-item:first', '.drawer__footer', '.drawer__footer'],
            ajax_cart_action: ['before', 'prepend', 'prepend']
        },
        Ride: {
            cart_page_selector: ['#cart', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ['.product-form', '.product-form__buttons', '.product-form__buttons'],
            product_page_action: ['after', 'before', 'after'],
            ajax_cart_selector: ['#cart-notification-product', '.cart-notification-product', '.cart-notification-product'],
            ajax_cart_action: ['before', 'after', 'after']
        },
        Spotlight: {
            cart_page_selector: ['#cart', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ['.product-form', '.product-form__buttons', '.product-form__buttons'],
            product_page_action: ['after', 'before', 'after'],
            ajax_cart_selector: ['#cart-notification-product', '.cart-notification-product', '.cart-notification-product'],
            ajax_cart_action: ['before', 'after', 'after']
        },
        Taste: {
            cart_page_selector: ['#cart', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ['.product-form', '.product-form__buttons', '.product-form__buttons'],
            product_page_action: ['after', 'before', 'after'],
            ajax_cart_selector: ['#cart-notification-product', '.cart-notification-product', '.cart-notification-product'],
            ajax_cart_action: ['before', 'after', 'after']
        },
        Studio: {
            cart_page_selector: ['#cart', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ['.product-form', '.product-form__buttons', '.product-form__buttons'],
            product_page_action: ['after', 'before', 'after'],
            ajax_cart_selector: ['#cart-notification-product', '.cart-notification-product', '.cart-notification-product'],
            ajax_cart_action: ['before', 'after', 'after']
        },
        Crave: {
            cart_page_selector: ['#cart', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ['.product-form', '.product-form__buttons', '.product-form__buttons'],
            product_page_action: ['after', 'before', 'after'],
            ajax_cart_selector: ['#cart-notification-product', '.cart-notification-product', '.cart-notification-product'],
            ajax_cart_action: ['before', 'after', 'after']
        },
        Publisher: {
            cart_page_selector: ['#cart', '#cart__ctas', '#cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ['.product-form', '.product-form__quantity', '.product-form__quantity'],
            product_page_action: ['after', 'before', 'after'],
            ajax_cart_selector: ['.cart-item:first', '.drawer__footer', '.drawer__footer'],
            ajax_cart_action: ['before', 'prepend', 'prepend']
        },
        Colorblock: {
            cart_page_selector: ['#cart', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ['.product-form', '.product-form__buttons', '.product-form__buttons'],
            product_page_action: ['before', 'before', 'after'],
            ajax_cart_selector: ['#cart-notification-product', '.cart-notification-product', '.cart-notification-product'],
            ajax_cart_action: ['before', 'after', 'after']
        },
        Dawn: {
            cart_page_selector: ['#cart', '.cart__ctas', '.cart__ctas'],
            cart_page_action: ['before', 'before', 'after'],
            product_page_selector: ['.product-form', '.product-form__buttons', '.product-form__buttons'],
            product_page_action: ['after', 'before', 'after'],
            ajax_cart_selector: ['#cart-notification-product', '.cart-notification-product', '.cart-notification-product'],
            ajax_cart_action: ['before', 'after', 'after']
        }
    }

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
            if(props.shop.default_template_settings && props.shop.default_template_settings.defaultSettingsForCartPage) {
                setDefaultSetting(true);   
            }
            else if(props.shop.default_template_settings && props.shop.default_template_settings.templateForCartPage) {
                setUseTemplate(true);
                setInsertedImage1(cart_page_image_1);
                setInsertedImage2(cart_page_image_2);
                setInsertedImage3(cart_page_image_3);
            }
        }
        else if (props.offer.in_product_page) {
            setMultipleDefaultSettings(false);
            if(props.shop.default_template_settings && props.shop.default_template_settings.defaultSettingsForProductPage) {
                setDefaultSetting(true);   
            }
            else if(props.shop.default_template_settings && props.shop.default_template_settings.templateForProductPage) {
                setUseTemplate(true);
                setInsertedImage1(product_page_image_1);
                setInsertedImage2(product_page_image_2);
                setInsertedImage3(product_page_image_3);
            }
        }
        else if (props.offer.in_ajax_cart) {
            setMultipleDefaultSettings(false);
            if(props.shop.default_template_settings && props.shop.default_template_settings.defaultSettingsForAjaxCart) {
                setDefaultSetting(true);
            }
            else if(props.shop.default_template_settings && props.shop.default_template_settings.templateForAjaxCart) {
                setUseTemplate(true);
                setInsertedImage1(ajax_cart_image_1);
                setInsertedImage2(ajax_cart_image_2);
                setInsertedImage2(ajax_cart_image_3);
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
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    const newArray = [...cartIsClicked];
                    newArray[0] = false;
                    newArray[1] = false;
                    newArray[2] = false;
                    setCartIsClicked(newArray);
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_action, "custom_cart_page_dom_action");
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_selector, "custom_cart_page_dom_selector");
                    props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                    props.updateShop(!value, "default_template_settings", "templateForCartPage");
                }
                else if(selectedPage == "product") {
                    const newArray = [...productIsClicked];
                    newArray[0] = false;
                    newArray[1] = false;
                    newArray[2] = false;
                    setProductIsClicked(newArray);
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].product_page_action, "custom_product_page_dom_action");
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].product_page_selector, "custom_product_page_dom_selector");
                    props.updateShop(value, "default_template_settings", "defaultSettingsForProductPage");
                    props.updateShop(!value, "default_template_settings", "templateForProductPage");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    const newArray = [...cartIsClicked];
                    newArray[0] = false;
                    newArray[1] = false;
                    newArray[2] = false;
                    setCartIsClicked(newArray);
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].cart_page_action, "custom_cart_page_dom_action");
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].cart_page_selector, "custom_cart_page_dom_selector");
                    props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                    props.updateShop(!value, "default_template_settings", "templateForCartPage");
                }
                else if(selectedPage == "ajax") {
                    const newArray = [...ajaxIsClicked];
                    newArray[0] = false;
                    newArray[1] = false;
                    newArray[2] = false;
                    setAjaxIsClicked(newArray);
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_action, "custom_ajax_dom_action");
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_selector, "custom_ajax_dom_selector");
                    props.updateShop(value, "default_template_settings", "defaultSettingsForAjaxCart");
                    props.updateShop(!value, "default_template_settings", "templateForAjaxCart");
                }
            }
            else if(props.offer.in_cart_page) {
                const newArray = [...cartIsClicked];
                newArray[0] = false;
                newArray[1] = false;
                newArray[2] = false;
                setCartIsClicked(newArray);
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].cart_page_action, "custom_cart_page_dom_action");
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].cart_page_selector, "custom_cart_page_dom_selector");
                props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                props.updateShop(!value, "default_template_settings", "templateForCartPage");
                setDefaultSetting(value);
                setUseTemplate(!value);
            }
            else if(props.offer.in_product_page) {
                const newArray = [...productIsClicked];
                newArray[0] = false;
                newArray[1] = false;
                newArray[2] = false;
                setProductIsClicked(newArray);
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].product_page_action, "custom_product_page_dom_action");
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].product_page_selector, "custom_product_page_dom_selector");
                props.updateShop(value, "default_template_settings", "defaultSettingsForProductPage");
                props.updateShop(!value, "default_template_settings", "templateForProductPage");
                setDefaultSetting(value);
                setUseTemplate(!value);
            }
            else if(props.offer.in_ajax_cart) {
                const newArray = [...ajaxIsClicked];
                newArray[0] = false;
                newArray[1] = false;
                newArray[2] = false;
                setAjaxIsClicked(newArray);
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_action, "custom_ajax_dom_action");
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_selector, "custom_ajax_dom_selector");
                props.updateShop(value, "default_template_settings", "defaultSettingsForAjaxCart");
                props.updateShop(!value, "default_template_settings", "templateForAjaxCart");
                setDefaultSetting(value);
                setUseTemplate(!value);
            }
        }
        else {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                }
                else if(selectedPage == "product") {
                    props.updateShop(value, "default_template_settings", "defaultSettingsForProductPage");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                }
                else if(selectedPage == "ajax") {
                    props.updateShop(value, "default_template_settings", "defaultSettingsForAjaxCart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                setDefaultSetting(value);
            }
            else if(props.offer.in_product_page) {
                props.updateShop(value, "default_template_settings", "defaultSettingsForProductPage");
                setDefaultSetting(value);
            }
            else if(props.offer.in_ajax_cart) {
                props.updateShop(value, "default_template_settings", "defaultSettingsForAjaxCart");
                setDefaultSetting(value);
            }
        }
    });
    

    const handleUseTemplateChange = useCallback((value, selectedPage) => {
        if(value) {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(!value, "default_template_settings", "defaultSettingsForCartPage");
                    props.updateShop(value, "default_template_settings", "templateForCartPage");
                }
                else if(selectedPage == "product") {
                    props.updateShop(!value, "default_template_settings", "defaultSettingsForProductPage");
                    props.updateShop(value, "default_template_settings", "templateForProductPage");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(!value, "default_template_settings", "defaultSettingsForCartPage");
                    props.updateShop(value, "default_template_settings", "templateForCartPage");
                }
                else if(selectedPage == "ajax") {
                    props.updateShop(!value, "default_template_settings", "defaultSettingsForAjaxCart");
                    props.updateShop(value, "default_template_settings", "templateForAjaxCart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateShop(!value, "default_template_settings", "defaultSettingsForCartPage");
                props.updateShop(value, "default_template_settings", "templateForCartPage");
                setDefaultSetting(!value);
                setUseTemplate(value);
                setInsertedImage1(cart_page_image_1);
                setInsertedImage2(cart_page_image_2);
                setInsertedImage3(cart_page_image_3);
            }
            else if(props.offer.in_product_page) {
                props.updateShop(!value, "default_template_settings", "defaultSettingsForProductPage");
                props.updateShop(value, "default_template_settings", "templateForProductPage");
                setDefaultSetting(!value);
                setUseTemplate(value);
                setInsertedImage1(product_page_image_1);
                setInsertedImage2(product_page_image_2);
                setInsertedImage3(product_page_image_3);
            }
            else if(props.offer.in_ajax_cart) {
                props.updateShop(!value, "default_template_settings", "defaultSettingsForAjaxCart");
                props.updateShop(value, "default_template_settings", "templateForAjaxCart");
                setDefaultSetting(!value);
                setUseTemplate(value);
                setInsertedImage1(ajax_cart_image_1);
                setInsertedImage2(ajax_cart_image_2);
                setInsertedImage2(ajax_cart_image_3);
                
            }
        }
        else {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(value, "default_template_settings", "templateForCartPage");
                }
                else if(selectedPage == "product") {
                    props.updateShop(value, "default_template_settings", "templateForProductPage");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(value, "default_template_settings", "templateForCartPage");
                }
                else if(selectedPage == "ajax") {
                    props.updateShop(value, "default_template_settings", "templateForAjaxCart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateShop(value, "default_template_settings", "templateForCartPage");
                setUseTemplate(value);
            }
            else if(props.offer.in_product_page) {
                props.updateShop(value, "default_template_settings", "templateForProductPage");
                setUseTemplate(value);
            }
            else if(props.offer.in_ajax_cart) {
                props.updateShop(value, "default_template_settings", "templateForAjaxCart");
                setUseTemplate(value);
            }
        }
    });

    const handleDefaultSettingSecondChange = useCallback((value, selectedPage) => {
        if(value) {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    const newArray = [...cartIsClicked];
                    newArray[0] = false;
                    newArray[1] = false;
                    newArray[2] = false;
                    setCartIsClicked(newArray);
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_action, "custom_cart_page_dom_action");
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_selector, "custom_cart_page_dom_selector");
                    props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                    props.updateShop(!value, "default_template_settings", "templateForCartPage");
                }
                else if(selectedPage == "product") {
                    const newArray = [...productIsClicked];
                    newArray[0] = false;
                    newArray[1] = false;
                    newArray[2] = false;
                    setProductIsClicked(newArray);
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].product_page_action, "custom_product_page_dom_action");
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].product_page_selector, "custom_product_page_dom_selector");
                    props.updateShop(value, "default_template_settings", "defaultSettingsForProductPage");
                    props.updateShop(!value, "default_template_settings", "templateForProductPage");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    const newArray = [...cartIsClicked];
                    newArray[0] = false;
                    newArray[1] = false;
                    newArray[2] = false;
                    setCartIsClicked(newArray);
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].cart_page_action, "custom_cart_page_dom_action");
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].cart_page_selector, "custom_cart_page_dom_selector");
                    props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                    props.updateShop(!value, "default_template_settings", "templateForCartPage");
                }
                else if(selectedPage == "ajax") {
                    const newArray = [...ajaxIsClicked];
                    newArray[0] = false;
                    newArray[1] = false;
                    newArray[2] = false;
                    setAjaxIsClicked(newArray);
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_action, "custom_ajax_dom_action");
                    props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_selector, "custom_ajax_dom_selector");
                    props.updateShop(value, "default_template_settings", "defaultSettingsForAjaxCart");
                    props.updateShop(!value, "default_template_settings", "templateForAjaxCart");
                }
            }
            else if(props.offer.in_cart_page) {
                const newArray = [...cartIsClicked];
                    newArray[0] = false;
                    newArray[1] = false;
                    newArray[2] = false;
                    setCartIsClicked(newArray);
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].cart_page_action, "custom_cart_page_dom_action");
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].cart_page_selector, "custom_cart_page_dom_selector");
                props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                props.updateShop(!value, "default_template_settings", "templateForCartPage");
            }
            else if(props.offer.in_product_page) {
                const newArray = [...cartIsClicked];
                newArray[0] = false;
                newArray[1] = false;
                newArray[2] = false;
                setCartIsClicked(newArray);
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].product_page_action, "custom_product_page_dom_action");
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].product_page_selector, "custom_product_page_dom_selector");
                props.updateShop(value, "default_template_settings", "defaultSettingsForProductPage");
                props.updateShop(!value, "default_template_settings", "templateForProductPage");
            }
            else if(props.offer.in_ajax_cart) {
                const newArray = [...cartIsClicked];
                newArray[0] = false;
                newArray[1] = false;
                newArray[2] = false;
                setCartIsClicked(newArray);
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_action, "custom_ajax_dom_action");
                props.updateShop(defaultSettingsToDisplayOffer[props.shopifyThemeName].ajax_cart_selector, "custom_ajax_dom_selector");
                props.updateShop(value, "default_template_settings", "defaultSettingsForAjaxCart");
                props.updateShop(!value, "default_template_settings", "templateForAjaxCart");
            }
        }
        else {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                }
                else if(selectedPage == "product") {
                    props.updateShop(value, "default_template_settings", "defaultSettingsForProductPage");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
                }
                else if(selectedPage == "ajax") {
                    props.updateShop(value, "default_template_settings", "defaultSettingsForAjaxCart");
                }
            }
            else if(props.offer.in_cart_page) {
                props.updateShop(value, "default_template_settings", "defaultSettingsForCartPage");
            }
            else if(props.offer.in_product_page) {
                props.updateShop(value, "default_template_settings", "defaultSettingsForProductPage");
            }
            else if(props.offer.in_ajax_cart) {
                props.updateShop(value, "default_template_settings", "defaultSettingsForAjaxCart");
            }
        }
    });

    const handleUseTemplateSecondChange = useCallback((value, selectedPage) => {
        if(value) {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(!value, "default_template_settings", "defaultSettingsForCartPage");
                    props.updateShop(value, "default_template_settings", "templateForCartPage");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(!value, "default_template_settings", "defaultSettingsForCartPage");
                    props.updateShop(value, "default_template_settings", "templateForCartPage");
                }
            }
        }
        else {
            if(props.offer.in_product_page && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(value, "default_template_settings", "templateForCartPage");
                }
            }
            else if(props.offer.in_ajax_cart && props.offer.in_cart_page) {
                if(selectedPage == "cart") {
                    props.updateShop(value, "default_template_settings", "templateForCartPage");
                }
            }
        }
    });


    // Called on clickedImages that opened after checking Use Template checkbox
    const handleImageClick = useCallback((pageName, clickedImageNum) => {
        if(pageName === 'product_page') {
            const newArray = [...productIsClicked];
            newArray[0] = false;
            newArray[1] = false;
            newArray[2] = false;
            newArray[clickedImageNum-1] = true;
            setProductIsClicked(newArray);
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].product_page_selector[clickedImageNum-1], "custom_product_page_dom_selector");
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].product_page_action[clickedImageNum-1], "custom_product_page_dom_action");
        }
        else if(pageName === 'cart_page') {
            const newArray = [...cartIsClicked];
            newArray[0] = false;
            newArray[1] = false;
            newArray[2] = false;
            newArray[clickedImageNum-1] = true;
            setCartIsClicked(newArray);
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].cart_page_selector[clickedImageNum-1], "custom_cart_page_dom_selector");
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].cart_page_action[clickedImageNum-1], "custom_cart_page_dom_action");
        }
        else if(pageName === 'ajax_cart') {
            const newArray = [...ajaxIsClicked];
            newArray[0] = false;
            newArray[1] = false;
            newArray[2] = false;
            newArray[clickedImageNum-1] = true;
            setAjaxIsClicked(newArray);
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].ajax_cart_selector[clickedImageNum-1], "custom_ajax_dom_selector");
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].ajax_cart_action[clickedImageNum-1], "custom_ajax_dom_action");
        }
        else if(props.offer.in_product_page) {
            const newArray = [...productIsClicked];
            newArray[0] = false;
            newArray[1] = false;
            newArray[2] = false;
            newArray[clickedImageNum-1] = true;
            setProductIsClicked(newArray);
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].product_page_selector[clickedImageNum-1], "custom_product_page_dom_selector");
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].product_page_action[clickedImageNum-1], "custom_product_page_dom_action");
        }
        else if(props.offer.in_cart_page) {
            const newArray = [...cartIsClicked];
            newArray[0] = false;
            newArray[1] = false;
            newArray[2] = false;
            newArray[clickedImageNum-1] = true;
            setCartIsClicked(newArray);
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].cart_page_selector[clickedImageNum-1], "custom_cart_page_dom_selector");
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].cart_page_action[clickedImageNum-1], "custom_cart_page_dom_action");
        }
        else if(props.offer.in_ajax_cart) {
            const newArray = [...ajaxIsClicked];
            newArray[0] = false;
            newArray[1] = false;
            newArray[2] = false;
            newArray[clickedImageNum-1] = true;
            setAjaxIsClicked(newArray);
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].ajax_cart_selector[clickedImageNum-1], "custom_ajax_dom_selector");
            props.updateShop(useTemplatesToDisplayOffer[props.shopifyThemeName].ajax_cart_action[clickedImageNum-1], "custom_ajax_dom_action");
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
                setSelectedItems(data.item_shopify_ids);
                return data
            })
    }

    function addProductsRule() {
        if (Array.isArray(selectedProducts)) {
            const offerRules = [...props.offer.rules_json];
            for (var i = 0; i < selectedProducts.length; i++) {
                console.log("Selected Prod", selectedProducts[i]);
                if(selectedProducts[i].id){
                    const offer_rule = { quantity: null, rule_selector: "on_product_this_product_or_in_collection", item_type: "product", item_shopify_id: selectedProducts[i].id, item_name: selectedProducts[i].title }
                    offerRules.push(offer_rule);
                }
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
        const condition = condition_options.find(option => option.value === value);
        return condition ? condition.label : null;
    }

    function deleteRule(index) {
        const updatedRules = [...props.offer.rules_json];
        updatedRules.splice(index, 1);
        props.updateOffer('rules_json', updatedRules);
    }

    return (
        <div>
            <LegacyCard title="Choose placement" sectioned>
                <LegacyCard.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <Select
                                options={options}
                                onChange={handleSelectChange}
                                value={selected}
                            />
                        </Grid.Cell>
                    </Grid>
                    {(props.offer.id == null || props.offer.id != props.autopilotCheck?.autopilot_offer_id) && (
                    <>
                        <div className="space-4"></div>
                        <Button onClick={handleSelectProductsModal} ref={modalProd} >Select Product</Button>
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
                    {(props.offer.id == null || props.offer.id != props.autopilotCheck?.autopilot_offer_id) && (
                    <>
                        <div className="space-4"></div>
                        <Button onClick={handleSelectCollectionsModal} ref={modalColl}>Select Collection</Button>
                    </>
                    )}
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
                </LegacyCard.Section>
                {multipleDefaultSettings ? (
                    (props.offer.in_product_page && props.offer.in_cart_page) ? (
                        <>
                            <LegacyCard.Section title="Where on this page would you like the offer to appear?">
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                    <RadioButton 
                                        label="Use default settings for Product Page"
                                        checked={props.shop.default_template_settings?.defaultSettingsForProductPage}
                                        name="prod-settings"
                                        onChange={(event) => handleDefaultSettingChange(event, 'product')}
                                    />
                                </Grid.Cell>
                            </Grid>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                    <RadioButton 
                                        label="Use Template for Product Page"
                                        checked={props.shop.default_template_settings?.templateForProductPage}
                                        name="prod-settings"
                                        onChange={(event) => handleUseTemplateChange(event, 'product')}
                                    />
                                </Grid.Cell>
                            </Grid>
                            {props.shop.default_template_settings?.templateForProductPage && (
                                <>
                                    <Image
                                        source={product_page_image_1}
                                        alt="Sample Image 1"
                                        style={{marginRight : '10px',marginTop: '10px', height: '150px', width: '165px'}}
                                        className={ productIsClicked[0] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('product_page', 1)}
                                    />
                                    <Image
                                        source={product_page_image_2}
                                        alt="Sample Image 2"
                                        style={{marginLeft : '10px', marginRight : '10px', height: '150px', width: '165px'}}
                                        className={ productIsClicked[1] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('product_page', 2)}
                                    />
                                    <Image
                                        source={product_page_image_3}
                                        alt="Sample Image 3"
                                        style={{marginLeft : '10px', height: '150px', width: '165px'}}
                                        className={ productIsClicked[2] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('product_page', 3)}
                                    />
                                </>
                            )}
                            </LegacyCard.Section>
                            <LegacyCard.Section title="Where on this page would you like the offer to appear?">
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                    <RadioButton 
                                        label="Use default settings for Cart Page"
                                        checked={props.shop.default_template_settings?.defaultSettingsForCartPage}
                                        name="cart-settings"
                                        onChange={(event) => handleDefaultSettingSecondChange(event, 'cart')}
                                    />
                                </Grid.Cell>
                            </Grid>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                    <RadioButton 
                                        label="Use Template for Cart Page"
                                        checked={props.shop.default_template_settings?.templateForCartPage}
                                        name="cart-settings"
                                        onChange={(event) => handleUseTemplateSecondChange(event, 'cart')}
                                    />
                                </Grid.Cell>
                            </Grid>
                            {props.shop.default_template_settings?.templateForCartPage && (
                                <>
                                    <Image
                                        source={cart_page_image_1}
                                        alt="Sample Image 1"
                                        style={{marginRight : '10px',marginTop: '10px', height: '150px', width: '165px'}}
                                        className={ cartIsClicked[0] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('cart_page', 1)}
                                    />
                                    <Image
                                        source={cart_page_image_2}
                                        alt="Sample Image 2"
                                        style={{marginLeft : '10px', marginRight : '10px', height: '150px', width: '165px'}}
                                        className={ cartIsClicked[1] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('cart_page', 2)}
                                    />
                                    <Image
                                        source={cart_page_image_3}
                                        alt="Sample Image 3"
                                        style={{marginLeft : '10px', height: '150px', width: '165px'}}
                                        className={ cartIsClicked[2] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('cart_page', 3)}
                                    />
                                </>
                            )}
                            </LegacyCard.Section>
                        </>
                        ) : (
                        <>
                            <LegacyCard.Section title="Where on this page would you like the offer to appear?">
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                    <Checkbox
                                        label="Use default settings for Ajax Cart"
                                        checked={props.shop.default_template_settings?.defaultSettingsForAjaxCart}
                                        onChange={(event) => handleDefaultSettingChange(event, 'ajax')}
                                    />
                                </Grid.Cell>
                            </Grid>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                    <Checkbox
                                        label="Use Template for Ajax Cart"
                                        checked={props.shop.default_template_settings?.templateForAjaxCart}
                                        onChange={(event) => handleUseTemplateChange(event, 'ajax')}
                                    />
                                </Grid.Cell>
                            </Grid>
                            {props.shop.default_template_settings?.templateForAjaxCart && (
                                <>
                                    <Image
                                        source={ajax_cart_image_1}
                                        alt="Sample Image 1"
                                        style={{marginRight : '10px', marginTop: '10px', height: '150px', width: '165px'}}
                                        className={ ajaxIsClicked[0] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('ajax_cart', 1)}
                                    />
                                    <Image
                                        source={ajax_cart_image_2}
                                        alt="Sample Image 2"
                                        style={{marginLeft : '10px', marginRight : '10px', height: '150px', width: '165px'}}
                                        className={ ajaxIsClicked[1] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('ajax_cart', 2)}
                                    />
                                    <Image
                                        source={ajax_cart_image_3}
                                        alt="Sample Image 3"
                                        style={{marginLeft : '10px', height: '150px', width: '165px'}}
                                        className={ ajaxIsClicked[2] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('ajax_cart', 3)}
                                    />
                                </>
                            )}
                            </LegacyCard.Section>
                            <LegacyCard.Section title="Where on this page would you like the offer to appear?">
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                    <Checkbox
                                        label="Use default settings for Cart Page"
                                        checked={props.shop.default_template_settings?.defaultSettingsForCartPage}
                                        onChange={(event) => handleDefaultSettingSecondChange(event, 'cart')}
                                    />
                                </Grid.Cell>
                            </Grid>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                    <Checkbox
                                        label="Use Template for Cart Page"
                                        checked={props.shop.default_template_settings?.templateForCartPage}
                                        onChange={(event) => handleUseTemplateSecondChange(event, 'cart')}
                                    />
                                </Grid.Cell>
                            </Grid>
                            {props.shop.default_template_settings?.templateForCartPage && (
                                <>
                                    <Image
                                        source={cart_page_image_1}
                                        alt="Sample Image 1"
                                        style={{marginRight : '10px', marginTop: '10px', height: '150px', width: '165px'}}
                                        className={ cartIsClicked[0] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('cart_page', 1)}
                                    />
                                    <Image
                                        source={cart_page_image_2}
                                        alt="Sample Image 2"
                                        style={{marginLeft : '10px', marginRight : '10px', height: '150px', width: '165px'}}
                                        className={ cartIsClicked[1] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('cart_page', 2)}
                                    />
                                    <Image
                                        source={cart_page_image_3}
                                        alt="Sample Image 3"
                                        style={{marginLeft : '10px', height: '150px', width: '165px'}}
                                        className={ cartIsClicked[2] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag'}
                                        onClick={() => handleImageClick('cart_page', 3)}
                                    />
                                </>
                            )}
                            </LegacyCard.Section>
                        </>
                    )
                    ) : (
                    <LegacyCard.Section title="Where on this page would you like the offer to appear?">
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <Checkbox
                                label="Use default settings"
                                checked={defaultSetting}
                                onChange={(event) => handleDefaultSettingChange(event, null)}
                            />
                        </Grid.Cell>
                    </Grid>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <Checkbox
                                label="Use Template"
                                checked={useTemplate}
                                onChange={(event) => handleUseTemplateChange(event, null)}
                            />
                        </Grid.Cell>
                    </Grid>
                    {useTemplate && (
                        <>
                            <Image
                                source={insertedImage1}
                                alt="Sample Image 1"
                                style={{marginRight : '10px', marginTop: '10px', height: '150px', width: '165px'}}
                                className={ props.offer.in_cart_page ? (cartIsClicked[0] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_product_page ? (productIsClicked[0] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_ajax_cart ? (ajaxIsClicked[0] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : 'editOfferTabs_image_tag')) }
                                onClick={() => handleImageClick(null, 1)}
                            />
                            <Image
                                source={insertedImage2}
                                alt="Sample Image 2"
                                style={{marginLeft : '10px', marginRight : '10px', height: '150px', width: '165px'}}
                                className={ props.offer.in_cart_page ? (cartIsClicked[1] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_product_page ? (productIsClicked[1] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_ajax_cart ? (ajaxIsClicked[1] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : 'editOfferTabs_image_tag')) }
                                onClick={() => handleImageClick(null, 2)}
                            />
                            <Image
                                source={insertedImage3}
                                alt="Sample Image 3"
                                style={{marginLeft : '10px', height: '150px', width: '165px'}}
                                className={ props.offer.in_cart_page ? (cartIsClicked[2] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_product_page ? (productIsClicked[2] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : (props.offer.in_ajax_cart ? (ajaxIsClicked[2] ? 'editOfferTabs_image_clicked' : 'editOfferTabs_image_tag') : 'editOfferTabs_image_tag')) }
                                onClick={() => handleImageClick(null, 3)}
                            />
                        </>
                    )}
                    </LegacyCard.Section>
                )}
            </LegacyCard>
            {(props.offer.id == null || props.offer.id != props.autopilotCheck?.autopilot_offer_id) && (
                <>
                    <LegacyCard title="Display Conditions" sectioned>
                        <LegacyCard.Section>
                            {props.offer?.rules_json?.length===0 ? (
                                <p>None selected (show offer to all customer)</p>
                            ) : (
                                <>{Array.isArray(props.offer.rules_json) && props.offer.rules_json.map((rule, index) => (
                                    <li key={index} style={{ display: 'flex', alignItems: 'center' }}>{getLabelFromValue(rule.rule_selector)} {rule.quantity} <b>{rule.item_name}</b>
                                        <p onClick={() => deleteRule(index)}>
                                            <Icon source={CancelMajor} color="critical" />
                                        </p>
                                    </li>
                                ))}</>
                            )}
                            <br />
                            <Button onClick={handleConditionModal} ref={modalCon}>Add condition</Button>
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
                </>
                )}
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
