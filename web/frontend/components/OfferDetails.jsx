import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, AppProvider, Link, Text, Badge } from '@shopify/polaris';
import "../components/stylesheets/editOfferStyle.css";
import { condition_options } from "../shared/constants/ConditionOptions";
import { getLabelFromValue } from "../shared/helpers/commonHelpers";


const Details = (props) => {

  const navigateTo = useNavigate();

  const checkPlacement = useCallback(() => {
    if(props.offer.in_product_page && props.offer.in_cart_page) {
        return <span>Product and cart page</span>
    }
    else if (props.offer.in_ajax_cart && props.offer.in_cart_page) {
        return <span>AJAX and cart page</span>
    }
    else if (props.offer.in_cart_page) {
        return <span>Cart page</span>
    }
    else if (props.offer.in_product_page) {
        return <span>Product page</span>
    }
    else if (props.offer.in_ajax_cart) {
        return <span>AJAX cart (slider, pop up or dropdown)</span>
    }
    else {
        return <span>Cart Page</span>
    }
  }, [props.offer]);

  const handleEditOffer = (offer_id) => {
    navigateTo('/edit-offer', { state: { offerID: offer_id } });
  }

  return (
    <>
      <AppProvider>
        <Card>
          <div className="comp-cont">
            <span className="text-decor">Offer Details</span>
            <span><Link onClick={() => handleEditOffer(props.offer.id)} removeUnderline>Edit</Link></span>
          </div>
          <Card.Section>
            <Text>Placement: {checkPlacement()}</Text>
          </Card.Section>
          <Card.Section>
            <Text>Product offered: 
                {props.offerableProducts?.map((offerableProduct, index)=> (
                    <p key={index}>{offerableProduct.title}</p>
                ))}
            </Text>
          </Card.Section>
          <Card.Section>
            <Text>
              Display conditions: 
              {props.offer.rules_json?.length === 0 ? (
                    <p style={{color: '#6D7175'}}>None selected (show offer to all customer)</p>
                ) : ( 
                  <>{Array.isArray(props.offer.rules_json) && props.offer.rules_json.map((rule, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{marginRight: '10px', display: "inline-block"}}>
                              {getLabelFromValue(condition_options, rule.rule_selector)}: &nbsp;
                              <Badge>
                                  <div style={{display: 'flex', alignItems: 'center'}}>
                                      {rule.quantity && <p style={{color: 'blue', marginRight: '3px'}}>{rule.quantity} &nbsp; - &nbsp;</p> }
                                      <p style={{color: 'blue', marginRight: '3px'}}><b>{rule.item_name}</b></p>
                                  </div>
                              </Badge>
                          </div>
                      </li>
                  ))}</>
              )}
            </Text>
          </Card.Section>
        </Card>
      </AppProvider>
    </>
  )
}

export default Details;
