import { SkeletonPage, Layout, LegacyCard, SkeletonBodyText, Grid, VerticalStack, TextContainer } from '@shopify/polaris';

export default function AbAnalyticsSkeleton() {

    return (
        <Layout>
            <Layout.Section>     
                <LegacyCard title='Click Rate' sectioned>
                    <TextContainer>
                        <SkeletonBodyText lines={3} />
                    </TextContainer>
                </LegacyCard>         
            </Layout.Section>
        </Layout>
    );
}
