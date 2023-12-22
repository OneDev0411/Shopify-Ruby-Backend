import {Card, LegacyCard, Select, Text} from "@shopify/polaris";
import React, {useEffect, useState} from "react";

export function CustomSelect(props) {
    const [options, setOptions] = useState(false)
    const [selected, setSelected] = useState(props.value)

    useEffect(() => {
        props.onChange(selected);
    }, [selected]);
    const toggleOptions = () => {
        setOptions(prevState => !prevState)
        console.log("toggling")
    }

    const updateSelect = (selection) => {
        toggleOptions()
        setSelected(selection)
    }

    // Click not registering
    return <div className={"select-wrapper"}>

        <div onClick={() => toggleOptions()}>
            <Select
                options={props.options}
                onChange={props.onChange}
                value={selected}
            />
        </div>
        {options && (<div className={"options-card"}>
            <LegacyCard className={"custom-select-card"}>
                <ul>
                    {props.options.map(elem => <li onClick={() => updateSelect(elem.value)}>
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