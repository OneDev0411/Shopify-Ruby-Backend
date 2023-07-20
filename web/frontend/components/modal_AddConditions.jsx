import { Select, TextField, LegacyStack, ResourceList, ResourceItem, OptionList } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SearchProductsList } from './SearchProductsList';
import { countriesList } from "../components/countries.js";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ModalAddConditions(props) {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [queryValue, setQueryValue] = useState(null);
  const [productData, setProductData] = useState("");
  const [resourceListLoading, setResourceListLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);

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

  function updateQuery(childData) {
    setResourceListLoading(true);
    fetch('/api/merchant/element_search', {
      method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify( {shop: shopAndHost.shop, product: { query: childData, type: 'product' }, json: true }),
     })
     .then( (response) => { return response.json(); })
     .then( (data) => {
        setResourceListLoading(false);
        setProductData(data);
     })
     .catch((error) => {
     })
  }

  const handleQueryValueChange = useCallback((value) => {
    setQueryValue(value);
    updateQuery(value);
  }, [],
  );

  function updateSelectedProduct(title, id, selectedVariants) {
    if (Array.isArray(id)) {
      props.setRule(prev => ({ ...prev, item_shopify_id: id[0], item_name: title}))
    }
  }

  function countryNames(){
    var names = ['Select a country']
    countriesList.map(([code, name]) => {
      names.push(name)
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
                <SearchProductsList shop={shopAndHost.shop} updateQuery={updateQuery} productData={productData} resourceListLoading={resourceListLoading} setResourceListLoading={setResourceListLoading} updateSelectedProduct={updateSelectedProduct} />
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
            options={countryNames()}
            id='item_name'
            onChange={handleChange}
            value={props.rule.item_name}
            error={props.itemErrorText}
          />
        </LegacyStack.Item>
        ) : null}
        {(!findProduct() && !inputAmount()) && !inputCountry()? (
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