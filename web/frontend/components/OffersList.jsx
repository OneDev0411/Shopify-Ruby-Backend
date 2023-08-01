import {
  Button,
  TextField,
  IndexTable,
  Filters,
  useIndexResourceState,
  Page,
  Badge,
  Link,
  FooterHelp,
  Pagination,
  Select,
  LegacyCard, LegacyStack, Image, VerticalStack, Text, ButtonGroup, MediaCard, VideoThumbnail
} from '@shopify/polaris';

import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useSelector } from "react-redux";
import {homeImage} from "../assets/index.js";
import {CreateOfferCard} from "./CreateOfferCard.jsx";

export function OffersList() {

  const resourceName = {
    singular: 'offer',
    plural: 'offers',
  };

  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const info = { offer: { shop_domain: window.location.host } };

  const [taggedWith, setTaggedWith] = useState('');
  const [queryValue, setQueryValue] = useState(null);
  const [offersData, setOffersData] = useState([]);
  const [sortValue, setSortValue] = useState('today');
  const [filteredData, setFilteredData] = useState([]);
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
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
      body: JSON.stringify({ shop: shopAndHost.shop }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API Data >>> ', data);
        // localStorage.setItem('icushopify_domain', data.shopify_domain);
        setOffersData(data.offers);
        setFilteredData(data.offers);
      }).catch((error) => {
        console.log('Fetch error >> ', error);
      });
  }, []);

  // Pagination configuration
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(paginatedData);

  // Handle pagination page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleSorting = useCallback((headingIndex, direction) => {
    console.log('came in handle sorting');
  });
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueChange = useCallback((value) => {
    setFilteredData(offersData.filter((o) => o.title.toLowerCase().includes(value.toLowerCase())));
  });
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);
  const handleSortChange = useCallback((value) => {
    if(value == "date_asc") {
      filteredData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    else if(value == "date_des") {
      filteredData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      filteredData.reverse();
    }
    else if (value == "clicks") {
      filteredData.sort(function(a, b) {
        return b.clicks - a.clicks;
      });
    }
    else if (value == "revenue") {
      filteredData.sort(function(a, b) {
        return b.revenue - a.revenue;
      });
    }
    setSortValue(value), []});

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
    {label: 'Date Desc', value: 'date_des'},
    {label: 'Date Asc', value: 'date_asc'},
    {label: 'Clicks', value: 'clicks'},
    {label: 'Revenue', value: 'revenue'},
  ];

  const rowMarkup = paginatedData.map(
    ({ id, title, status, clicks, views, revenue }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell><b>{title}</b></IndexTable.Cell>
        <IndexTable.Cell>{status ? (<Badge status="success">Published</Badge>) : (<Badge>Unpublished</Badge>)}</IndexTable.Cell>
        <IndexTable.Cell>{clicks}</IndexTable.Cell>
        <IndexTable.Cell>{views}</IndexTable.Cell>
        <IndexTable.Cell>{`$${revenue}`}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button onClick={() => handleEditOffer(id)}>
            Edit
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  function createDuplicateOffer() {
    selectedResources.forEach(function (resource) {
      let url = `/api/merchant/offers/${resource}/duplicate`;
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offer_id: resource, shop: shopAndHost.shop })
      })
        .then((response) => response.json())
        .then((data) => {
          setFilteredData(data.offers);
          setOffersData(data.offers);
          selectedResources.shift();
        })
        .catch((error) => {
        })
    });
  }

  function deleteSelectedOffer() {
    selectedResources.forEach(function (resource) {
      let url = `/api/merchant/offers/${resource}`;
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offer_id: resource, shop: shopAndHost.shop })
      })
        .then((response) => response.json())
        .then((data) => {
          setFilteredData(data.offers);
          setOffersData(data.offers);
          selectedResources.shift();
        })
        .catch((error) => {
        })
    });
  }

  function activateSelectedOffer() {
    selectedResources.forEach(function (resource) {
      let url = '/api/merchant/offer_activate';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offer: { offer_id: resource }, shop: shopAndHost.shop })
      })
        .then((response) => response.json())
        .then((data) => {
          const dataDup = [...offersData];
          dataDup.find((o) => o.id == resource).status = true;

          setOffersData([...dataDup]);
          selectedResources.shift();
        })
        .catch((error) => {
        })
    });
  }

  function deactivateSelectedOffer() {
    selectedResources.forEach(function (resource) {
      let url = '/api/merchant/offer_deactivate';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offer: { offer_id: resource }, shop: shopAndHost.shop })
      })
        .then((response) => response.json())
        .then((data) => {
          const dataDup = [...offersData];
          dataDup.find((o) => o.id == resource).status = false;

          setOffersData([...dataDup]);
          selectedResources.shift();
        })
        .catch((error) => {
        })
    });
  }

  const navigateTo = useNavigate();

  const handleEditOffer = (offer_id) => {
    navigateTo('/edit-offer', { state: { offerID: offer_id } });
  }

  return (
    <Page>
      { offersData.length === 0 ?
          <CreateOfferCard />
        :
        <>
          <LegacyCard sectioned>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <Filters
                  queryValue={queryValue}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onQueryChange={handleQueryValueChange}
                  onQueryClear={handleQueryValueRemove}
                  onClearAll={handleClearAll}
                />
              </div>
              <div style={{ paddingLeft: '0.25rem' }}>
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
              sortOptions={sortOptions}
              sortable={[false, false, true, true, true]}
              sortDirection={'descending'}
              sortColumnIndex={4}
              sort={{ handleSorting }}
              resourceName={resourceName}
              itemCount={paginatedData.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              hasZebraStriping
              bulkActions={bulkActions}
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: 'Offer' },
                { title: 'Status' },
                { title: 'Clicks' },
                { title: 'Views' },
                { title: 'Revenue', hidden: false },
              ]}
            >
              {rowMarkup}
            </IndexTable>
            <div className="space-4"></div>
            <div className="offer-table-footer">
              <Pagination
                label={`${currentPage} of ${totalPages}`}
                hasPrevious={currentPage > 1}
                hasNext={currentPage < totalPages}
                onPrevious={() => handlePageChange(currentPage - 1)}
                onNext={() => handlePageChange(currentPage + 1)}
              />
            </div>
          </LegacyCard>
        </>
      }
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
