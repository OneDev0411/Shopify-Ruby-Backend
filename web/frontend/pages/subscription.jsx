import {ButtonGroup, Button, Card, Page, Layout, TextContainer, Image, Stack} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {billingImg, stars} from "../assets";
import "../components/stylesheets/mainstyle.css";

export default function HomePage() {
  return (
    <Page>
        {/* No titlebar */}
        <TitleBar></TitleBar>
        <div className="auto-height">
            <Layout>
                <Layout.Section>
                    {/* title should be dynamic*/}
                    <Card title="Paid"
                        primaryFooterAction={{content: 'Upgrade', disabled: false}}
                        sectioned
                    >
                        <Stack>
                            <Stack.Item>
                                <p><small>Recommended</small></p>
                                <div className="space-4"></div>
                                <p>
                                500 Offers<br/>
                                Geo targeting<br/>
                                Autopilot (AI-generated offers feature)<br/>
                                A/B testing<br/>
                                Advanced discount terms<br/>
                                Live onboarding<br/>
                                Success manager support<br/>
                                Remove "Power by In Cart Upsell" water mark on offer box
                                </p>                                
                            </Stack.Item>
                            <Stack.Item>
                                <Image
                                    source={billingImg}
                                    alt="upgrade subscription"
                                    width={200}
                                />
                            </Stack.Item>
                        </Stack>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    {/* title should be dynamic*/}
                    <Card title="Free" sectioned primaryFooterAction={{content:'Downgrade', disable: false}}>
                        <p><small>Current plan</small></p>
                            <div className="space-4"></div>
                            <p>
                                Limited offer<br/>
                                Geo targeting<br/>
                                Autopilot (AI-generated offers feature)<br/>
                                A/B testing<br/>
                                Advanced discount terms<br/>
                                "Power by In Cart Upsell" water mark on offer box
                                <br/><br/>
                        </p>                
                    </Card>
                </Layout.Section>
            </Layout>
        </div>
            
        <div className="space-10"></div>
        <Layout>
            <Layout.Section>
                <Card sectioned>
                    <p>Need help, have some questions, or jus want to say hi? We're available for a live hat 7 days a week from 5 AM EST - 9 PM EST.</p>
                    <br/>
                    <p>Not anything urgent? Fire us an email, we usually respond with 24 hours Monday to Friday</p>
                </Card>
            </Layout.Section>
        </Layout>
        <div className="space-10"></div>
        <Layout>
            <Layout.Section>
                <Stack distribution="center">
                    <p style={{textAlign:'center'}}><strong>750+ 5 star reviews<br/>Trusted by over a thousand Shopify merchants</strong></p>
                </Stack>
            </Layout.Section>
        </Layout>
        <div className="space-10"></div>
        <Layout>
            <Layout.Section oneThird>
                <Card title="ECOKIND Cleaning" sectioned>
                    <p><strong>Canada</strong></p>
                    <p>Great app with good features to upsell. Been using this for a month and see 
                        results. We like how it's customizable. Support is very good too!
                    </p>
                    <br/>
                    <Stack distribution="center">
                    <Image 
                        source={stars}
                        distribution="center"
                    />
                    </Stack>
                    
                </Card>
            </Layout.Section>
            <Layout.Section oneThird>
                <Card title="My Gaming Case" sectioned>
                    <p><strong>United States</strong></p>
                    <p>I used to use a different in cart upsell app which had a pop up. I like how this 
                        apps upsell does not pop up. Lasandra helped me set up this app and the upsell 
                        looks beautiful in my cart page. 10/10 service, Lasandra went above & beyond!!!
                    </p>
                    <br/>
                    <Stack distribution="center">
                    <Image 
                        source={stars}
                        distribution="center"
                    />
                    </Stack>
                    
                </Card>
            </Layout.Section>
            <Layout.Section oneThird>
                <Card title="Deinhamudi.de" sectioned>
                    <p><strong>Germany</strong></p>
                    <p>Very nice App with the best service! Thanks!<br/>
                        Everything works fluently and I could 3x my conversion rate. Very helpful.
                    </p>
                    <br/>
                    <Stack distribution="center">
                    <Image 
                        source={stars}
                        distribution="center"
                    />
                    </Stack>
                    
                </Card>
            </Layout.Section>
        </Layout>
        <div className="space-10"></div>
    </Page>
  );
}
