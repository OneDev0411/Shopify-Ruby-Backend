import React from "react";

import { Page } from "@shopify/polaris";
import ABTestBanner from "./ABTestBanner";

const PageContainer = ({ showABTestBanner = false, children, ...props }) => {
  return (
    <Page {...props}>
      {showABTestBanner && (
        <>
          <ABTestBanner />
          <div class="space-4"></div>
        </>
      )}
      {children}
    </Page>
  );
};

export default PageContainer;
