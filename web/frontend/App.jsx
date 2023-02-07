import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";

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
                  label: "Dashboard",
                  destination: "/dashboard",
                },
                {
                  label: "Offers",
                  destination: "/offer",
                },
                {
                  label: "Edit Offer",
                  destination: "/edit-offer",
                },
                {
                  label: "Subscription",
                  destination: "/subscription",
                },
                {
                  label: "Analytics",
                  destination: "/analytics",
                },
                {
                  label: "Help",
                  destination: "/help-page",
                },
                {
                  label: "No Offer",
                  destination: "/no-offer-found",
                },
              ]}
            />
            <Routes pages={pages} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
