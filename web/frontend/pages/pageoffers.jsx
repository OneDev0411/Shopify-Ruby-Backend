import { Page, Layout, VerticalStack, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { OffersList } from "../components";

export default function PageOffers() {

  return (
    <Page>
      <TitleBar
        title="Your Offers"
        primaryAction={ { content: 'New Offer', url: '/offeredit'} }
        secondaryActions={[
          {
            content: "New Offer",
            onAction: () => console.log("Secondary action"),
          },

          {
            content: "Reupload",
            onAction: () => console.log("Secondary action"),
          },
        ]}
      />
      <Layout>
        <Layout.Section>
          <div className="cfsdf"><h3>Every Shopify theme is different - but we can get it working with
             our app, guaranteed, or your money back! Contact our technical team now for help!
                                 </h3>
          </div>
          <div className="cfsdf"><h1>Need Your Offers To Appear Faster?</h1></div>
      </Layout.Section>
        <Layout.Section>
          <div>
            <Text variant="headingMd" as="h2">All Time Revenue</Text>
            <VerticalStack >
              <p>55%</p>
            </VerticalStack >
          </div>
          <div>
            <Text variant="headingMd" as="h2">Offers Displayed</Text>
            <VerticalStack >
              <p> 33 % </p>
            </VerticalStack>
          </div>
          <div>
            <Text variant="headingMd" as="h2">Offers Added To Cart</Text>
            <VerticalStack>
              <p>99%</p>
            </VerticalStack>
          </div>
          <div>
            <Text variant="headingMd" as="h2">Offers Sales</Text>
            <VerticalStack>
              <p>$124.89</p>
            </VerticalStack>
          </div>
        </Layout.Section>
        <Layout.Section>
        <OffersList />
      </Layout.Section>
      </Layout>
    </Page>
  );
}
