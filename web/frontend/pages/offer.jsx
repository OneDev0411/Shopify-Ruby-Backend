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
    Grid
  } from '@shopify/polaris';
  import { TitleBar } from "@shopify/app-bridge-react";
  import {useState, useCallback, useEffect} from 'react';
  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useAppQuery, useAuthenticatedFetch } from "../hooks";
  import { useSelector } from "react-redux";
  
  export default function IndexTableWithAllElementsExample() {
    // Dummy data fo IndexTable

    const resourceName = {
      singular: 'customer',
      plural: 'customers',
    };
  
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState(null);
    const [offersData, setOffersData] = useState([]);
    const [sortValue, setSortValue] = useState('today');
    const [filteredData, setFilteredData] = useState([]);
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch();

    useEffect(()=>{
      fetch('/api/merchant/offers_list', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({shopify_domain: shopAndHost.shop}),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('API Data >>> ', data);
          localStorage.setItem('icushopify_domain', data.shopify_domain);
          setOffersData(data.offers);
          setFilteredData(data.offers);
        }).catch((error) => {
          console.log('Fetch error >> ', error);
        });
    },[]);

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
      useIndexResourceState(filteredData);
  
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
  
    const promotedBulkActions = [
      {
        content: 'Duplicate Offer',
        onAction: () => createDuplicateOffer(),
      },
    ];
    const bulkActions = [
      {
        content: 'Publish',
        onAction: () => activateSelectedOffer(),
      },
      {
        content: 'Draft',
        onAction: () => deactivateSelectedOffer(),
      },
      {
        content: 'Delete',
        onAction: () => deleteSelectedOffer(),
      },
    ];
  
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

    function createDuplicateOffer() {
        let url = `/api/offers/${selectedResources[0]}/duplicate`;
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({offer_id: selectedResources[0], shopify_domain: shopAndHost.shop})
        })
          .then((response) => response.json())
          .then( (data) => {
            setFilteredData(data.offers);
            setOffersData(data.offers);
          })
            .catch((error) => {
          })
      }

      function deleteSelectedOffer() {
        let url = `/api/offers/${selectedResources[0]}`;
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({offer_id: selectedResources[0], shopify_domain: shopAndHost.shop})
        })
          .then((response) => response.json())
          .then( (data) => {
            setFilteredData(data.offers);
            setOffersData(data.offers);
            selectedResources.shift();
          })
            .catch((error) => {
          })
      }

      function activateSelectedOffer() {
        let url = '/api/merchant/offer_activate';
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({offer: {offer_id: selectedResources[0]}, shopify_domain: shopAndHost.shop})
        })
          .then((response) => response.json())
          .then( (data) => {
            const filteredDataDup = [...filteredData];
            filteredDataDup.find((o) => o.id == selectedResources[0]).status = true;

            setFilteredData([...filteredDataDup]);
            // setOffersData(...filteredDataDup);
            selectedResources.shift();
          })
            .catch((error) => {
          })
      }

      function deactivateSelectedOffer() {
        let url = '/api/merchant/offer_deactivate';
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({offer: {offer_id: selectedResources[0]}, shopify_domain: shopAndHost.shop})
        })
          .then((response) => response.json())
          .then( (data) => {
            const filteredDataDup = [...filteredData];
            filteredDataDup.find((o) => o.id == selectedResources[0]).status = false;
            setFilteredData([...filteredDataDup]);
            // setOffersData(filteredData);
            selectedResources.shift();
          })
            .catch((error) => {
          })
      }

    const navigateTo = useNavigate();

    const handleOpenOfferPage = () => {
      navigateTo('/edit-offer', { state: { offerID: null } });
    }
  
    return (
      <Page> 
        <TitleBar
            title="Offers"
            primaryAction={{
            content: "Create Offer",
            onAction: handleOpenOfferPage,
            }}
        />
        <Card sectioned>
          <div style={{display: 'flex'}}>
            <div style={{flex: 1}}>
              <Filters
                queryValue={queryValue}
                filters={filters}
                appliedFilters={appliedFilters}
                onQueryChange={setQueryValue}
                onQueryClear={handleQueryValueRemove}
                onClearAll={handleClearAll}
              />
            </div>
            <div style={{paddingLeft: '0.25rem'}}>
              <Select
                labelInline
                label="Sort"
                options={sortOptions}
                value={sortValue}
                onChange={handleSortChange}
              />
            </div>
          </div>
          <IndexTable
            resourceName={resourceName}
            itemCount={filteredData.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            hasMoreItems
            bulkActions={bulkActions}
            promotedBulkActions={promotedBulkActions}
            lastColumnSticky
            headings={[
              {title: 'Offer'},
              {title: 'Status'},
              {title: 'Clicks'},
              {title: 'Views'},
              {title: 'Revenue', hidden: false},
            ]}
          >
            {rowMarkup}
          </IndexTable>
          <div className="space-4"></div>
          <div className="offer-table-footer">
            <Pagination
              label="1 of 10"
              hasPrevious
              onPrevious={() => {
                console.log('Previous');
              }}
              hasNext
              onNext={() => {
                console.log('Next');
              }}
            />
          </div>
        </Card>
        <div className="space-10"></div>
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