import {
    TextField,
    IndexTable,
    Card,
    Filters,
    Select,
    useIndexResourceState,
    Page,
    Badge,
    Link,
    FooterHelp,
    Pagination,
    Grid,
    LegacyCard
  } from '@shopify/polaris';
  import { TitleBar } from "@shopify/app-bridge-react";
  import {useState, useCallback, useEffect} from 'react';
  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import { GenericFooter } from '../components';
  import { useAppQuery, useAuthenticatedFetch } from "../hooks";
  import { useSelector } from "react-redux";
  import { OffersList, GenericTitleBar } from '../components';
  import { useAppBridge } from '@shopify/app-bridge-react';
  import { Redirect } from '@shopify/app-bridge/actions';
  import {
    AddProductMajor
  } from '@shopify/polaris-icons';
  
  export default function IndexTableWithAllElementsExample() {

    const app = useAppBridge();
    const emptyToastProps = { content: null };
    const [isLoading, setIsLoading] = useState(true);
    const [toastProps, setToastProps] = useState(emptyToastProps);
    const info = { offer: { shop_domain: window.location.host } };
    const [currentShop, setCurrentShop] = useState();
    const [hasOffers, setHasOffers] = useState();
  
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState(null);
    const [offersData, setOffersData] = useState([]);
    const [sortValue, setSortValue] = useState('today');
    const [filteredData, setFilteredData] = useState([]);
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const navigateTo = useNavigate();

    const fetchCurrentShop = useCallback(async () => {
      let redirect = Redirect.create(app);

      fetch(`/api/merchant/current_shop?shop=${shopAndHost.shop}`, {
        method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
       })
       .then( (response) => { return response.json(); })
       .then( (data) => {
          setHasOffers(data.has_offers);
       })
       .catch((error) => {
          console.log("error", error);
       })    
    }, []);

  useEffect(() => {
      fetchCurrentShop()
  }, [fetchCurrentShop]);
    
    const handleOpenOfferPage = () => {
      navigateTo('/edit-offer', { state: { offerID: null } });
    }

    return (
      <Page>
        {hasOffers ? <GenericTitleBar icon={AddProductMajor} title='Offers' buttonText='Create offer' handleButtonClick={handleOpenOfferPage} /> : null}
        <OffersList></OffersList>
        <div className="space-10"></div>
        {hasOffers ? <GenericFooter text='Learn more about ' linkUrl='#' linkText='offers'></GenericFooter> : null}
      </Page>
    );
  }
