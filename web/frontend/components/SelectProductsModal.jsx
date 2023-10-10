import { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { ModalAddProduct } from './modal_AddProduct';
import { useAuthenticatedFetch } from "../hooks";

export function SelectProductsModal(props) {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [productData, setProductData] = useState([]);
  const [resourceListLoading, setResourceListLoading] = useState(true);
  const [query, setQuery] = useState("");

  function updateQuery(childData) {
    setResourceListLoading(true);
    fetch(`/api/merchant/element_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product: { query: childData, type: 'product' }, shop: shopAndHost.shop }),
    })
      .then((response) => { return response.json() })
      .then((data) => {
        for (var i = 0; i < data.length; i++) {
          if (!props.offer.rules_json.some(hash => hash?.item_shopify_id == data[i].id)) {
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

  async function getProducts() {
    setResourceListLoading(true);
    fetch(`/api/merchant/element_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product: { query: query, type: 'product' }, shop: shopAndHost.shop }),
    })
      .then((response) => { return response.json() })
      .then((data) => {
        for (var i = 0; i < data.length; i++) {
          if (!props.offer.rules_json.some(hash => hash?.item_shopify_id == data[i].id)) {
            data[i].variants = [];
          }
        }
        setProductData(data);
        setResourceListLoading(false)
        return data
      })
      .catch((error) => {
        console.log("# Error getProducts > ", JSON.stringify(error));
      })
  }

  function updateSelectedProducts(selectedItem) {
    if(selectedItem.id){
      props.selectedProducts.push(selectedItem);
    }
    else{
      const products = props.selectedProducts.filter(item => selectedItem.includes(item.id));
      props.setSelectedProducts(products);
    }
  }


  useEffect(() => {
      getProducts();
  }, []);

  return (
    <>
      <ModalAddProduct selectedItems={props.selectedItems} setSelectedItems={props.setSelectedItems} offer={props.offer} updateQuery={updateQuery} shop_id={props.shop.shop_id} productData={productData} resourceListLoading={resourceListLoading} setResourceListLoading={setResourceListLoading} updateSelectedProducts={updateSelectedProducts} />
    </>
  );
}

export default memo(SelectProductsModal);