import {Grid,ButtonGroup, Button, MediaCard, VideoThumbnail,Card, Page, Layout, TextContainer, Image, Stack, Link, Heading, Subheading} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {trophyImage,homeImage} from "../assets";
import { ProductsCard } from "../components";
import "../components/stylesheets/mainstyle.css";
import { render } from "react-dom";

export default function HomePage() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          {/* card for image and text */}
          <Card sectioned>
            <Stack distribution="center">
              <Stack.Item>
                <div className="center-content">
                  <Image
                    source={homeImage}
                    alt="Create your first offer"
                    width={219}
                  />
                  <TextContainer spacing="loose" style={"text-align:center"}>
                    <Heading element="h1">Here is where you'll view your offers</Heading>
                    <Subheading element="h3">Start by creating your first offer and publishing it to your store</Subheading>
                  </TextContainer>
                  <div className="space-10"></div>
                  <div className="center-btn">
                    <ButtonGroup>
                      <Button primary>Create offer</Button>
                      <Button>View help docs</Button>
                    </ButtonGroup>
                  </div>
                </div>
              </Stack.Item>
            </Stack>
          </Card>
          {/* Second section with video */}
          <MediaCard
            title="Need help creating your offer?"
            primaryAction={{
              content: 'Learn more',
              onAction: () => {},
            }}
            description={"Our support team a can help walk you through it."+ "\n"+ "Chat support is open 5am to 10pm EST. Or you can send us an email anytime and we'll get back to you within 48hours."}
            popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
          >
            <VideoThumbnail
              videoLength={80}
              thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
            />
          </MediaCard>
        </Layout.Section>
        {/* <Layout.Section>
          <ProductsCard />
        </Layout.Section> */}
      </Layout>
    </Page>
  );
}
