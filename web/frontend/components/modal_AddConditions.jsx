import {Select,TextField,Stack} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export function ModalAddConditions() {
  const [selected, setSelected] = useState('today');
  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const options = [
    {label: 'Cart contain at least', value: 'cart_at_least'},
    {label: 'Cart contain at most', value: 'cart_at_most'},
    {label: 'Cart contains exactly', value: 'cart_exactly'},
    {label: 'Cart does not contain any', value: 'cart_does_not_contain'},
    {label: 'Cart contains variant', value: 'cart_contains_variant'},
    {label: 'Cart does not contain variant', value: 'Cart does not contain variant'},
    {label: 'Cart contains a product from vendor', value: 'cart_contains_item_from_vendor'},
    {label: 'Cart does not contain any product from vendor', value: 'cart_does_not_contain_item_from_vendor'},
    {label: 'Order Total Is At Least', value: 'total_at_least'},
    {label: 'Order Total Is At Most', value: 'total_at_most'},
    {label: 'Cookie is set', value: 'cookie_is_set'},
    {label: 'Cookie is not set', value: 'cookie_is_not_set'},
    {label: 'Customer is tagged', value: 'customer_is_tagged'},
    {label: 'Customer is not tagged', value: 'customer_is_not_tagged'},
    {label: 'Product/Cart URL contains', value: 'url_contains'},
    {label: 'Product/Cart URL does not contain', value: 'url_does_not_contain'},
    {label: 'Customer is located in', value: 'in_location'},
    {label: 'Customer is not located in', value: 'not_in_location'},
    {label: 'Customer is viewing this product/collection', value: 'on_product_this_product_or_in_collection'},
    {label: 'Customer is not viewing this product/collection', value: 'on_product_not_this_product_or_not_in_collection'},
  ];

  //Quantity controllers
  const [qtySelector, setQtySelector] = useState('1');
  const handleQtySelectorChange = useCallback((newValue) => setQtySelector(newValue), []);
  
  //Select Product
  const [value, setValue] = useState('');
  const handleChange = useCallback((newValue) => setValue(newValue), []);

  return (
    <>
      <Stack distribution='fillEvenly'>
        <Stack.Item>
          <Select
            label="Condition"
            options={options}
            onChange={handleSelectChange}
            value={selected}
          />
        </Stack.Item>
        <Stack.Item distribution='fillEvenly'>
          <TextField
            label="Quantity"
            type="number"
            value={qtySelector}
            onChange={handleQtySelectorChange}
            autoComplete="off"
            className={"qtyCon"}
          />
        </Stack.Item>
        <Stack.Item distribution='fillEvenly'>
          <TextField
            label="Select product or collection"
            value={value}
            onChange={handleChange}
            autoComplete="off"
            placeholder='Search product or collection'
          />
        </Stack.Item>
      </Stack>
    </>
  );
}
