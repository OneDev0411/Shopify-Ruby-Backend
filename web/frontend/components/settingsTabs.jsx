import {Tabs, Card, TextField,Select} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import React from "react";


export function SettingTabs(){
    
    // TextFields
    const [value, setValue] = useState(null);
    const handleChange = useCallback((newValue) => setValue(newValue), []);

    const [valueAjax, setAjaxValue] = useState(null);
    const handleAjaxChange = useCallback((newValue) => setAjaxValue(newValue), []);

    const [valueCart, setCartValue] = useState(null);
    const handleCartChange = useCallback((newValue) => setCartValue(newValue), []);
   
    //Select dropdown list
   const [dropdown, setDropdown] = useState('today');
   const handleDropdownChange = useCallback((value) => setDropdown(value), []);

   const [dropdownAjax, setDropdownAjax] = useState('today');
   const handleDropdownAjaxChange = useCallback((value) => setDropdownAjax(value), []);

   const [dropdownCart, setDropdownCart] = useState('today');
   const handleDropdownCartChange = useCallback((value) => setDropdownCart(value), []);
 
   const options = [
     {label: 'Prepend', value: 'prepend'},
     {label: 'Append', value: 'append'},
     {label: 'Before', value: 'before'},
     {label: 'After', value: 'after'},
   ];
  
    // Tabs
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [],
    );
  
    const tabs = [
      {
        id: 'all-customers-1',
        content: 'Product page',
        accessibilityLabel: 'All customers',
        panelID: 'all-customers-content-1',
        innerContent:<>
                <TextField label="DOM selector"
                    value={value}
                    onChange={handleChange}
                    autoComplete="off"
                ></TextField><br/>
                <Select
                    label="DOM action"
                    options={options}
                    onChange={handleDropdownChange}
                    value={dropdown}
                />
            </>
      },
      {
        id: 'accepts-marketing-1',
        content: 'Cart page',
        panelID: 'accepts-marketing-content-1',
        innerContent:<>
                <TextField label="DOM selector"
                    value={valueCart}
                    onChange={handleCartChange}
                    autoComplete="off"
                ></TextField><br/>
                <Select
                    label="DOM action"
                    options={options}
                    onChange={handleDropdownCartChange}
                    value={dropdownCart}
                />
            </>
      },
      {
        id: 'repeat-customers-1',
        content: 'Ajax cart',
        panelID: 'repeat-customers-content-1',
        innerContent:<>
                <TextField label="DOM selector"
                    value={valueAjax}
                    onChange={handleAjaxChange}
                    autoComplete="off"
                ></TextField><br/>
                <Select
                    label="DOM action"
                    options={options}
                    onChange={handleDropdownAjaxChange}
                    value={dropdownAjax}
                />
            </>
      }
    ];

    return(<>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            <Card.Section>
            <p>{tabs[selected].innerContent}</p>
            </Card.Section>
        </Tabs>
    </>);
}