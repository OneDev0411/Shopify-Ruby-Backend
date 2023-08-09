import {
  Filters,
  ResourceList,
  Avatar,
  ResourceItem,
  OptionList
} from '@shopify/polaris';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';


export function ModalAddProduct(props) {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const [resourceListLoading, setResourceListLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState(props.offer.included_variants);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  const handleQueryValueChange = useCallback((value) => {
    setQueryValue(value);
    props.updateQuery(value);
  }, [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);


  useEffect(() => {
    setResourceListLoading(props.resourceListLoading);
  }, [props.resourceListLoading]);

  const resourceName = props.isCollection ? {
    singular: 'collection',
    plural: 'collections',
  } : {
    singular: 'product',
    plural: 'products',
  };

  const items = props.productData;

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
  ); filters

  return (
    <ResourceList
      resourceName={resourceName}
      items={items}
      renderItem={renderItem}
      selectedItems={props.selectedItems}
      onSelectionChange={selectionChange}
      selectable
      showHeader={false}
      filterControl={filterControl}
      loading={resourceListLoading}
    />
  );

  function renderItem(item) {

    const { id, title, image, variants } = item;
    const media = <Avatar customer size="medium" name={title} />;
    if (variants.length <= 1) {

      return (
        <ResourceItem
          id={id}
          title={title}
          image={image}
          accessibilityLabel={`View details for ${title}`}
          persistActions
          disabled={true}
          onClick={() => selectedProduct(id)}
        >
          <p variant="bodyMd" fontWeight="bold" as="h3">
            <strong>{title}</strong>
          </p>

        </ResourceItem>

      );
    }
    else {
      const option = variants.map((currentValue) => {
        const label = currentValue.title;
        const value = currentValue.id;
        return { value, label };
      });
      return (
        <>
          <ResourceItem
            id={id}
            title={title}
            image={image}
            accessibilityLabel={`View details for ${title}`}
            persistActions
            onClick={() => selectedProduct(id)}
          >
            <p variant="bodyMd" fontWeight="bold" as="h3">
              <strong>{title}</strong>
            </p>
          </ResourceItem>
          <div style={{ marginLeft: '30px' }}>
            <OptionList
              options={option}
              selected={selectedVariants[id]}
              onChange={(selectedOptions) => handleSelectedVariant(selectedOptions, id)}
              allowMultiple
            >
            </OptionList>
          </div>
        </>
      );
    }
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

  //Called when the selected product or variants of selected product changes in popup modal
  function handleSelectedVariant(selectedOptions, id) {
    setSelectedVariants(selectedVariants => {
      return { ...selectedVariants, [id]: selectedOptions }
    })
    props.updateSelectedProduct(id, selectedOptions);
  }

  // Called on just first selection of popup modal products
  function selectedProduct(id) {
    let idToArray = [id];
    selectionChange(idToArray);
  }

  // Called on every selection of popup modal products after first selected product
  function selectionChange(id) {
    if (!props.isCollection) {
      if (props.selectedItems.length < id.length) {
        setResourceListLoading(true);
        let shopifyId = id[id.length - 1]

        fetch(`/api/merchant/products/shopify/${shopifyId}?shop_id=${props.shop_id}&shop=${shopAndHost.shop}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => { return response.json() })
          .then((data) => {
            for (var i = 0; i < props.productData.length; i++) {
              if (props.productData[i].id == id[id.length - 1]) {
                props.productData[i].variants = data.variants;
                break;
              }
              else {
              }
            }
            selectedVariants[id[id.length - 1]] = [];
            for (var i = 0; i < data.variants.length; i++) {
              selectedVariants[id[id.length - 1]].push(data.variants[i].id);
            }
            if (props.updateSelectedProduct) {
              props.updateSelectedProduct(id, selectedVariants);
            }
            else if (props.updateSelectedProducts) {
              props.updateSelectedProducts({ id: data.id, title: data.title }, selectedVariants);
            }
            setResourceListLoading(false);
            props.setSelectedItems(id)
          })
          .catch((error) => {
            console.log("Error > ", error);
          })
      }
      else {
        let uncheckedIndex;
        let tempArray = [];
        for (var i = 0; i < props.selectedItems.length; i++) {
          if (!id.includes(props.selectedItems[i])) {
            uncheckedIndex = i;
            break;
          }
        }
        for (var i = 0; i < props.productData.length; i++) {
          if (props.productData[i].id == props.selectedItems[uncheckedIndex]) {
            for (var j = 0; j < props.productData[i].variants.length; j++) {
              tempArray[j] = props.productData[i].variants[j].id;
            }
            props.productData[i].variants = [];
            break;
          }
        }
        delete selectedVariants[props.selectedItems[uncheckedIndex]];
        if (props.updateSelectedProduct) {
          props.updateSelectedProduct(id, selectedVariants);
        }
        else if (props.updateSelectedProducts) {

          props.updateSelectedProducts(id, selectedVariants);
        }
        props.setSelectedItems(id);
      }
    }
    else {
      const coll = props.productData.find(item => item.id === id[id.length - 1]);
      if (props.selectedItems.length <= id.length) {
        props.updateSelectedCollection(coll);
      }
      else {
        if (coll) {
          props.updateSelectedCollection(coll, true);
        }
        else {
          props.updateSelectedCollection(null);
        }
      }
      setResourceListLoading(false);
      props.setSelectedItems(id);
    }
  }
}