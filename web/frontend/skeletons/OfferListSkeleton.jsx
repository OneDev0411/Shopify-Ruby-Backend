import { Layout, LegacyCard, SkeletonBodyText, SkeletonDisplayText, Grid } from '@shopify/polaris';

export default function OffersListSkeleton({ sectionsCount }) {
    const sections = Array.from({ length: sectionsCount }).map((_, index) => (
        <LegacyCard.Section key={index}>
          <SkeletonBodyText lines={2} />
        </LegacyCard.Section>
    ));

    return (
        <Layout>
            <Layout.Section>
                <LegacyCard>
                    <LegacyCard.Section>
                        <Grid gap={3}>
                            <Grid.Cell columnSpan={{xs: 8, sm: 2, md: 2, lg: 8, xl: 8}}>
                                <SkeletonDisplayText />
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 2, sm: 2, md: 2, lg: 2, xl: 2}}>
                                <SkeletonDisplayText />
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 2, sm: 2, md: 2, lg: 2, xl: 2}}>
                                <SkeletonDisplayText />
                            </Grid.Cell>
                        </Grid>
                    </LegacyCard.Section>
                    {sections}
                </LegacyCard>
            </Layout.Section>
        </Layout>
    );
}
