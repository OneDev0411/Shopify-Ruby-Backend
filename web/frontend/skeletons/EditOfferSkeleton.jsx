import { Layout, LegacyCard, SkeletonBodyText, SkeletonTabs, SkeletonPage, TextContainer, SkeletonDisplayText, LegacyStack, Button } from '@shopify/polaris';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const EditOfferSkeleton = () => {

    const labels = ['Offer title', 'Offer text', 'Button text']

    return (
        <SkeletonPage backAction primaryAction>
            <Layout>
                <Layout.Section>
                    <Layout>
                        <Layout.Section>
                            <SkeletonTabs count={4} />
                        </Layout.Section>
                        <Layout.Section>
                            <LegacyCard title='Offer Product' sectioned>
                                <TextContainer>
                                    <SkeletonBodyText lines={1} />
                                    <SkeletonDisplayText />
                                    <LegacyStack vertical>
                                        <p>Selected Products</p>
                                        <SkeletonBodyText />
                                    </LegacyStack>
                                </TextContainer>
                            </LegacyCard>
                        </Layout.Section>
                        <Layout.Section>
                            <LegacyCard title='Text' sectioned>
                                {labels.map((label, index) => (
                                    <TextContainer key={index}>
                                        <p>{label}</p>
                                        <Skeleton borderRadius={4} height={32} baseColor='var(--p-color-bg-strong)' enableAnimation={false} />
                                        <br/>
                                    </TextContainer>
                                ))}
                                <SkeletonDisplayText />
                            </LegacyCard>
                        </Layout.Section>
                        <Layout.Section>
                            <LegacyCard title='Display Conditions' sectioned>
                                <Skeleton count={8} className='skeleton-margin' height={13} width={250} baseColor='var(--p-color-bg-strong)' />
                            </LegacyCard>
                        </Layout.Section>
                        <Layout.Section>
                            <div className="space-4"/>
                            <LegacyStack distribution='center'>
                                <Skeleton borderRadius={4} height={35} width={130} baseColor='var(--p-color-bg-strong)' enableAnimation={false} />
                            </LegacyStack>
                        </Layout.Section>
                    </Layout>
                </Layout.Section>
                <Layout.Section secondary>
                    <Layout>
                        <Layout.Section>
                            <SkeletonTabs />  
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
