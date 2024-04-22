import { Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { OfferEdit } from "../components";

export default function OfferEditPage() {
  return (
    <Page>
      <TitleBar
        title='Edit Offer'
        primaryAction={{
          content: 'Save',
          onAction: () => updateShopSettings(`#${hexColor}`, "css_options", `${comp}`, `${property}`),
        }}
        secondaryActions={[
          {
            content: 'Shop Settings',
            onAction: () => console.log("Secondary action"),
          },
        ]}
      />
      <Layout>
        <Layout.Section>
         <OfferEdit />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
