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
import { homeImage } from "../assets/index.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback, useRef, useState } from "react";
import { useSelector } from 'react-redux';

export function CreateOfferCard() {
  const [active, setActive] = useState(false);
  const handleOpen = useCallback(() => setActive(true), []);
  const handleClose = useCallback(() => setActive(false), []);
  const activator = useRef(null);

  const navigateTo = useNavigate();
  const handleCreateOffer = () => {
    navigateTo('/edit-offer', { state: { offerID: null } });
  }

  const shopAndHost = useSelector(state => state.shopAndHost);

  const [currentShop, setCurrentShop] = useState(null);
  const [planName, setPlanName] = useState();
  const [trialDays, setTrialDays] = useState();

  const fetchCurrentShop = useCallback(async () => {

    fetch(`/api/merchant/current_shop?shop=${shopAndHost.shop}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => { return response.json(); })
      .then((data) => {
        setCurrentShop(data.shop);
        setPlanName(data.plan);
        setTrialDays(data.days_remaining_in_trial);
      })
      .catch((error) => {
        console.log("error", error);
      })
  }, [setCurrentShop, setPlanName, setTrialDays]);

  useEffect(() => {
    fetchCurrentShop();
  }, [fetchCurrentShop])

  const showIntercomWidget = () => {
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
    var icushop = currentShop;
    window.intercomSettings = {
      app_id: "bzuk45ty",
      id: icushop.id,
      email: icushop.email,
      phone: icushop.phone_number,
      installed_at: icushop.created_at,
      active: icushop.active,
      // plan: '#{@icushop.try(:plan).try(:name)}',
      shopify_plan: icushop.shopify_plan_name,
      trailing_30_day_roi: icushop.trailing_30_day_roi,
      shop_url: "https://" + icushop.shopify_domain
      // dashboard: "https://incartupsell.herokuapp.com/?shop_id=#{@icushop.id}"
    };
    Intercom('show');
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
          onAction: showIntercomWidget,
        }}
        description={"Our support team a can help walk you through it." + "\n" + "Chat support is open 5am to 10pm EST. Or you can send us an email anytime and we'll get back to you within 48hours."}
        popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
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
