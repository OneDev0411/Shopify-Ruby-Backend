import {
  IndexTable,
  LegacyCard,
  Filters,
  Select,
  useIndexResourceState,
  Page,
  Badge,
  FooterHelp,
  Link,
  Pagination,
    Grid, TextField
  } from '@shopify/polaris';
  import { TitleBar } from '@shopify/app-bridge-react';
  import { useState, useEffect, useCallback } from 'react';
import { OffersList } from "../components";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useSelector } from "react-redux";
  import { TotalSalesData, ConversionRate, OrderOverTimeData } from "../components"
import {useNavigate} from "react-router-dom";

export default function IndexTableWithAllElementsExample() {
    
  const [queryValue, setQueryValue] = useState(null);
  const [offersListData, setOffersListData] = useState(false);
  const [isLoading, setIsLoading]   = useState(true);
  const [filteredData, setFilteredData] = useState([]);
    const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const app = useAppBridge();



  const resourceName = {
        singular: 'offer',
        plural: 'offers',
  };

      const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(filteredData);
      const [taggedWith, setTaggedWith] = useState('');
      const [sortValue, setSortValue] = useState('today');

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
        [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);
  const handleSortChange = useCallback((value) => setSortValue(value), []);
  const handleQueryValueChange = useCallback((value) => {
    setFilteredData(offersData.filter((o) => o.title.includes(value)));
  });

  const filters = [
    {
          key: 'taggedWith',
          label: 'Filter',
      filter: (
        <TextField
          label="Filter by "
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
              key: 'filteredby',
              label: disambiguateLabel('taggedWith', taggedWith),
          onRemove: handleTaggedWithRemove,
        },
      ]
    : [];

  const sortOptions = [
        {label: 'Date Asc', value: 'date_asc'},
        {label: 'Date Desc', value: 'date_des'},
        {label: 'Clicks', value: 'clicks'},
        {label: 'Revenue', value: 'revenue'},
  ];

  const rowMarkup = filteredData.map(
        ({id, title, status, clicks, views,revenue}, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>{title}</IndexTable.Cell>
            <IndexTable.Cell>{status ? (<Badge status="success">Published</Badge>) : (<Badge>Unpublished</Badge>)}</IndexTable.Cell>
        <IndexTable.Cell>{clicks}</IndexTable.Cell>
        <IndexTable.Cell>{views}</IndexTable.Cell>
        <IndexTable.Cell>{`$${revenue}`}</IndexTable.Cell>
      </IndexTable.Row>
        ),
  );

  const navigateTo = useNavigate();

  const handleOpenOfferPage = () => {
      navigateTo('/edit-offer', { state: { offerID: null } });
  }

  const getOfferListData = (hasData) => {
    setOffersListData(hasData);
  };

  return (
    <Page>
      <TitleBar
        title="Dashboard"
        primaryAction={{
          content: "Create Offer",
          onAction: handleOpenOfferPage,
        }}
      />

      <OffersList getOfferListData={getOfferListData} />

      {offersListData ? (
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
              <TotalSalesData/>
          </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
              <ConversionRate/>
          </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
              <OrderOverTimeData/>
          </Grid.Cell>
        </Grid>
      ) : (
        <></>
      )}
      <div className='space-10'></div>
      <FooterHelp>
            Learn more about{' '}
            <Link url="#">
              Offers
            </Link>
          </FooterHelp><div> </div>
    </Page>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
          case 'taggedWith':
        return `Filter by ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
          return value === '' || value == null;
    }
  }
}