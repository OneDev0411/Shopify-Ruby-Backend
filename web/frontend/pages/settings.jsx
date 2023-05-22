import{Card,Grid, Button, Page} from "@shopify/polaris";
import{TitleBar} from "@shopify/app-bridge-react";
import React, { Component } from "react";
import {Partners, SettingTabs} from "../components";
import { getShop, toggleActivation } from "../../../utils/services/actions/shop";
export default class Settings extends Component{

    constructor(props) {
        super(props);
        this.state =  {
            currentShop: null
        };
    }

    async componentWillMount() {
        const response = await getShop('icu-dev-store.myshopify.com');
        this.setState({
            currentShop: response.shop,
        });
    }

    async toggleActivation(){
        console.log("Deactivate app");
        const response = await toggleActivation(this.state.currentShop?.shopify_domain);
        window.location.reload();
    }

    render(){
        const {currentShop} = this.state
        return(
        <>
            <Page>
            <TitleBar/>
                <Card sectioned>
                    {(currentShop?.activated) ? (
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 10, xl: 4}}>
                            <p>This app is activated</p>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 2, xl: 4}}>
                            <div style={{display: 'flex', justifyContent: 'end'}}> 
                                <Button onClick={()=>this.toggleActivation()}>Deactivate</Button>
                            </div>
                        </Grid.Cell>
                    </Grid>) : (
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 10, xl: 4}}>
                            <p>This app is deactivated</p>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 2, xl: 4}}>
                            <div style={{display: 'flex', justifyContent: 'end'}}> 
                                <Button onClick={()=>this.toggleActivation()}>Activate</Button>
                            </div>
                        </Grid.Cell>
                    </Grid>
                    )}
                </Card>
                <div className="space-4"></div>
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <div id="no-bg-card">
                            <Card sectioned style={{backgroundColor: "transparent"}}>
                                <h2><strong>Default offer placement settings</strong></h2>
                                <br/>
                                <p>Only edit these settings if you know HTML.</p>
                            </Card>
                        </div>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <Card sectioned columnSpan={{ md: 6, lg: 6, xl: 6}}>
                            {/* Tabs */}
                           {currentShop ?  <SettingTabs shop={currentShop} /> : 'Loading...'}
                        </Card>
                    </Grid.Cell>
                </Grid>
                <div className="space-4"></div>
                <Partners/>
            </Page>
        </>
        )
    }
}