import {Page, Layout, Card, Stack, Image} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Redirect } from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react'
import "../components/stylesheets/mainstyle.css";
import React from 'react';
import { useSelector } from 'react-redux';

export default function ConfirmCharge() {
    const urlParams = new URLSearchParams(window.location.search);
    const shopAndHost = useSelector(state => state.shopAndHost);
    const app = useAppBridge();
    const success = JSON.parse(urlParams.get('success'));
    const redirectToHome = ()=>{
      let redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, `/?shop=${shopAndHost.shop}&host=${shopAndHost.host}`);
    }
    
  return (
    <Page>
        <TitleBar></TitleBar>
        <div className="auto-height">
          <Layout>
            {success ? (
              <Layout.Section>
                <Card>
                  <Stack distribution="center">
                    <Image 
                        source="https://assets.incartupsell.com/images/woohoo.png"
                    />
                    </Stack>
                    <Stack distribution="center">
                      <div>
                        The subscription was successful
                      </div>
                    </Stack>
                    <Stack distribution="center">
                    <a href="#" onClick={redirectToHome}>Please click here</a>
                    </Stack>
                  </Card>
                </Layout.Section>
              ) : (
              <Layout.Section>
                <Card>
                  <Stack distribution="center">
                    <div>
                      Ooops! Something went wrong
                    </div>
                  </Stack> 
                  <Stack distribution="center">    
                    <a href="#" onClick={redirectToHome}>Please contact our staff</a>
                  </Stack>    
                </Card>
              </Layout.Section>
              )}
          </Layout>
        </div>
        <div className="space-10"></div>
    </Page>
  );
}
