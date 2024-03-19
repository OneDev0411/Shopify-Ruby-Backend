import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Banner } from "@shopify/polaris";

import { useAuthenticatedFetch } from "../hooks";

const ABTestBanner = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [abTestBannerPage, setAbTestBannerPage] = useState(null);

  const openBanner = () => {
    if (
      (location.pathname === "/" && abTestBannerPage === "dashboard") ||
      location.pathname.endsWith(abTestBannerPage)
    ) {
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
          if (data.page !== "") {
            setAbTestBannerPage(data.page);
            localStorage.setItem("abTestBannerPage", data.page);
          }
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
        <Banner status="info">
          <p>
            You're currently on the Free plan, and limited to one published
            offer at a time.{" "}
            <a href="#" onClick={handleOnClickBanner}>
              Click here
            </a>{" "}
            to upgrade your plan to get access to more features, and unlimited
            offers!
          </p>
        </Banner>
      )}
    </>
  );
};

export default ABTestBanner;
