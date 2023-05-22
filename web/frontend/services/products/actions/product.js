import { api } from "../../api";
import { PRODUCT_SHOPIFY, ELEMENT_SEARCH, PRODUCT_MULTI } from "../endpoints/product";

export function productShopify(shopify_id, shop_id) {
  let url = `${PRODUCT_SHOPIFY}/${shopify_id}?shop_id=${shop_id}`
  return api.get(url, {
  });
};

export function elementSearch(shop_id, query) {
  return api.post(ELEMENT_SEARCH, {
    product: { shop_id: shop_id, query: query, type: 'product' }
  });
};

export function productsMulti(selectedProduct, shop_id) {
  let url = `${PRODUCT_MULTI}/${selectedProduct}?shop_id=${shop_id}`
  return api.get(url, {
  })
}
