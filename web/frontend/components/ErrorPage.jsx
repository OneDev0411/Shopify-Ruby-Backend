import React from "react";
import { CustomTitleBar} from "../components";

const ErrorPage = ({ showBranding }) => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      { showBranding &&
        <CustomTitleBar
        title="In Cart Upsell & Cross Sell"
        image={"https://incartupsell-assets.b-cdn.net/Images/ICU-Logo-Small.png"}
      />
      }
      <img
        src={ import.meta.env.VITE_REACT_APP_ERROR_IMG_URL }
        alt= "Error Image"
        style={{ maxWidth: "100%", maxHeight: "400px", marginTop: "20px" }}
      />
      <h2 style={{ fontSize: "22px", fontStyle: "bold", lineHeight: "45px" }}> { import.meta.env.VITE_REACT_APP_ERROR_TITLE } </h2>
      <p style={{ fontSize: "17px" }}> { import.meta.env.VITE_REACT_APP_ERROR_CONTENT } </p>
    </div>
  );
};
export default ErrorPage;

