import {
    TextField,
    IndexTable,
    Filters,
    useIndexResourceState,
  } from '@shopify/polaris';
  import {useState, useCallback} from 'react';
  
  export function ModalAddProduct() {
    const customers = [
      {
        id: '3416',
        url: 'customers/341',
        name: 'Mae Jemison',
        location: 'Decatur, USA',
        orders: 20,
        amountSpent: '$2,400',
      },
      {
        id: '2566',
        url: 'customers/256',
        name: 'Ellen Ochoa',
        location: 'Los Angeles, USA',
        orders: 30,
        amountSpent: '$140',
      },
    ];
    const resourceName = {
      singular: 'customer',
      plural: 'customers',
    };
  
    const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(customers);
    const [queryValue, setQueryValue] = useState(null);
  
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleClearAll = useCallback(() => {
      handleTaggedWithRemove();
      handleQueryValueRemove();
    }, [handleQueryValueRemove, handleTaggedWithRemove]);
  
    const rowMarkup = customers.map(
      ({id, name, location, orders, amountSpent}, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <TextField variant="bodyMd" fontWeight="bold" as="span">
              {name}
            </TextField>
          </IndexTable.Cell>
          <IndexTable.Cell>{location}</IndexTable.Cell>
          <IndexTable.Cell>{orders}</IndexTable.Cell>
          <IndexTable.Cell>{amountSpent}</IndexTable.Cell>
        </IndexTable.Row>
      ),
    );
  
    return (
      <div>
        <div style={{padding: '16px', display: 'flex'}}>
          <div style={{flex: 1}}>
            <Filters
              queryValue={queryValue}
              onQueryChange={setQueryValue}
              onQueryClear={handleQueryValueRemove}
              onClearAll={handleClearAll}
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
          headings={[
            {title: 'Name'},
            {title: 'Location'},
            {title: 'Order count'},
            {title: 'Amount spent'},
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </div>
    );
  }