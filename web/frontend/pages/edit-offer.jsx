import {Page, Card,Layout,Tabs,Icon} from '@shopify/polaris';
import {DesktopMajor, MobileMajor} from '@shopify/polaris-icons';
import { TitleBar} from "@shopify/app-bridge-react";
import "../components/stylesheets/mainstyle.css";
import { EditOfferTabs, SecondTab, ThirdTab, FourthTab } from "../components";
import {useState, useCallback} from 'react';
import React from 'react';


export default function EditPage() {
    // Content section tab data
    const [selected, setSelected] = useState(0);
    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    const tabs = [
        {
            id: 'content',
            content: "Content",
            panelID: 'content',
        },
        {
            id: 'placement',
            content: 'Placement',
            panelID: 'placement',
        },
        {
            id: 'appearance',
            content: 'Appearance',
            panelID: 'appearance',
        },
        {
            id: 'advanced',
            content: 'Advanced',
            panelID: 'advanced',
        },
    ];

    // Preview section tab data
    const [selectedPre, setSelectedPre] = useState(0);
    const handlePreTabChange = useCallback(
        (selectedPreTabIndex) => setSelectedPre(selectedPreTabIndex),
        [],
    );

    const tabsPre = [
        {
            id: 'desktop',
            content:  (
                <div className='flex-tab'>
                    <Icon source={DesktopMajor} />
                    <p>Desktop</p>
                </div>    
              ),
            panelID: 'desktop',
        },
        {
            id: 'mobile',
            content: (
                <div className='flex-tab'>
                    <Icon source={MobileMajor} />
                    <p>Mobile</p>
                </div>    
              ),
            panelID: 'mobile',
        }
    ];

  return (
    <Page
        breadcrumbs={[{content: 'Products', url: '#'}]}
        title="Create new offer"
        compactTitle
        primaryAction={{content: 'Publish', disabled: true}}
        secondaryActions={[{content: 'Save draft', disabled: false}]}
    >
        <TitleBar/>
        <Layout>
            <Layout.Section>
                <Tabs
                    tabs={tabs}
                    selected={selected}
                    onSelect={handleTabChange}
                    disclosureText="More views"
                    fitted
                >   
                    <div className='space-4'></div>

                    {selected == 0 ? 
                        // page was imported from components folder
                        <EditOfferTabs/>
                    : "" }
                    {selected == 1 ? 
                        // page was imported from components folder
                        <SecondTab/>
                    : "" } 
                    {selected == 2 ? 
                        // page was imported from components folder
                        <ThirdTab/>
                    : "" }    
                    {selected == 3 ? 
                        // page was imported from components folder
                        <FourthTab/>
                    : "" }    
                </Tabs>
            </Layout.Section>
            <Layout.Section secondary>
                <Tabs
                    tabs={tabsPre}
                    selected={selectedPre}
                    onSelect={handlePreTabChange}
                    disclosureText="More views"
                    fitted
                >   
                    <div className='space-4'></div>
                    {selectedPre == 0 ? 
                        <Card sectioned>
                    
                        </Card>
                    : "" }
                </Tabs>
            </Layout.Section>
        </Layout>
    </Page>
  );
}

