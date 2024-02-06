import { Layout, LegacyCard, SkeletonBodyText, SkeletonTabs, SkeletonPage, TextContainer } from '@shopify/polaris';


const EditOfferSkeleton = () => {

    const titles = ['Offer Product', 'Text', 'Display Conditions']

    return (
        <SkeletonPage backAction primaryAction>
            <Layout>
                <Layout.Section>
                    <Layout>
                        <Layout.Section>
                            <SkeletonTabs count={4} />
                        </Layout.Section>
                        {titles.map((title, index) => (
                            <Layout.Section key={index}>
                                <LegacyCard title={title} sectioned>
                                    <TextContainer>
                                        <SkeletonBodyText lines={6} />
                                    </TextContainer>
                                </LegacyCard>
                            </Layout.Section>
                        ))}
                    </Layout>
                </Layout.Section>
                <Layout.Section secondary>
                    <Layout>
                        <Layout.Section>
                            <SkeletonTabs count={4} />  
                        </Layout.Section>
                        <Layout.Section>
                            <LegacyCard sectioned>
                                <TextContainer>
                                    <SkeletonBodyText lines={6} />
                                </TextContainer>
                            </LegacyCard>
                        </Layout.Section>
                    </Layout>
                </Layout.Section>

            </Layout>
        </SkeletonPage>
    )
}

export default EditOfferSkeleton;
