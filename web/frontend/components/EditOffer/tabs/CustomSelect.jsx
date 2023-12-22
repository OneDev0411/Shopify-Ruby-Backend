import {Card, LegacyCard, Select, Text} from "@shopify/polaris";
import React, {useState} from "react";

export function CustomSelect(props) {
    const [options, setOptions] = useState(false)
    const toggleOptions = () => {
        setOptions(prevState => !prevState)
        console.log("toggling")
    }

    // Click not registering
    return <div className={"select-wrapper"}>

        <div onClick={() => toggleOptions()}>
            <Select
                options={props.options}
                onChange={props.onChange}
                value={props.value}
            />
        </div>
        {options && (<div className={"options-card"}>
            <LegacyCard className={"custom-select-card"}>
                <ul>
                    {props.options.map(elem => <li onClick={() => toggleOptions()}>
                            <Text as="h2" variant="bodyMd">
                                {elem.label}
                            </Text>
                    </li>
                    )}
                </ul>
            </LegacyCard>
        </div>)}
    </div>;
}