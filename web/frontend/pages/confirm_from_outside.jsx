import React, { useEffect } from 'react';
import {Redirect} from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react';
import { confirmCharge } from "../../../utils/services/actions/subscription";


const ConfirmFromOutside = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const shopify_domain = urlParams.get('shop');
  const charge_id = urlParams.get('charge_id');
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  async function renderConfirmCharge(){
    const response = await confirmCharge('icu-dev-store.myshopify.com', charge_id);

    if (window.top == window.self) {
      // If the current window is the 'parent', change the URL by setting location.href  
      redirect.dispatch(Redirect.Action.REMOTE, `/confirm_charge?success=${response.success}`);

    } else {
      // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
      redirect.dispatch(Redirect.Action.APP, `/confirm_charge?success=${response.success}`);

    }
  }

  useEffect(async () => {
    await renderConfirmCharge();
  }, []);

  return <div></div>;
};

export default ConfirmFromOutside;