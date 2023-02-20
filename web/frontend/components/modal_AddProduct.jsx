import {
    TextField,
    Filters,
    Button,
    Card,
    ResourceList,
    Avatar,
    ResourceItem,
  } from '@shopify/polaris';
  import {useState, useCallback} from 'react';
  
 export function ModalAddProduct() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [taggedWith, setTaggedWith] = useState(null);
    const [queryValue, setQueryValue] = useState(null);
  
    const handleTaggedWithChange = useCallback(
      (value) => setTaggedWith(value),
      [],
    );
    const handleQueryValueChange = useCallback(
      (value) => setQueryValue(value),
      [],
    );
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleClearAll = useCallback(() => {
      handleTaggedWithRemove();
      handleQueryValueRemove();
    }, [handleQueryValueRemove, handleTaggedWithRemove]);
  
    const resourceName = {
      singular: 'product',
      plural: 'products',
    };
  
    const items = [
      {
        id: 112,
        url: 'product-1/341',
        name: 'Product 1',
        cost: '$20.00',
        collection:'t-shirt',
        latestOrderUrl: 'orders/1456',
      },
      {
        id: 113,
        url: 'product-2/342',
        name: 'Product 2',
        cost: '$30.00',
        collection:'t-shirt',
        latestOrderUrl: 'orders/1457',
      },
    ];
  
    const bulkActions = [
      {
        content: 'Add products',
        onAction: () => console.log('Todo: implement bulk add tags'),
      }
    ];
  
    const filters = [
      {
        key: 'taggedWith3',
        label: 'Tagged withh',
        filter: null,
        shortcut: true,
      },
    ];
  
    const appliedFilters = !isEmpty(taggedWith)
      ? [
          {
            key: 'taggedWith3',
            label: disambiguateLabel('taggedWith3', taggedWith),
            onRemove: handleTaggedWithRemove,
          },
        ]
      : [];
  
    const filterControl = (
      <Filters
        queryValue={queryValue}
        filters={appliedFilters}
        appliedFilters={appliedFilters}
        onQueryChange={handleQueryValueChange}
        onQueryClear={handleQueryValueRemove}
        onClearAll={handleClearAll}
      >
      </Filters>
    );filters
  
    return (
        <ResourceList
          resourceName={resourceName}
          items={items}
          renderItem={renderItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          promotedBulkActions={bulkActions}
          filterControl={filterControl}
        />
    );
  
    function renderItem(item) {
      const {id, url, name, cost} = item;
      const media = <Avatar customer size="medium" name={name} />;
      return (
        <ResourceItem
          id={id}
          url={url}
          media={media}
          accessibilityLabel={`View details for ${name}`}
          persistActions
        >
          <p variant="bodyMd" fontWeight="bold" as="h3">
            <strong>{name}</strong>
          </p>
          <div>{cost}</div>
        </ResourceItem>
      );
    }
  
    function disambiguateLabel(key, value) {
      switch (key) {
        case 'taggedWith3':
          return `Tagged with ${value}`;
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