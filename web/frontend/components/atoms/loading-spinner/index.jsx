import { Spinner } from "@shopify/polaris";

const LoadingSpinner = () => (
    <div
        style={{
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
        }}
    >
        <Spinner size="large" color="teal" />
    </div>
);

export default LoadingSpinner;