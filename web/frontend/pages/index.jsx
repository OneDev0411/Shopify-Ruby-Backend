import { ButtonGroup, Button, Image, Layout, LegacyCard, LegacyStack,
          MediaCard, Page, Text, VerticalStack, VideoThumbnail } from "@shopify/polaris";
import { homeImage } from "../assets";
import "../components/stylesheets/mainstyle.css";

const HomePage = () => {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          {/* card for image and text */}
          <LegacyCard sectioned>
            <LegacyStack distribution="center">
              <LegacyStack.Item>
                <div className="center-content">
                  <Image
                    source={homeImage}
                    alt="Create your first offer"
                    width={219}
                  />
                  <VerticalStack gap="5">
                    <Text variant="headingMd" as="h2" element="h1">Here is where you'll view your offers</Text>
                    <Text as="h3">Start by creating your first offer and publishing it to your store</Text>
                  </VerticalStack>
                  <div className="space-10"></div>
                  <div className="center-btn">
                    <ButtonGroup>
                      <Button primary>Create offer</Button>
                      <Button>View help docs</Button>
                    </ButtonGroup>
                  </div>
                </div>
              </LegacyStack.Item>
            </LegacyStack>
          </LegacyCard>
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
      </Layout>
    </Page>
  );
};

export default HomePage;

