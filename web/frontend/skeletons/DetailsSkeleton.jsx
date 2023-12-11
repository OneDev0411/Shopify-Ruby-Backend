import { Layout, LegacyCard, SkeletonBodyText, Text, TextContainer } from '@shopify/polaris';


const DetailsSkeleton = ({labels, sectionsCount}) => {
    const sections = Array.from({ length: sectionsCount }).map((_, index) => (
        <LegacyCard.Section key={index}>
           <TextContainer>
                <Text>{labels[index % labels.length]}: </Text>
                <SkeletonBodyText lines={2} />
           </TextContainer>
        </LegacyCard.Section>
      ));

    return (
        <>
        <Layout>
            <Layout.Section>
                <LegacyCard title='Offer Details'>
                    {sections}
                </LegacyCard>
            </Layout.Section>
        </Layout>
        </>
    )
}

export default DetailsSkeleton;
