import { Banner } from "@shopify/polaris";

const BannerContainer = ({ title, onDismiss, status, tone, children }) => (
    <div style={{ marginBottom: "10px" }} className="polaris-banner-container">
        <Banner title={title} onDismiss={onDismiss} tone={tone} status={status}>
            {children}
        </Banner>
    </div>
);

export default BannerContainer;