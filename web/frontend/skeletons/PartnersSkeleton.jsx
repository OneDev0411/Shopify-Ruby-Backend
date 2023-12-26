import { Grid, Layout, LegacyCard, LegacyStack } from '@shopify/polaris';
import Skeleton from 'react-loading-skeleton';
import "../components/stylesheets/mainstyle.css";


const PartnersSkeleton = ({sectionsCount}) => {
    const sections = Array.from({ length: sectionsCount }).map((_, index) => (
        <Grid.Cell key={index} columnSpan={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 4}}>
            <Grid key={index}>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}>
                    <div style={{margin: '10px'}}>
                        <LegacyCard>
                            <div className='skeleton-styles' >
                                <Skeleton height={160} width={160} enableAnimation={false} />
                            </div>
                            <div style={{padding: 30}}>
                                <LegacyStack spacing='loose'>
                                    <Skeleton height={30} width={135} enableAnimation={false} />
                                    <Skeleton height={10} width={210} enableAnimation={false} count={4} />
                                    <Skeleton height={30} width={210} enableAnimation={false} />
                                </LegacyStack>
                            </div>
                        </LegacyCard>
                    </div>
                </Grid.Cell>
            </Grid>
        </Grid.Cell>
      ));

    return (
        <>
        <Layout>
            <Layout.Section>
                <Grid>
                    {sections}
                </Grid>
            </Layout.Section>
        </Layout>
        </>
    )
}

export default PartnersSkeleton;
