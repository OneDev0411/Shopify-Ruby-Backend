import {Stack, Card, Image, Button, Grid, Pagination} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import {stars} from "../assets";
import Slider from "react-slick";
import React from "react";
import { getPartners } from "../../../utils/services/actions/partners";

export function Partners(){
    const [partners, setPartners] = useState(null);
    const previousVal = null;
    const nextVal = null;
    let slider;

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1
    };

    function next(){
      slider.slickNext();
    }
    function previous(){
      slider.slickPrev();
    }

    async function getAllPartners(){
      const response = await getPartners();
      setPartners(response.partners);
    }

    useEffect(() => {
      getAllPartners();
    }, []);

    return(<>
      <Card sectioned title="Recommended Apps" id={"cardYpadding"}>
        <p>Check out our partners below.</p>
        <div className="space-4"></div>
        <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 12, lg: 12, xl: 12}}>
                <Slider ref={c => (slider = c)} {...settings}>
                  {partners && partners.map((partner, index) => (
                    <Grid key={index}>
                      <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 11, xl: 4}}>
                        <Card sectioned>
                          <Image
                            alt=""
                            width="100%"
                            height="100%"
                            style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            }}
                            src={partner.image}
                          />
                          <br/>
                          <h1 className="Polaris-Heading"><strong>{partner.name}</strong></h1>
                          <br/>
                          <p>{partner.description}</p>
                          <br/>
                          <Stack distribution="start">
                          <Image 
                              source={stars}
                          />
                          <Button url={partner.app_url}>View on Shopify App Store</Button>
                          </Stack>  
                        </Card>
                      </Grid.Cell>
                    </Grid>
                  ))}
                </Slider>
            </Grid.Cell>
        </Grid>
        <div className="space-4"></div>
        <Pagination
            hasPrevious
            onPrevious={previous}
            hasNext
            onNext={next}
        />
    </Card>
  </>);
}