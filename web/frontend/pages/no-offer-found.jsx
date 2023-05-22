import {Card, Page, Layout, TextContainer, Image, Stack, Link, Heading, Subheading,EmptyState} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {ButtonGroup, Button, MediaCard, VideoThumbnail} from '@shopify/polaris';
import { offerNotFound } from "../assets";
import "../components/stylesheets/mainstyle.css";

export default function NoOfferFound() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <EmptyState
              heading="This is where you'll manage your offers"
              action={{content: 'Create offer'}}
              secondaryAction={{
                content: 'View help doc',
                url: 'https://help.shopify.com',
              }}
              image={offerNotFound}
            >
              <p>Create a new offer to get started</p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
