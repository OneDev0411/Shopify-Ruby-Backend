import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ModalAddProduct } from './modal_AddProduct';
import { useAuthenticatedFetch } from "../hooks";
import ErrorPage from "../components/ErrorPage.jsx"

export function SelectCollectionsModal(props) {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [collectionData, setCollectionData] = useState("");
  const [resourceListLoading, setResourceListLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);

  function updateQuery (childData) {
    setResourceListLoading(true);
    fetch(`/api/v2/merchant/element_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: { query: childData, type: 'collection' }, shop: shopAndHost.shop}),
    })
    .then( (response) => { return response.json() })
    .then( (data) => {
        for(var i=0; i<data.length; i++) {
            if(!Object.keys(props.offer.included_variants).includes(data[i].id.toString()))
            {
                data[i].variants = [];
            }
        }
        setCollectionData(data);
        setResourceListLoading(false);
    })
    .catch((error) => {
      setError(error);
      console.log("Error > ", error);
    })

    setQuery(childData);
  }

  function getCollections() {
    setResourceListLoading(true);
    fetch(`/api/v2/merchant/element_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: { query: query, type: 'collection' }, shop: shopAndHost.shop}),
    })
    .then( (response) => { return response.json() })
    .then( (data) => {
        for(var i=0; i<data.length; i++) {
            if(!Object.keys(props.offer.included_variants).includes(data[i].id.toString()))
            {
                data[i].variants = [];
            }
        }
        setCollectionData(data);
        setResourceListLoading(false);
    })
    .catch((error) => {
      setError(error);
      console.log("# Error getProducts > ", JSON.stringify(error));
    })
  }

  function updateSelectedCollection(selectedItem, uncheck=false) {
    if(selectedItem===null){
      props.setSelectedCollections([]);
      return;
    }
    if(uncheck==false){
      props.selectedCollections.push(selectedItem);
    }
    else{
      const collections = props.selectedCollections.filter(item => item.id === selectedItem.id);
      props.setSelectedCollections(collections);
    }
  }
  
  useEffect(() => {
   getCollections();
  }, []);

  if (error) { return < ErrorPage />; }

  return (
    <>
      <ModalAddProduct selectedItems={props.selectedItems} setSelectedItems={props.setSelectedItems} isCollection={true} offer={props.offer} updateQuery={updateQuery} shop_id={props.shop.shop_id} productData={collectionData} resourceListLoading={resourceListLoading} updateSelectedCollection={updateSelectedCollection}/>
    </>
  );
}