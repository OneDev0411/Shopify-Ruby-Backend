import{Card,Grid, Button, Page, Stack, Image,Pagination} from "@shopify/polaris";
import{TitleBar} from "@shopify/app-bridge-react";
import React, { Component, useState, useCallback } from "react";
import {SettingTabs} from "../components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import {stars} from "../assets";

export default class Settings extends Component{

    constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    }

    next() {
    this.slider.slickNext();
    }
    previous() {
    this.slider.slickPrev();
    }

    render(){

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1
          };

        return(
        <>
            <Page>
            <TitleBar/>
                <Card sectioned>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 10, xl: 4}}>
                            <p>This app is activated</p>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 2, xl: 4}}>
                            <Button>Deactivate</Button>
                        </Grid.Cell>
                    </Grid>
                </Card>
                <div className="space-4"></div>
                <Grid>
                    <Grid.Cell columnSpan={{ md: 6, lg: 6, xl: 6}}>
                        <div id="no-bg-card">
                            <Card sectioned style={{backgroundColor: "transparent"}}>
                                <h2><strong>Default offer placement settings</strong></h2>
                                <br/>
                                <p>Only edit these settingsif you know HTML.</p>
                            </Card>
                        </div>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ md: 6, lg: 6, xl: 6}}>
                        <Card sectioned>
                            {/* Tabs */}
                            <SettingTabs/>
                        </Card>
                    </Grid.Cell>
                </Grid>
                <div className="space-4"></div>
                <Card sectioned title="Recommended Apps">
                    <p>Check out our partners below.</p>
                    <div className="space-4"></div>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 12, lg: 12, xl: 12}}>
                            <Slider ref={c => (this.slider = c)} {...settings}>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 11, xl: 4}}>
                                        <Card sectioned>
                                            <img
                                                alt=""
                                                width="100%"
                                                height="100%"
                                                style={{
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                }}
                                                src="../assets/translation-lab.jpg"
                                            />
                                            <br/>
                                            <h1 className="Polaris-Heading"><strong>Translation Lab</strong></h1>
                                            <br/>
                                            <p>Translation Lab offers the tools and automation to translate your store into 
                                                multiple languages and add multiple currencies hassle-free. You can translate 
                                                your store into the maximum number of languages Shopify allows.
                                            </p>
                                            <br/>
                                            <Stack distribution="start">
                                            <Image 
                                                source={stars}
                                            />
                                            <Button url="https://apps.shopify.com/content-translation">View on Shopify App Store</Button>
                                            </Stack>  
                                        </Card>
                                    </Grid.Cell>
                                </Grid>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 11, xl: 4}}>
                                    <Card sectioned>
                                        <img
                                            alt=""
                                            width="100%"
                                            height="100%"
                                            style={{
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            }}
                                            src="../assets/gempages.png"
                                        />
                                        <br/>
                                        <h1 className="Polaris-Heading"><strong><span style={{fontSize: "0.95rem"}}>GemPages Landing Page Builder</span></strong></h1>
                                        <br/>
                                        <p>GemPages grants you the power of code without coding. Build as you envision with a 
                                            versatile Drag & Drop Editor. Quickly create pages of any type by choosing from 
                                            an extensive template library.  All in one place, on a visual canvas.
                                        </p>
                                        <br/>
                                        <Stack distribution="start">
                                            <Image 
                                                source={stars}
                                            />
                                            <Button url="https://apps.shopify.com/gempages">View on Shopify App Store</Button>
                                        </Stack>  
                                    </Card>
                                    </Grid.Cell>
                                </Grid>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 11, xl: 4}}>
                                        <Card sectioned>
                                            <img
                                                alt=""
                                                width="100%"
                                                height="100%"
                                                style={{
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                }}
                                                src="../assets/preorder-now.png"
                                            />
                                            <br/>
                                            <h1 className="Polaris-Heading"><strong>Pre‑Order Now WOD</strong></h1>
                                            <br/>
                                            <p>Your customers like to place pre-orders for their favorite products that are out of stock or 
                                                not yet released. They do not like those unclickable out-of-stock buttons. Create hype around
                                                 new product launches with stylish preorders.
                                            </p>
                                            <br/>
                                            <Stack distribution="start">
                                                <Image 
                                                    source={stars}
                                                />
                                                <Button url="https://apps.shopify.com/preorder-now">View on Shopify App Store</Button>
                                            </Stack>  
                                        </Card>
                                    </Grid.Cell>
                                </Grid>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 11, xl: 4}}>
                                        <Card sectioned>
                                            <img
                                                alt=""
                                                width="100%"
                                                height="100%"
                                                style={{
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                }}
                                                src="../assets/trackifyx.png"
                                            />
                                            <br/>
                                            <h1 className="Polaris-Heading"><strong>Trackify X Facebook Pixel</strong></h1>
                                            <br/>
                                            <p>TikTok, Facebook & Snap pixel events for master, niche & collection pixels. Server-side API 
                                                purchase & non purchase events to track sales. Detailed analytics by pixels, tags, collections,
                                                 products, devices and even UTM-tags.
                                            </p>
                                            <br/>
                                            <Stack distribution="start">
                                                <Image 
                                                    source={stars}
                                                />
                                                <Button url="https://apps.shopify.com/trackify-1">View on Shopify App Store</Button>
                                            </Stack>  
                                        </Card>
                                    </Grid.Cell>
                                </Grid>
                                <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 11, xl: 4}}>
                                        <Card sectioned>
                                            <img
                                                alt=""
                                                width="100%"
                                                height="100%"
                                                style={{
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                }}
                                                src="../assets/Welgot.png"
                                            />
                                            <br/>
                                            <h1 className="Polaris-Heading"><strong>Weglot ‑ Translate Your Store</strong></h1>
                                            <br/>
                                            <p>Weglot is a complete eCommerce translation solution for Shopify With Weglot, you can have 
                                                an instantly translated store in under 5 minutes. Manage your translations easily with a 
                                                first layer of machine translation for speed and automation.
                                            </p>
                                            <br/>
                                            <Stack distribution="start">
                                                <Image 
                                                    source={stars}
                                                />
                                                <Button url="https://apps.shopify.com/weglot">View on Shopify App Store</Button>
                                            </Stack>  
                                        </Card>
                                    </Grid.Cell>
                                </Grid>
                            </Slider>
                        </Grid.Cell>
                    </Grid>
                    <div className="space-4"></div>
                    <Pagination
                        hasPrevious
                        onPrevious={this.previous}
                        hasNext
                        onNext={this.next}
                    />
                </Card>
            </Page>
        </>
        )
    }
}