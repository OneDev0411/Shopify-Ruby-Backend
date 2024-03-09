import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import OfferProvider from "./contexts/OfferContext.jsx";
import ShopProvider from "./contexts/ShopContext.jsx";

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
            <ShopProvider>
                <OfferProvider>
                  <Routes pages={pages} />
                </OfferProvider>
            </ShopProvider>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
