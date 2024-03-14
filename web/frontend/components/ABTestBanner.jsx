import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Banner, Layout } from "@shopify/polaris";

import { useAuthenticatedFetch } from "../hooks";

const ABTestBanner = ({ planName }) => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [abTestBannerPage, setAbTestBannerPage] = useState(null);

  const openBanner = () => {
    if (planName !=='free') {
      return false;
    }
    if (location.pathname === "/" && abTestBannerPage === "dashboard") {
      return true;
    }
    if (location.pathname.endsWith(abTestBannerPage)) {
      return true;
    }

    return false;
  };

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
        navigateTo("/subscription");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <>
      {openBanner() && (
        <Layout.Section>
          <Banner status="info">
            <p>
              You are currently on the free plan and only one offer can be
              published at a time.
              <a href="#" onClick={handleOnClickBanner}>
                Click here
              </a>{" "}
              to see the features available or to upgrade your plan
            </p>
          </Banner>
        </Layout.Section>
      )}
    </>
  );
};

export default ABTestBanner;
