import {Page, Layout, Card, Stack, Image} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {woohoo} from "../assets";
import "../components/stylesheets/mainstyle.css";
import React from 'react';

export default function ConfirmCharge() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = JSON.parse(urlParams.get('success'));
    
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
                        source={woohoo}
                    />
                    </Stack>
                    <Stack distribution="center">
                      <div>
                        The subscription was successful
                      </div>
                    </Stack>
                    <Stack distribution="center">
                    <a href="/dashboard">Please click here</a>
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
                    <a href="/dashboard">Please contact our staff</a>
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
