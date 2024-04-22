import {
    Badge,
    Button,
    Checkbox,
    Icon,
    LegacyCard,
    LegacyStack,
    Modal,
    Select,
} from "@shopify/polaris";
import { CancelMinor  } from '@shopify/polaris-icons';
import { ModalAddConditions } from "./../../modal_AddConditions";
import { useState, useCallback, useRef, useContext } from "react";
import React from "react";
import { condition_options } from "../../../shared/constants/ConditionOptions";
import { getLabelFromValue } from "../../../shared/helpers/commonHelpers";
import { QuantityArray, OrderArray } from "../../../shared/constants/EditOfferOptions";
import {OfferContext} from "../../../contexts/OfferContext.jsx";

const DisplayConditions = (props) => {
    const { offer, setOffer, updateOffer } = useContext(OfferContext);

    const [rule, setRule] = useState({ quantity: null, rule_selector: 'cart_at_least', item_type: 'product', item_shopify_id: null, item_name: null });
    const [quantityErrorText, setQuantityErrorText] = useState(null);
    const [itemErrorText, setItemErrorText] = useState(null);

    function upadteCondition() {
        if (QuantityArray.includes(rule.rule_selector)) {
            if (!rule.quantity) {
                setQuantityErrorText("Required filed");
                return;
            }
            else if (rule.quantity < 1) {
                setQuantityErrorText("Quantity can't be less than 1");
                return;
            }
        }
        if (OrderArray.includes(rule.rule_selector)) {
            if (!rule.item_name) {
                setItemErrorText("Required filed");
                return;
            }
            else if (rule.item_name < 1) {
                setItemErrorText("Amount can't be less than 1");
                return;
            }
        }
        else if (!rule.item_name) {
            setItemErrorText("Required field");
            return;
        }
        setOffer(prev => ({ ...prev, rules_json: [...prev.rules_json, rule] }));
        handleConditionModal();
    }

    const handleDisableCheckoutBtn = useCallback((newChecked) => updateOffer("must_accept", newChecked), []);
    const handleRemoveItiem = useCallback((newChecked) => updateOffer("remove_if_no_longer_valid", newChecked), []);
    const handleStopShowingAfterAccepted = (newChecked) => updateOffer("stop_showing_after_accepted", newChecked);

    //Modal controllers
    const [conditionModal, setConditionModal] = useState(false);
    const handleConditionModal = useCallback(() => {
        setConditionModal(!conditionModal), [conditionModal]
        setDefaultRule();
    });
    const modalCon = useRef(null);
    const activatorCon = modalCon;

    const setDefaultRule = () => {
        setRule({ quantity: null, rule_selector: 'cart_at_least', item_type: 'product', item_shopify_id: null, item_name: null });
        setQuantityErrorText(null);
        setItemErrorText(null);
    }

    function deleteRule(index) {
        const updatedRules = [...offer.rules_json];
        updatedRules.splice(index, 1);
        updateOffer('rules_json', updatedRules);
    }

    function updateRuleSet (value) {
        updateOffer('ruleset_type', value);
    };

    return (
        <>
            {(offer.id == null || offer.id != props.autopilotCheck?.autopilot_offer_id) && (
                <>
                    <LegacyCard title="Display Conditions" sectioned>

                        {offer?.rules_json?.length === 0 ? (
                            <p style={{color: '#6D7175', marginTop: '-10px', marginBottom: '14px'}}>None selected (show
                                offer to all customer)</p>
                        ) : (
                            <>{Array.isArray(offer.rules_json) && offer.rules_json.map((rule, index) => (
                                <li key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                    <div style={{marginRight: '10px', display: "inline-block"}}>
                                        {getLabelFromValue(condition_options, rule.rule_selector)}: &nbsp;
                                        <Badge>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                {rule.quantity && <p style={{
                                                    color: 'blue',
                                                    marginRight: '3px'
                                                }}>{rule.quantity} &nbsp; - &nbsp;</p>}
                                                <p style={{color: 'blue', marginRight: '3px'}}><b>{rule.item_name}</b>
                                                </p>
                                                <p style={{cursor: 'pointer'}} onClick={() => deleteRule(index)}>
                                                    <Icon source={CancelMinor} color="critical"/>
                                                </p>
                                            </div>
                                        </Badge>
                                    </div>
                                    {/*{getLabelFromValue(rule.rule_selector)}: &nbsp; {rule.quantity} <b>{rule.item_name}</b>*/}
                                </li>
                            ))}</>
                        )}
                        <Button onClick={handleConditionModal} ref={modalCon}>Add condition</Button>
                        <div className="space-4"/>
                        <p style={{
                            color: '#6D7175',
                            marginTop: '20px',
                            marginBottom: '23px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            Show offer when of these
                            <span style={{margin: '0 6px'}}>
                                <Select
                                    options={[
                                        {label: 'ANY', value: 'or'},
                                        {label: 'ALL', value: 'and'},
                                    ]}
                                    onChange={updateRuleSet}
                                    value={offer?.ruleset_type || 'or'}
                                />
                            </span>
                            rules are true at the same time.
                        </p>

                        <hr className="legacy-card-hr legacy-card-hr-t20-b15"/>
                        <LegacyStack vertical>
                            { offer.in_cart_page &&
                                (
                                    <Checkbox
                                        label="Disable checkout button until offer is accepted (only available in cart page, won't show on ajax)"
                                        helpText="This is useful for products that can only be purchased in pairs."
                                        checked={offer.must_accept}
                                        onChange={handleDisableCheckoutBtn}
                                    />
                                )
                            }
                            <Checkbox
                                label="If the offer requirements are no longer met. Remove the item from the cart."
                                checked={offer.remove_if_no_longer_valid}
                                onChange={handleRemoveItiem}
                            />
                            <Checkbox
                                label="Don't continue to show the offer after it has been accepted"
                                checked={offer.stop_showing_after_accepted}
                                onChange={handleStopShowingAfterAccepted}
                            />
                        </LegacyStack>
                    </LegacyCard>
                </>
            )}
            <Modal
                activator={activatorCon}
                open={conditionModal}
                onClose={handleConditionModal}
                title="Select products from your store"
                primaryAction={{
                    content: 'Save',
                    onAction: upadteCondition,
                }}
            >
                <Modal.Section>
                    <ModalAddConditions quantityErrorText={quantityErrorText} itemErrorText={itemErrorText}
                                        condition_options={condition_options} updateOffer={updateOffer}
                                        rule={rule} setRule={setRule}/>
                </Modal.Section>
            </Modal>
        </>
    );
}

export default DisplayConditions;
