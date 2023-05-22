import {Stack, Card, Image, Button, Grid, Pagination} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import {stars} from "../assets";
import Slider from "react-slick";
import React from "react";
import { getPartners } from "../../../utils/services/actions/partners";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export function Partners(){
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [partners, setPartners] = useState(null);
    const previousVal = null;
    const nextVal = null;
    let slider;

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          
        }
      ]
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

    const handleToggleDescription = (index) => {
      setExpandedIndex(index === expandedIndex ? null : index);
    };

    useEffect(() => {
      getAllPartners();
    }, []);

    return(<>
      <Card sectioned title="Recommended Apps" id={"cardYpadding"}>
        <p>Check out our partners below.</p>
        <div className="space-4"></div>
        <Grid >
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}>
                <Slider ref={c => (slider = c)} {...settings}>
                  {partners && partners.map((partner, index) => (
                    <Grid key={index}>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}>
                        <div style={{margin: '10px'}}>
                            <Card sectioned columnSpan={{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}>
                            <div style={{ width: '200px', height: '200px', margin: 'auto', display: 'flex'}} >
                              <Image
                                alt=""
                                width="100%"
                                style={{
                                width:'100%',
                                margin:'auto',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                }}
                                src={partner.image}
                              />
                            </div>
                            <br/>
                            <h1 className="Polaris-Heading"><strong>{partner.name}</strong></h1>
                            <br/>
                            <p style={index === expandedIndex ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} onClick={() => handleToggleDescription(index)} key={index}>
                              {partner.description}
                            </p>
                            <br/>
                            <Stack distribution="start">
                            <Image 
                                source={stars}
                            />
                            <Button url={partner.app_url}>View on Shopify App Store</Button>
                            </Stack>  
                          </Card>
                        </div>
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