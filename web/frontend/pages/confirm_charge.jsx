import {Page, Layout, LegacyCard, LegacyStack, Image} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { woohoo } from "../assets";
import "../components/stylesheets/mainstyle.css";
import React from 'react';

const ConfirmCharge = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = JSON.parse(urlParams.get('success'));

  return (
    <Page>
        <TitleBar></TitleBar>
        <div className="auto-height">
          <Layout>
            {success ? (
              <Layout.Section>
                <LegacyCard>
                  <LegacyStack distribution="center">
                    <Image
                        source={woohoo}
                    />
                    </LegacyStack>
                    <LegacyStack distribution="center">
                      <div>
                        The subscription was successful
                      </div>
                    </LegacyStack>
                    <LegacyStack distribution="center">
                      <a href="/dashboard">Please click here</a>
                    </LegacyStack>
                  </LegacyCard>
                </Layout.Section>
              ) : (
              <Layout.Section>
                <LegacyCard>
                  <LegacyStack distribution="center">
                    <div>
                      Ooops! Something went wrong
                    </div>
                  </LegacyStack>
                  <LegacyStack distribution="center">
                    <a href="/dashboard">Please contact our staff</a>
                  </LegacyStack>
                </LegacyCard>
              </Layout.Section>
              )}
          </Layout>
        </div>
        <div className="space-10"></div>
    </Page>
  );
}

export default ConfirmCharge;
