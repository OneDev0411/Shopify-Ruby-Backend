import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
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
            <Heading>All Time Revenue</Heading>
            <TextContainer>
              <p>55%</p>
            </TextContainer>
          </div>
          <div>
            <Heading>Offers Displayed</Heading>
            <TextContainer>
              <p> 33 % </p>
            </TextContainer>
          </div>
          <div>
            <Heading>Offers Added To Cart</Heading>
            <TextContainer>
              <p>99%</p>
            </TextContainer>
          </div>
          <div>
            <Heading>Offers Sales</Heading>
            <TextContainer>
              <p>$124.89</p>
            </TextContainer>
          </div>
        </Layout.Section>
        <Layout.Section>
        <OffersList />
      </Layout.Section>
      </Layout>
    </Page>
  );
}
