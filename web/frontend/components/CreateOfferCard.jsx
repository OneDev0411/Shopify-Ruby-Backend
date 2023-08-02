import {
  Button,
  ButtonGroup,
  Image,
  LegacyCard,
  LegacyStack,
  Link,
  MediaCard, Modal,
  Text,
  VerticalStack, VideoThumbnail
} from "@shopify/polaris";
import {homeImage} from "../assets/index.js";
import {useNavigate} from "react-router-dom";
import {useCallback, useRef, useState} from "react";

export function CreateOfferCard() {
  const [active, setActive] = useState(false);
  const handleOpen = useCallback(() => setActive(true), []);
  const handleClose = useCallback(() => setActive(false), []);
  const activator = useRef(null);

  const navigateTo = useNavigate();
  const handleCreateOffer = () => {
    navigateTo('/edit-offer', { state: { offerID: null } });
  }

  return (
    <>
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
                  <Button primary onClick={() => handleCreateOffer()}>Create offer</Button>
                  <Button url="https://help.incartupsell.com/en/collections/3263755-all" external target="_blank">View Help Docs</Button>
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
          onAction: handleOpen,
        }}
        description={"Our support team a can help walk you through it."+ "\n"+ "Chat support is open 5am to 10pm EST. Or you can send us an email anytime and we'll get back to you within 48hours."}
        popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
      >
        <VideoThumbnail
          onClick={handleOpen}
          videoLength={80}
          thumbnailUrl="./../assets/business-woman-smiling-in-office.jpeg"
        />
      </MediaCard>

      <Modal
        activator={activator}
        open={active}
        onClose={handleClose}
        title="Getting Started"
      >
        <Modal.Section>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/ANEPQkYLjbA"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen>
          </iframe>
        </Modal.Section>
      </Modal>
    </>
  )
}