import {
    TextField,
    IndexTable,
    Card,
    Filters,
    Select,
    useIndexResourceState,
    Page,
    Badge,
    FooterHelp,
    Link,
    Pagination,
    ChoiceList,
  } from '@shopify/polaris';
  import { TitleBar } from "@shopify/app-bridge-react";
  import {useState, useCallback} from 'react';
  import React from 'react';
  
  export default function IndexTableWithAllElementsExample() {
    // Dummy data fo IndexTable
    const customers = [
      {
        id: '341',
        url: 'http://offer-example.com',
        offer_name: 'Easter Upsell',
        // The badge should change based on status
        status:<Badge status="success">Published</Badge>,
        clicks: 20,
        views: 30,
        revenue: '$2019.10'
      },
      {
        id: '348',
        url: 'http://offer-example.com',
        offer_name: 'Valentine Upsell',
        // The badge should change based on status
        status:<Badge>Unpublished</Badge>,
        clicks: 20,
        views: 30,
        revenue:'$1,123.23'
      },
      {
        id: '349',
        url: 'http://offer-example.com',
        offer_name: 'Valentine Upsell',
        // The badge should change based on status
        status:<Badge>Unpublished</Badge>,
        clicks: 20,
        views: 30,
        revenue:'$1,123.23'
      },
      {
        id: '3417',
        url: 'http://offer-example.com',
        offer_name: 'Easter Upsell',
        // The badge should change based on status
        status:<Badge status="success">Published</Badge>,
        clicks: 20,
        views: 30,
        revenue: '$2019.10'
      },
      {
        id: '3418',
        url: 'http://offer-example.com',
        offer_name: 'Valentine Upsell',
        // The badge should change based on status
        status:<Badge>Unpublished</Badge>,
        clicks: 20,
        views: 30,
        revenue:'$1,123.23'
      },
      {
        id: '3419',
        url: 'http://offer-example.com',
        offer_name: 'Valentine Upsell',
        // The badge should change based on status
        status:<Badge>Unpublished</Badge>,
        clicks: 20,
        views: 30,
        revenue:'$1,123.23'
      },
    ];

    const resourceName = {
      singular: 'customer',
      plural: 'customers',
    };
  
    const {selectedResources, allResourcesSelected, handleSelectionChange} =
      useIndexResourceState(customers);
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState(null);
    const [sortValue, setSortValue] = useState('today');
    const [availability, setAvailability] = useState(null);

    const handleAvailabilityChange = useCallback(
      (value) => setAvailability(value),
      [],
    );
  
    const handleTaggedWithChange = useCallback(
      (value) => setTaggedWith(value),
      [],
    );

    const handleAvailabilityRemove = useCallback(() => setAvailability(null), []);
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleClearAll = useCallback(() => {
      handleAvailabilityRemove();
      handleTaggedWithRemove();
      handleQueryValueRemove();
    }, [handleQueryValueRemove, handleTaggedWithRemove, handleAvailabilityRemove]);
    const handleSortChange = useCallback((value) => setSortValue(value), []);
  
    const promotedBulkActions = [
      {
        content: 'Duplicate Offer',
        onAction: () => console.log('Todo: implement bulk edit'),
      },
    ];
    const bulkActions = [
      {
        content: 'Publish',
        onAction: () => console.log('Todo: implement bulk add tags'),
      },
      {
        content: 'Draft',
        onAction: () => console.log('Todo: implement bulk remove tags'),
      },
      {
        content: 'Delete',
        onAction: () => console.log('Todo: implement bulk delete'),
      },
    ];
  
    const filters = [
      {
        key:'filterOptions',
        label:'Filter by',
        filter: (
          <ChoiceList
            title="Availability"
            titleHidden
            choices={[
              {label: 'Published', value: 'published'},
              {label: 'Unpublished', value: 'unpublished'},
              {label: 'Revenue', value: 'revenue'},
              {label: 'Clicks', value: 'clicks'},
              {label: 'Date', value: 'date'},
            ]}
            selected={availability || []}
            onChange={handleAvailabilityChange}
            allowMultiple
          />
        ),
        shortcut: true,
        hideClearButton: true,
      }
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
      {label: 'Asc', value: 'asc'},
      {label: 'Desc', value: 'des'},
    ];
  
    const rowMarkup = customers.map(
      ({id, offer_name, status, clicks, views,revenue}, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>{offer_name}</IndexTable.Cell>
          <IndexTable.Cell>{status}</IndexTable.Cell>
          <IndexTable.Cell>{clicks}</IndexTable.Cell>
          <IndexTable.Cell>{views}</IndexTable.Cell>
          <IndexTable.Cell>{revenue}</IndexTable.Cell>
        </IndexTable.Row>
      ),
    );
  
    return (
      <Page> 
        <TitleBar
            title="Offers"
            primaryAction={{
            content: "Create Offer",
            onAction: () => console.log("create offer btn clicked"),
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
            itemCount={customers.length}
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
        case 'filterOptions':
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