import {Link,Icon,Modal, MediaCard, VideoThumbnail, LegacyCard, Page, Layout, Image, LegacyStack, Grid, List} from "@shopify/polaris";
import {helpImage} from "../assets";
import {HintMajor,TroubleshootMajor} from '@shopify/polaris-icons';
import {useRef, useState, useCallback} from 'react';
import "../components/stylesheets/mainstyle.css";
import { CustomTitleBar } from "../components";
import {
    QuestionMarkMinor
  } from '@shopify/polaris-icons';

export default function HelpPage() {
    const [active, setActive] = useState(false);
    const handleOpen = useCallback(() => setActive(true), []);
    const handleClose = useCallback(() => {
        setActive(false);
      }, []);

    const videoModal = useRef(null);
    const activator = videoModal;

    function OpenModal(){
        {handleOpen};
    }

    const helpLinks = [
        {
            "title": "Analytics",
            "link": "https://help.incartupsell.com/en/articles/8515635-analytics"
        },
        {
            "title": "Autopilot offer not showing in your Ajax Cart (cart drawer)",
            "link": "https://help.incartupsell.com/en/articles/8515651-autopilot-offer-not-showing-in-your-ajax-cart-cart-drawer"
        },
        {
            "title": "Selecting your offer location",
            "link": "https://help.incartupsell.com/en/articles/8515643-selecting-your-offer-location"
        },
        {
            "title": "How do I translate/customize the offer text?",
            "link": "https://help.incartupsell.com/en/articles/8515639-how-do-i-translate-customize-the-offer-text"
        },
        {
            "title": "Easy BOGO / Buy X Get Y Offers",
            "link": "https://help.incartupsell.com/en/articles/8515636-easy-bogo-buy-x-get-y-offers"
        },
        {
            "title": "Can I show more than one offer at a time?",
            "link": "https://help.incartupsell.com/en/articles/8500252-can-i-show-more-than-one-offer-at-a-time"
        },
        {
            "title": "How to Delete an Offer",
            "link": "https://help.incartupsell.com/en/articles/8500242-how-to-delete-an-offer"
        },
        {
            "title": "How to Remove a Product That Was Already Added to the Offer",
            "link": "https://help.incartupsell.com/en/articles/8497653-how-to-remove-a-product-that-was-already-added-to-the-offer"
        },
        {
            "title": "The Wrong Offer Appears",
            "link": "https://help.incartupsell.com/en/articles/8491373-the-wrong-offer-appears"
        },
        {
            "title": "Change Offer Image to the Variant Image",
            "link": "https://help.incartupsell.com/en/articles/8491334-change-offer-image-to-the-variant-image"
        },
        {
            "title": "Offer Buttons/Dropdowns missing",
            "link": "https://help.incartupsell.com/en/articles/8491345-offer-buttons-dropdowns-missing"
        }
    ]

  return (
    <Page>
      <CustomTitleBar title='Help' icon={QuestionMarkMinor} />
      <Layout>
            <Layout.Section>
                {/* card for image and text */}
                <LegacyCard title={
                    <LegacyStack>
                        <Icon source={HintMajor} />
                        <p variant="headingXs" as="h3">
                           <strong>Here is a list of relevant articles you may find helpful</strong> 
                        </p>
                    </LegacyStack>
                    } sectioned>
                    <p>There are more help articles in our <Link url="https://help.incartupsell.com/en/collections/6780837-help-articles-for-new-ui" external target="_blank">Help Docs</Link> page</p>
                    <div className="space-4"></div>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 8, xl: 6}}>
                            <div className={"help-articles"}>
                                <List>
                                    {helpLinks.map((helpLink)=> {
                                       return <List.Item><Link url={helpLink.link} external removeUnderline target="_blank">{helpLink.title}</Link></List.Item>
                                    })}
                                </List>
                            </div>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 4, xl: 6}}>
                            <Image
                                source={helpImage}
                                alt="ICU Help Center"
                                width={300}
                            />
                        </Grid.Cell>
                    </Grid>
                </LegacyCard>
                {/* Second section with video */}
                {/* Ticket https://dev.azure.com/ltv-growth/In-Cart-Upsell/_workitems/edit/678 says to temporarily hide, so commenting the code and not removing */}
                {/* <LegacyCard
                    title={
                        <LegacyStack>
                            <Icon source={TroubleshootMajor} />
                            <p variant="headingXs" as="h3">
                               <strong>Setup videos</strong>
                            </p>
                        </LegacyStack>
                    } sectioned
                >
                <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 12, lg: 12, xl: 6}}>
                        <div ref={activator}>
                            <MediaCard
                                title="Create Your First Upsell and Cross-Sell Offer"
                                primaryAction={{
                                    content: 'Learn more',
                                    onAction: handleOpen,
                                }}
                                description={`A step by step guide on how to set up your first upsell and cross-sell offer in In Cart 
                                Upsell, a Shopify app that helps you increase your average order value from the traffic you are 
                                sending to your store.`}
                                >
                                <VideoThumbnail
                                    onClick={handleOpen}
                                    videoLength={318}
                                    thumbnailUrl="https://i.ytimg.com/vi/NibJDu5YFdM/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC4HMpCnoGPA-gWLRl8raAfbb4SeA"
                                />
                            </MediaCard>
                        </div>
                            
                    </Grid.Cell>
                </Grid>  
                </LegacyCard> */}
                

                <Modal
                    activator={activator}
                    open={active}
                    onClose={handleClose}
                    title="Create Your First Upsell and Cross-Sell Offer"
                >
                    <Modal.Section>
                    <iframe 
                        width="560" 
                        height="315" 
                        src="https://www.youtube-nocookie.com/embed/NibJDu5YFdM?rel=0" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen> 
                    </iframe>
                    </Modal.Section>
                </Modal>



            </Layout.Section>
        </Layout>
    </Page>
  );
}
