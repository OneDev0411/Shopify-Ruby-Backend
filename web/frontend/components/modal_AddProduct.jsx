import {
    TextField,
    Filters,
    Button,
    Card,
    ResourceList,
    Avatar,
    ResourceItem,
    OptionList
  } from '@shopify/polaris';
  import {useState, useCallback, useEffect, useRef} from 'react';
  import { useSelector } from 'react-redux';

  
 export function ModalAddProduct(props) {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const [resourceListLoading, setResourceListLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState({})
    const [taggedWith, setTaggedWith] = useState(null);
    const [queryValue, setQueryValue] = useState(null);
  
    const handleTaggedWithChange = useCallback(
      (value) => setTaggedWith(value),
      [],
    );
    const handleQueryValueChange = useCallback((value) => {
      setQueryValue(value);
      props.updateQuery(value);
    },[],
    );
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleClearAll = useCallback(() => {
      handleTaggedWithRemove();
      handleQueryValueRemove();
    }, [handleQueryValueRemove, handleTaggedWithRemove]);


    useEffect(() => {
      setResourceListLoading(props.resourceListLoading);
    }, [props.resourceListLoading])

  
    const resourceName = {
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
    );filters
  
    return (
        <ResourceList
          resourceName={resourceName}
          items={items}
          renderItem={renderItem}
          selectedItems={selectedItems}
          onSelectionChange={selectionChange}
          selectable
          showHeader={false}
          filterControl={filterControl}
          loading={resourceListLoading}
        />
    );

    function renderItem(item) {
      const {id, title, image, variants} = item;
      const media = <Avatar customer size="medium" name={title} />;
      if(variants.length <= 1)
      {
        return (
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
              onChange={(selectedOptions) =>  (selectedOptions, id)}
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
    function selectionChange (id) {
      if(selectedItems.length < id.length) {
        setResourceListLoading(true);
        let shopifyId = id[id.length-1]

        fetch(`/api/merchant/products/shopify/${shopifyId}?shop_id=${props.shop_id}&shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        })
        .then( (response) => { return response.json() })
        .then( (data) => {
          for(var i=0; i<props.productData.length; i++)
          {
            if(props.productData[i].id == id[id.length-1]) {
              props.productData[i].variants = data.variants;
              break;
            }
            else {
            }
          }
          selectedVariants[id[id.length-1]] = [];
          for(var i=0; i<data.variants.length; i++) {
            selectedVariants[id[id.length-1]].push(data.variants[i].id); 
          }
          props.updateSelectedProduct(id, selectedVariants);
          setResourceListLoading(false);
          setSelectedItems(id);
        })
        .catch((error) => {
            console.log("Error > ", error);
        })
      }
      else {
        let uncheckedIndex;
        let tempArray = [];
        for (var i = 0; i < selectedItems.length; i++) {
          if (!id.includes(selectedItems[i])) {
            uncheckedIndex = i;
            break;
          }
        }
        for(var i=0; i<props.productData.length; i++)
        {
          if(props.productData[i].id == selectedItems[uncheckedIndex]) {
            for(var j=0; j<props.productData[i].variants.length; j++) {
              tempArray[j] = props.productData[i].variants[j].id;
            }
            props.productData[i].variants = [];
            break;
          }
        }
        delete selectedVariants[selectedItems[uncheckedIndex]];
        props.updateSelectedProduct(id, selectedVariants);
        setSelectedItems(id);
      }
    }
  }