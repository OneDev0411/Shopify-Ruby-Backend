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
  import { TotalSalesData, ConversionRate, OrderOverTimeData} from "../components";
  import { TitleBar } from '@shopify/app-bridge-react';
  import { useState, useEffect, useCallback } from 'react';
  import { OffersList } from "../components";
  import { useAppQuery, useAuthenticatedFetch } from "../hooks";
  import { useAppBridge } from "@shopify/app-bridge-react";
  import { useSelector } from "react-redux";

  export default function IndexTableWithAllElementsExample() {
    
    const [queryValue, setQueryValue] = useState(null);
    const [offersData, setOffersData] = useState([]);
    const [isLoading, setIsLoading]   = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch();
    const app = useAppBridge();

  useEffect(()=>{
    setIsLoading(true);
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
        setIsLoading(false);
      }).catch((error) => {
        console.log('Fetch error >> ', error);
      });
  },[]);


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
            selectedResources.shift();
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
            selectedResources.shift();
          })
            .catch((error) => {
          })
      }


      return (
        <Page>
          <TitleBar
              title="Your Offers"
              primaryAction={{
              content: "Create Offer",
              onAction: () => console.log("create offer btn clicked"),
              }}
          />
          <LegacyCard sectioned>
            <div style={{display: 'flex'}}>
              <div style={{flex: 1}}>
                <Filters
                  queryValue={queryValue}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onQueryChange={handleQueryValueChange}
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
              itemCount={offersData.length}
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
          </LegacyCard>
          <div className="space-10"></div>
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