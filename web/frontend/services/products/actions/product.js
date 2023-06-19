import { api } from "../../api";
import { PRODUCT_SHOPIFY, ELEMENT_SEARCH, PRODUCT_MULTI } from "../endpoints/product";

export function productShopify(shopify_id, shop_id) {
  let url = `${PRODUCT_SHOPIFY}/${shopify_id}?shop_id=${shop_id}`
  return api.get(url, {
  });
};

export function elementSearch(shopify_domain, query) {
  return api.post(ELEMENT_SEARCH, {
    product: { query: query, type: 'product' },
    shop: shopify_domain
  });
};

export function productsMulti(selectedProduct, shop_id) {
  let url = `${PRODUCT_MULTI}/${selectedProduct}?shop_id=${shop_id}`
  return api.get(url, {
  })
}
