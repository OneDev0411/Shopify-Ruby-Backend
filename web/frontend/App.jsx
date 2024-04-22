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
import { intercomSettingsConfig } from "./assets";
import { useEffect } from "react";
import { perf } from "./services/firebase/perf.js";
perf.instrumentationEnabled = true;
perf.dataCollectionEnabled = true;

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  useEffect(() => {
    // configured intercom settings
    const moduleScripts = document.head.querySelectorAll("script[type='module']");
    if (moduleScripts.length > 0) {
      moduleScripts[0].append(intercomSettingsConfig); 
    }
  }, []);

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
                  label: "Offers Look & Feel",
                  destination: "/offers-appearance",
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
