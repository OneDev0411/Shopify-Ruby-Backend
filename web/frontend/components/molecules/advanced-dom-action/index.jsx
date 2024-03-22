import { TextField, Select, Text } from "@shopify/polaris";
import React from "react";
import { DOMActionOptions } from "../../../shared/constants/DOMActionOptions";

const DomAction = ({
    title,
    actionId,
    selectorValue,
    actionValue,
    disabled,
    onChangeSelector,
    onChangeAction,
  }) => (
    <>
        <div>
            <div style={{paddingBottom: '10px'}}>
                <Text variant="headingSm" as="h2">{title}</Text>
            </div>
            <TextField
                label="DOM Selector"
                value={selectorValue}
                onChange={onChangeSelector}
                type="text"
                disabled={disabled}
            />
            <div className="space-4"/>

            <Select
                label="DOM action"
                id={actionId}
                options={DOMActionOptions}
                onChange={onChangeAction}
                value={actionValue}
                disabled={disabled}
            />
        </div>
        <hr className="legacy-card-hr" />
    </>
);

export default DomAction;
