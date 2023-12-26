import { Layout, LegacyCard, SkeletonBodyText, Grid, Text } from '@shopify/polaris';


const SummarySkeleton = ({labels, sectionsCount}) => {
    const sections = Array.from({ length: sectionsCount }).map((_, index) => (
          <Grid key={index}>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <Text>{labels[index % labels.length]}: </Text>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <SkeletonBodyText lines={1} />
            </Grid.Cell>
          </Grid>
    ));

    return (
        <>
        <Layout>
            <Layout.Section>
                <LegacyCard title='Conversion Summary'>
                    <LegacyCard.Section>
                        {sections}
                    </LegacyCard.Section>
                </LegacyCard>
            </Layout.Section>
        </Layout>
        </>
    )
}

export default SummarySkeleton;
