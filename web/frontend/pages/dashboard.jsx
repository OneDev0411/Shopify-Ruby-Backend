import {
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
    Grid, TextField
  } from '@shopify/polaris';
  import { TotalSalesData, ConversionRate,OrderOverTimeData} from "../components";
  import { TitleBar } from '@shopify/app-bridge-react';
  import { useState, useCallback } from 'react';
  
   export default function IndexTableWithAllElementsExample() {
       //Dummy data fo IndexTable
      const customers = [
        {
          id: '341',
          url: 'http://offer-example.com',
          offer_name: 'Easter Upsell',
           //The badge should change based on status
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
          url: 'http: offer-example.com',
          offer_name: 'Valentine Upsell',
          //The badge should change based on status
          status:<Badge>Unpublished</Badge>,
          clicks: 20,
          views: 30,
          revenue:'$1,123.23'
        },
        {
          id: '3417',
          url: 'http: offer-example.com',
          offer_name: 'Easter Upsell',
          //The badge should change based on status
          status:<Badge status="success">Published</Badge>,
          clicks: 20,
          views: 30,
          revenue: '$2019.10'
        },
        {
          id: '3418',
          url: 'http: offer-example.com',
          offer_name: 'Valentine Upsell',
          //The badge should change based on status
          status:<Badge>Unpublished</Badge>,
          clicks: 20,
          views: 30,
          revenue:'$1,123.23'
        },
        {
          id: '3419',
          url: 'http: offer-example.com',
          offer_name: 'Valentine Upsell',
          //The badge should change based on status
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
      const [queryValue, setQueryValue] = useState('');
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
          <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
              <Card title="Total sales" sectioned>
                <h3 className="report-money"><strong>$100.00</strong></h3>
                <div className="space-4"></div>
                <p>SALES OVER TIME</p>
                <br/>
                <TotalSalesData/>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
              <Card title="Conversion rate" sectioned>
                <h3 className="report-money"><strong>12%</strong></h3>
                <div className="space-4"></div>
                <p>CONVERSION FUNNEL</p>
                <br/>
                <ConversionRate/>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
              <Card title="Total order" sectioned>
                <h3 className="report-money"><strong>40</strong></h3>
                <div className="space-4"></div>
                <p>ORDERS OVER TIME</p>
                <br/>
                <OrderOverTimeData/>
              </Card>
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