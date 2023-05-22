import {Link,Icon,Modal, Button, MediaCard, VideoThumbnail,Card, Page, Layout, Image, Stack, Grid, List} from "@shopify/polaris";
import {help} from "../assets";
import {HintMajor,TroubleshootMajor} from '@shopify/polaris-icons';
import { TitleBar } from "@shopify/app-bridge-react";
import {useRef, useState, useCallback} from 'react';
import "../components/stylesheets/mainstyle.css";

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
        <TitleBar
            title="Help"
        /> 
      <Layout>
            <Layout.Section>
                {/* card for image and text */}
                <Card title={
                    <Stack>
                        <Icon source={HintMajor} />
                        <p variant="headingXs" as="h3">
                           <strong>Here is a list of relevant articles you may find helpful</strong> 
                        </p>
                    </Stack>
                    } sectioned>
                    <p>There are more help articles in our <Link url="https://help.incartupsell.com/en/collections/3263755-all" external>Help Docs</Link> page</p>
                    <div className="space-4"></div>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 8, xl: 6}}>
                            <div className={"help-articles"}>
                                <List>
                                    <List.Item>
                                        <Link url="https://help.incartupsell.com/en/articles/6355185-in-cart-upsell-application-new-feature-track-conversion" external>
                                        In Cart UpSell Application New Feature – Track Conversion
                                        </Link>
                                    </List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/6326918-a-b-testing" external>A/B Testing</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823538-trackifyx-integration" external>TrackifyX integration</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823527-how-to-override-the-product-image" external>How To Override the Product Image</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823513-about-offer-stats" external>About Offer Stats</Link></List.Item>
                                    <List.Item><Link url="https://help.incartupsell.com/en/articles/5823535-translate-offer-using-weglot">Translate offer using Weglot</Link></List.Item>
                                </List>
                            </div>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 4, lg: 4, xl: 6}}>
                            <Image
                                source={help}
                                alt="upgrade subscription"
                                width={200}
                            />
                        </Grid.Cell>
                    </Grid>
                </Card>
                {/* Second section with video */}
                <Card 
                    title={
                        <Stack>
                            <Icon source={TroubleshootMajor} />
                            <p variant="headingXs" as="h3">
                               <strong>Setup videos</strong>
                            </p>
                        </Stack>
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
                </Card>
                

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
