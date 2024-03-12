import React from "react";
import { CustomTitleBar} from "../components";

const ErrorPage = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <CustomTitleBar
        title="In Cart Upsell & Cross Sell"
        image={"https://in-cart-upsell.nyc3.cdn.digitaloceanspaces.com/images/ICU-Logo-Small.png"}
      />
      <img
        src={ "https://in-cart-upsell.nyc3.cdn.digitaloceanspaces.com/images/ErrorPage.png" }
        alt= "Error Image"
        style={{ maxWidth: "100%", maxHeight: "400px", marginTop: "20px" }}
      />
      <h2 style={{ fontSize: "22px", fontStyle: "bold", lineHeight: "45px" }} >We've experienced an error</h2>
      <p style={{ fontSize: "17px" }} >It's been reported and our engineers are investigating the issue.</p>
    </div>
  );
};
export default ErrorPage;

