import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Banner } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";

import { useAuthenticatedFetch } from "../hooks";

const ABTestBanner = () => {
  const app = useAppBridge();
  const location = useLocation();
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [abTestBannerPage, setAbTestBannerPage] = useState(null);

  const openBanner = useMemo(() => {
    if (location.pathname === "/" && abTestBannerPage === "dashboard") {
      return true;
    } else if (location.pathname.endsWith(abTestBannerPage)) {
      return true;
    }

    return false;
  }, [location.pathname, abTestBannerPage]);

  useEffect(() => {
    if (localStorage.getItem("abTestBannerPage") === null) {
      fetch(`/api/v2/merchant/ab_test_banner_page?shop=${shopAndHost.shop}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setAbTestBannerPage(data.page);
          localStorage.setItem("abTestBannerPage", data.page);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      setAbTestBannerPage(localStorage.getItem("abTestBannerPage"));
    }
  }, []);

  const handleOnClickBanner = () => {
    fetch(`/api/v2/merchant/ab_test_banner_click?shop=${shopAndHost.shop}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        const toastOptions = {
          message: "Thank you for helping us!",
          duration: 3000,
          isError: false,
        };
        const toastNotice = Toast.create(app, toastOptions);
        toastNotice.dispatch(Toast.Action.SHOW);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <>
      {openBanner && (
        <Banner
          title="Welcome to use In Cart Upsell & Cross Sell"
          status="success"
          action={{
            content: "Click here to help us gather information",
            onAction: () => handleOnClickBanner(),
          }}
        />
      )}
    </>
  );
};

export default ABTestBanner;
