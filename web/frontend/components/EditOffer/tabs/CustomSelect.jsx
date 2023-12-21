import {Card, Select} from "@shopify/polaris";
import React, {useState} from "react";

export function CustomSelect(props) {
    const [options, setOptions] = useState(false)
    const toggleOptions = () => {
        // setOptions(true)
        console.log("toggling")
    }

    // Click not registering
    return <div className={"select-wrapper"}>
        <Select
            options={props.options}
            onChange={props.onChange}
            value={props.value}
            onClick={() => toggleOptions()}
        />
        {options && (<div className={"options-card"}>
            <Card className={"custom-select-card"}>
                {props.options.map(props.callbackfn
                )}
            </Card>
        </div>)}
    </div>;
}