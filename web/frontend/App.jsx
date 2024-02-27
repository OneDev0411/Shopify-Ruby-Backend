import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import OfferProvider from "./OfferContext.jsx";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Offers",
                  destination: "/offer",
                },
                {
                  label: "Analytics",
                  destination: "/analytics",
                },
                {
                  label: "Subscription",
                  destination: "/subscription",
                },
                {
                  label: "Settings",
                  destination: "/settings",
                },
                {
                  label: "Help",
                  destination: "/help-page",
                },
              ]}
            />
          <OfferProvider>
            <Routes pages={pages} />
          </OfferProvider>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
