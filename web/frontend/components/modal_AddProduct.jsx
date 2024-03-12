import {
  Filters,
  ResourceList,
  Avatar,
  ResourceItem,
  OptionList,
  Text, Thumbnail
} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';


export function ModalAddProduct(props) {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const [selectedVariants, setSelectedVariants] = useState(props.offer.included_variants);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);
  let timer;

  const handleQueryValueChange = useCallback((value) => {
    props.updateQuery(value);
  }, []);
  const WaitForQueryToComplete = useCallback((value) => {
    setQueryValue(value);
    clearTimeout(timer);

    timer = setTimeout(() => {
      handleQueryValueChange(value);
    }, 1000);
  }, []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
    timer = setTimeout(() => {
      handleQueryValueChange("");
    }, 1000);
  }, []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const resourceName = props.isCollection ? {
    singular: 'collection',
    plural: 'collections',
  } : {
    singular: 'product',
    plural: 'products',
  };

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
      onQueryChange={WaitForQueryToComplete}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    />
  );

  return (
    <div id="right-align-polaris">
      <ResourceList
          resourceName={resourceName}
          items={props.productData}
          renderItem={renderItem}
          selectedItems={props.selectedItems}
          onSelectionChange={selectionChange}
          selectable
          showHeader={false}
          filterControl={filterControl}
          loading={props.resourceListLoading}
      />
    </div>
  );

  function renderItem(item) {

    const { id, title, image, variants } = item;
    const media =  <Thumbnail
        source={image}
        alt={title}
        size="medium"
    />
    if (!variants || variants.length <= 1) {
      return (
        <ResourceItem
          id={id}
          key={id}
          title={title}
          verticalAlignment="center"
          media={media}
          accessibilityLabel={`View details for ${title}`}
          persistActions
          onClick={() => selectedProduct(id)}
        >
          <Text as="h3" variant="bodyMd" fontWeight="regular">
            {title}
          </Text>
        </ResourceItem>
      );
    }
    else {
      const option = variants?.map((currentValue) => {
        const label = currentValue.title;
        const value = currentValue.id;
        return { value, label };
      });
      return (
        <>
          <ResourceItem
            id={id}
            key={id}
            title={title}
            media={media}
            accessibilityLabel={`View details for ${title}`}
            persistActions
            onClick={() => selectedProduct(id)}
            verticalAlignment="center"
          >
            <Text as="h3" variant="bodyMd" fontWeight="regular">
              {title}
            </Text>
          </ResourceItem>
          <div style={{ marginLeft: '30px' }}>
            <OptionList
                options={option}
                selected={selectedVariants[id]}
                onChange={(selectedOptions) => handleSelectedVariant(selectedOptions, id)}
                allowMultiple
            />
          </div>
          <hr style={{borderTop: '0.2px solid #f0f0f0', marginBottom: 0}} />
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
        props.setResourceListLoading(true);
        let shopifyId = id[id.length - 1]

        fetch(`/api/v2/merchant/products/shopify/${shopifyId}?shop_id=${props.shop_id}&shop=${shopAndHost.shop}`, {
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
            }
            selectedVariants[id[id.length - 1]] = [];
            for (var i = 0; i < data.variants?.length; i++) {
              selectedVariants[id[id.length - 1]].push(data.variants[i].id);
            }
            if (props.updateSelectedProduct) {
              props.updateSelectedProduct(id, selectedVariants);
            }
            else if (props.updateSelectedProducts) {
              props.updateSelectedProducts({ id: data.id, title: data.title }, selectedVariants);
            }
            props.setResourceListLoading(false);
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
            for (var j = 0; j < props.productData[i].variants?.length; j++) {
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
      props.setResourceListLoading(false);
      props.setSelectedItems(id);
    }
  }
}