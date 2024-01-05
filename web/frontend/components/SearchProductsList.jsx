import {ResourceList, ResourceItem, OptionList} from '@shopify/polaris';
import {useState} from 'react';
import {
  ExcludeVariantSelectors,
  ProductResourceName
} from '../shared/constants/Others';

export function SearchProductsList(props) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({})

  function handleSelectedVariant(selectedOptions, id) {
    setSelectedVariants(selectedVariants => {
      return { ...selectedVariants, [id]: selectedOptions }
    })
    props.updateSelectedProduct(id, selectedOptions);
  }

  const items = props.productData;

  return (
    <>
      <ResourceList
        resourceName={ProductResourceName}
        items={items}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={selectionChange}
        showHeader={false}
        loading={props.resourceListLoading}
      />
    </>
  );

  function renderItem(item) {
    const {id, title, image, variants} = item
    if(!variants || ExcludeVariantSelectors.includes(props.rule?.rule_selector)){
      return (
        <ResourceItem
          id={id}
          title={title}
          accessibilityLabel={`View details for ${title}`}
          persistActions
          onClick={() => selectedProduct(item)}
        >
          <p variant="bodyMd" fontWeight="bold" as="h3">
            <strong>{title}</strong>
          </p>

        </ResourceItem>
      );
    }
    if(variants.length <= 1 || ExcludeVariantSelectors.includes(props.rule?.rule_selector))
    {
      return (
        <ResourceItem
          id={id}
          title={title}
          image={image}
          accessibilityLabel={`View details for ${title}`}
          persistActions
          onClick={() => selectedProduct(item)}
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
          onClick={() => selectedProduct(item)}
        >
          <p variant="bodyMd" fontWeight="bold" as="h3">
            <strong>{title}</strong>
          </p>
        </ResourceItem>
        <div style={{ marginLeft: '30px' }}>
            <OptionList
            options={option}
            selected={selectedVariants[id] || []}
            onChange={(selectedOptions) => handleSelectedVariant(selectedOptions, id)}
            >
            </OptionList>
        </div>
        </>
      );
    }
  }

  function selectedProduct(item) {
    if(props.item_type!=="product"){
      props.updateSelectedProduct(item.title, item.id);
      props.setResourceListLoading(false);
      setSelectedItems(item.id);
    }
    else{
      selectionChange([item.id]);
    }
  }

  function selectionChange (id) {
    if(selectedItems.length < id.length) {
      props.setResourceListLoading(true);
      let shopifyId = id[id.length-1]
      let url = `/api/merchant/products/shopify/${shopifyId}?shop=${props.shop}`

      fetch(url, {
        method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
       })
       .then( (response) => { return response.json(); })
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
        props.updateSelectedProduct(data.title, id, selectedVariants);
        props.setResourceListLoading(false);
        setSelectedItems(id);
       })
       .catch((error) => {
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