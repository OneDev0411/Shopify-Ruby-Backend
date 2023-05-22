import {Layout, Card, Stack, Image} from "@shopify/polaris";
import { useAppBridge } from '@shopify/app-bridge-react';
import { TitleBar } from "@shopify/app-bridge-react";
// import { stars } from '../assets'; <-- ERROR
import '../components/stylesheets/mainstyle.css';
import React from 'react';

export function Reviews() {

  return (
    <div>
      <Layout>
        <Layout.Section>
          <Stack distribution="center">
            <p style={{textAlign:'center'}}><strong>750+ 5 star reviews<br/>Trusted by over a thousand Shopify merchants</strong></p>
          </Stack>
        </Layout.Section>
      </Layout>
      <div className="space-10"></div>
      <Layout>
        <Layout.Section oneThird>
          <Card title="ECOKIND Cleaning" sectioned>
            <p><strong>Canada</strong></p>
            <p>Great app with good features to upsell. Been using this for a month and see
                results. We like how it's customizable. Support is very good too!
            </p>
            <br/>
            <Stack distribution="center">
              {/* <Image */}
              {/*   source={stars} */}
              {/*   distribution="center" */}
              {/* /> */}
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card title="My Gaming Case" sectioned>
            <p><strong>United States</strong></p>
            <p>I used to use a different in cart upsell app which had a pop up. I like how this
                apps upsell does not pop up. Lasandra helped me set up this app and the upsell
                looks beautiful in my cart page. 10/10 service, Lasandra went above & beyond!!!
            </p>
            <br/>
            <Stack distribution="center">
            <Image
              source={stars}
              distribution="center"
            />
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card title="Deinhamudi.de" sectioned>
            <p><strong>Germany</strong></p>
            <p>Very nice App with the best service! Thanks!<br/>
                Everything works fluently and I could 3x my conversion rate. Very helpful.
            </p>
            <br/>
            <Stack distribution="center">
            <Image
              source={stars}
              distribution="center"
            />
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </div>
  );
}
