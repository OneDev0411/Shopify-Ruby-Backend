import { SkeletonPage, Layout, LegacyCard, SkeletonBodyText, Grid, VerticalStack, TextContainer } from '@shopify/polaris';
import DetailsSkeleton from './DetailsSkeleton';
import SummarySkeleton from './SummarySkeleton';
import AbAnalyticsSkeleton from './AbAnalyticsSkeleton';

export default function EditOfferViewSkeleton() {

    const detailsLabels = ['Placement', 'Product Offered', 'Display Conditions']

    const summaryLabels = ['Number of Views', 'Number of Clicks', 'Revenue', 'Conversion Rate']

    return (
        <SkeletonPage backAction primaryAction>
            <Layout>
                <Layout.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 8, xl: 8}}>
                            <LegacyCard sectioned>
                                <TextContainer>
                                    <SkeletonBodyText lines={6} />
                                </TextContainer>
                            </LegacyCard>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 4, xl: 4}}>
                            <VerticalStack gap="5">
                                <DetailsSkeleton labels={detailsLabels} sectionsCount={3} />
                                <SummarySkeleton labels={summaryLabels} sectionsCount={4}/>
                                <AbAnalyticsSkeleton />
                            </VerticalStack>
                        </Grid.Cell>
                    </Grid>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );
}
