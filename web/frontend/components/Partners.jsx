import {VerticalStack, LegacyCard, Image, Button, Grid, Pagination} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import Slider from "react-slick";
import React from "react";
import { useSelector } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuthenticatedFetch } from "../hooks";
import { PartnersSliderSettings } from '../shared/constants/PartnersSliderSettings';
import ErrorPage from "../components/ErrorPage";

export function Partners() {
    const shopAndHost = useSelector(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [partners, setPartners] = useState(null);
    const [error, setError] = useState(null);

    let slider;

    function next(){
      slider.slickNext();
    }
    function previous(){
      slider.slickPrev();
    }

    const getAllPartners = useCallback(async ()=>{
      fetch(`/api/v2/merchant/partners?shop=${shopAndHost.shop}`, {
        method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
       })
       .then( (response) => { return response.json(); })
       .then( (data) => {
        setPartners(data.partners);
       })
       .catch((error) => {
        setError(error)
        console.log("error", error);
       })
     }, [])

    const handleToggleDescription = (index) => {
      setExpandedIndex(index === expandedIndex ? null : index);
    };

    useEffect(() => {
      getAllPartners();
    }, [getAllPartners]);

    // if (error) { return < ErrorPage />; }

    return(<>
      <LegacyCard sectioned title="Recommended Apps" id={"LegacyCardYpadding"}>
        <p>Check out our partners below.</p>
        <div className="space-4"></div>
          <Grid >
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}>
                <Slider ref={c => (slider = c)} {...PartnersSliderSettings}>
                  {partners && partners.map((partner, index) => (
                    <Grid key={index}>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}>
                        <div style={{margin: '10px'}}>
                            <LegacyCard sectioned columnSpan={{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}>
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
                            <h1 className='settings-card-heading'>
                              <strong style={{
                                fontSize: `${partner.name.length > 20 ? 14 : 28}px`,
                                lineHeight: "0.8"
                              }}>{partner.name}
                              </strong>
                            </h1>
                            <br/>
                            <p style={index === expandedIndex ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} onClick={() => handleToggleDescription(index)} key={index}>
                              {partner.description}
                            </p>
                            <br/>
                            <VerticalStack distribution="start">
                            <Image
                              style={{
                              width:'60%',
                              marginBottom:'15px',
                              }}
                              source="https://assets.incartupsell.com/images/5-star.png"
                            />
                            <Button url={partner.app_url} target="blank">View on Shopify App Store</Button>
                            </VerticalStack>
                          </LegacyCard>
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
    </LegacyCard>
  </>);
}
