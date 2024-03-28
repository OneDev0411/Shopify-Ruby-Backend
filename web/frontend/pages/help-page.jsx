import {Link,Icon,Modal, LegacyCard, Page, Layout, Image, LegacyStack, Grid, List} from "@shopify/polaris";
import {helpImage} from "../assets";
import {HintMajor} from '@shopify/polaris-icons';
import {useRef, useState, useCallback, useEffect} from 'react';
import "../components/stylesheets/mainstyle.css";
import { CustomTitleBar } from "../components";
import {
    QuestionMarkMinor
} from '@shopify/polaris-icons';
import { HelpLinks } from "../shared/constants/HelpPageLinks";

import ModalChoosePlan from '../components/modal_ChoosePlan';
import { onLCP, onFID, onCLS } from 'web-vitals';
import { traceStat } from "../services/firebase/perf.js";

export default function HelpPage() {
    const [active, setActive] = useState(false);

    useEffect(()=> {
        onLCP(traceStat, {reportSoftNavs: true});
        onFID(traceStat, {reportSoftNavs: true});
        onCLS(traceStat, {reportSoftNavs: true});
      }, []);
    
    const handleClose = useCallback(() => {
        setActive(false);
      }, []);

    const videoModal = useRef(null);
    const activator = videoModal;

  return (
    <Page>
      <ModalChoosePlan />
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
                                    {HelpLinks.map((helpLink)=> {
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
