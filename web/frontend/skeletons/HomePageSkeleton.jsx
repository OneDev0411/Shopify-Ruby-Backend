import { SkeletonPage, Layout, LegacyCard, SkeletonBodyText, TextContainer, SkeletonDisplayText, Grid } from '@shopify/polaris';
import OffersListSkeleton from './OfferListSkeleton';

export default function HomePageSkeleton() {

    return (
        <SkeletonPage primaryAction>
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned>
                        <TextContainer>
                            <SkeletonBodyText lines={4} />
                            <SkeletonDisplayText size="small" />
                        </TextContainer>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section>
                    <OffersListSkeleton sectionsCount={4} />
                </Layout.Section>
                <Layout.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                            <LegacyCard>
                                <LegacyCard.Section>
                                    <SkeletonBodyText lines={10} />
                                </LegacyCard.Section>
                            </LegacyCard>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                            <LegacyCard>
                                <LegacyCard.Section>
                                    <SkeletonBodyText lines={10} />
                                </LegacyCard.Section>
                            </LegacyCard>
                        </Grid.Cell>
                        {/* <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 8, lg: 4, xl: 4}}>
                            <LegacyCard>
                                <LegacyCard.Section>
                                    <SkeletonBodyText lines={10} />
                                </LegacyCard.Section>
                            </LegacyCard>
                        </Grid.Cell> */}
                    </Grid>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );
}
