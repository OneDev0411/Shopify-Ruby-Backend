import { Select, TextField, LegacyStack } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SearchProductsList } from './SearchProductsList';
import { countriesList } from "../components/countries.js";
import { useAuthenticatedFetch } from "../hooks";

export function ModalAddConditions(props) {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [queryValue, setQueryValue] = useState(null);
  const [productData, setProductData] = useState("");
  const [item, setItem] = useState("product");
  const [resourceListLoading, setResourceListLoading] = useState(false);

  const item_options = [
    { label: "Product", value: "product" },
    { label: "Collection", value: "collection" }
  ]
  function findProduct() {
    return (props.rule.rule_selector === 'cart_at_least' || props.rule.rule_selector === 'cart_at_most' || props.rule.rule_selector === 'cart_exactly' || props.rule.rule_selector === 'cart_does_not_contain' || props.rule.rule_selector === 'cart_contains_variant' || props.rule.rule_selector === 'cart_does_not_contain_variant' || props.rule.rule_selector === 'cart_contains_item_from_vendor' || props.rule.rule_selector === 'on_product_this_product_or_in_collection' || props.rule.rule_selector === 'on_product_not_this_product_or_not_in_collection')
  }

  function inputAmount() {
    return props.rule.rule_selector === 'total_at_least' || props.rule.rule_selector === 'total_at_most'
  }

  function inputCountry() {
    return props.rule.rule_selector === 'in_location' || props.rule.rule_selector === 'not_in_location'
  }

  const handleChange = (value, id) => {
    props.setRule(prev => ({ ...prev, [id]: value }))
  }

  const handleItemChange = (value) => {
    setItem(value);
  }

  function updateQuery(childData) {
    setResourceListLoading(true);
    fetch('/api/merchant/element_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: shopAndHost.shop, product: { query: childData, type: item }, json: true }),
    })
      .then((response) => { return response.json(); })
      .then((data) => {
        setResourceListLoading(false);
        setProductData(data);
      })
      .catch((error) => {
      })
  }

  const handleQueryValueChange = useCallback((value) => {
    setQueryValue(value);
    updateQuery(value);
  }, [item],
  );

  function updateSelectedProduct(title, id, selectedVariants) {
    const shopify_id = Array.isArray(id) ? id[id.length-1] : id;
    props.setRule(prev => ({ ...prev, item_type: item, item_shopify_id: shopify_id, item_name: title }))
  }

  function countryOptions(){
    const names = [{ value: '', label: 'Select a country' }]
    countriesList.map(([code, name]) => {
      names.push({ value: code, label: name })
    })
    return names;
  }

  return (
    <>
      <LegacyStack distribution='fillEvenly'>
        <LegacyStack.Item>
          <Select
            label="Condition"
            options={props.condition_options}
            id='rule_selector'
            onChange={handleChange}
            value={props.rule.rule_selector}
          />
        </LegacyStack.Item>
        {props.rule.rule_selector === 'cart_at_least' || props.rule.rule_selector === 'cart_at_most' || props.rule.rule_selector === 'cart_exactly' ? (
          <LegacyStack.Item distribution='fillEvenly'>
            <TextField
              label="Quantity"
              type="number"
              id="quantity"
              value={props.rule.quantity}
              onChange={handleChange}
              autoComplete="off"
              className={"qtyCon"}
              min={0}
              error={props.quantityErrorText}
            />
          </LegacyStack.Item>
        ) : null}
        {props.rule.rule_selector === 'cart_at_least' || props.rule.rule_selector === 'cart_at_most' || props.rule.rule_selector === 'cart_exactly' || props.rule.rule_selector === 'cart_does_not_contain' || props.rule.rule_selector === 'on_product_this_product_or_in_collection' || props.rule.rule_selector === 'on_product_not_this_product_or_not_in_collection' ? (
          <LegacyStack.Item distribution='fillEvenly'>
            <Select
              label="Item"
              options={item_options}
              id='item_selector'
              onChange={handleItemChange}
              value={item}
            />
          </LegacyStack.Item>
        ) : null}
        {findProduct() ? (
          <>
            <LegacyStack.Item distribution='fillEvenly'>
              <TextField
                label="Select product or collection"
                value={queryValue}
                onChange={handleQueryValueChange}
                autoComplete="off"
                placeholder='Search product or collection'
                error={props.itemErrorText}
              />
            </LegacyStack.Item>
            {productData ? (
              <LegacyStack.Item>
                <SearchProductsList item_type={item} shop={shopAndHost.shop} updateQuery={updateQuery} productData={productData} resourceListLoading={resourceListLoading} setResourceListLoading={setResourceListLoading} updateSelectedProduct={updateSelectedProduct} rule={props.rule}/>
              </LegacyStack.Item>
            ) : null
            }
          </>
        ) : null}
        {inputAmount() ? (
          <LegacyStack.Item distribution='fillEvenly'>
            <TextField
              label="Enter the amount in cents (or your local equivalent)"
              type="number"
              id= "item_name"
              value={props.rule.item_name}
              onChange={handleChange}
              autoComplete="off"
              className={"qtyCon"}
              error={props.itemErrorText}
            />
          </LegacyStack.Item>
        ) : null}
        {inputCountry() ? (
          <LegacyStack.Item>
            <Select
              label="Select a country"
              options={countryOptions()}
              id='item_name'
              onChange={handleChange}
              value={props.rule.item_name}
              error={props.itemErrorText}
            />
          </LegacyStack.Item>
        ) : null}
        {(!findProduct() && !inputAmount()) && !inputCountry() ? (
          <LegacyStack.Item distribution='fillEvenly'>
            <TextField
              label="Value"
              type="text"
              id="item_name"
              value={props.rule.item_name}
              onChange={handleChange}
              autoComplete="off"
              error={props.itemErrorText}
            />
          </LegacyStack.Item>
        ) : null}
      </LegacyStack>
    </>
  );
}