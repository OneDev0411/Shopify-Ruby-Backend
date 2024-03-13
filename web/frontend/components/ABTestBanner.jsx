import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Banner } from "@shopify/polaris";
import { useSelector, useDispatch } from "react-redux";

import { useAuthenticatedFetch } from "../hooks";
import { setABTestBannerPage } from "../store/reducers/abTestBannerPage";

const ABTestBanner = () => {
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const location = useLocation();

  const reduxDispatch = useDispatch();
  const abTestBannerPage = useSelector((state) => state.abTestBannerPage.page);

  const openBanner = useMemo(() => {
    if (location.pathname === "/" && abTestBannerPage === "dashboard") {
      return true;
    } else if (location.pathname.endsWith(abTestBannerPage)) {
      return true;
    }

    return false;
  }, [location.pathname, abTestBannerPage]);

  useEffect(() => {
    if (abTestBannerPage === null) {
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
          reduxDispatch(setABTestBannerPage(data.page));
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [abTestBannerPage]);

  return (
    <>
      {openBanner && (
        <Banner
          title="Welcome to use In Cart Upsell & Cross Sell"
          status="success"
        />
      )}
    </>
  );
};

export default ABTestBanner;
