import {Link,Icon,Modal, MediaCard, VideoThumbnail, LegacyCard, Page, Layout, Image, LegacyStack, Grid, List} from "@shopify/polaris";
import {helpImage} from "../assets";
import {HintMajor,TroubleshootMajor} from '@shopify/polaris-icons';
import {useRef, useState, useCallback} from 'react';
import "../components/stylesheets/mainstyle.css";
import { GenericTitleBar } from "../components";
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

  return (
    <Page>
      <GenericTitleBar title='Help' icon={QuestionMarkMinor} />
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
                    <p>There are more help articles in our <Link url="https://help.incartupsell.com/en/collections/3263755-all" external>Help Docs</Link> page</p>
                    <div className="space-4"></div>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 8, xl: 6}}>
                            <div className={"help-articles"}>
                                <List>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823518-choose-product-page-offer-location" external removeUnderline>Choose product page offer location</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823509-ajax-refresh-codes-for-common-themes" external removeUnderline>AJAX Refresh Codes for Common Themes</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823523-autopilot-ajax-cart-fix" external removeUnderline>Autopilot - AJAX cart fix</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/6355185-in-cart-upsell-application-new-feature-track-conversion" external removeUnderline>In Cart UpSell Application New Feature – Track Conversion</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/6326918-a-b-testing" external removeUnderline>A/B Testing</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823538-trackifyx-integration" external removeUnderline>TrackifyX integration</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823527-how-to-override-the-product-image" external removeUnderline>How To Override the Product Image</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823513-about-offer-stats" external removeUnderline>About Offer Stats</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823535-translate-offer-using-weglot" external removeUnderline>Translate offer using Weglot</Link></List.Item>
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
                <LegacyCard 
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
                </LegacyCard>
                

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
