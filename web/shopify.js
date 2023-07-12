import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import {PostgreSQLSessionStorage} from '@shopify/shopify-app-session-storage-postgresql';
let { restResources } = await import(
  `@shopify/shopify-api/rest/admin/${LATEST_API_VERSION}`
);
// If you want IntelliSense for the rest resources, you should import them directly
// import { restResources } from "@shopify/shopify-api/rest/admin/2022-10";

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  "My Shopify One-Time Charge": {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: "USD",
    interval: BillingInterval.OneTime,
  },
};

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: new PostgreSQLSessionStorage(
    new URL('postgres://ua0qbodo646ito:p9eab0c730a447e57589ff972885869252567053971e5dc7f26397ac9fec49b1c@ec2-35-169-23-28.compute-1.amazonaws.com:5432/d52ei2g7is3nbs'),
  ),
});

export default shopify;
