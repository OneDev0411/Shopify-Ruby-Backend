import {useCallback, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@shopify/polaris';
import {useShopState} from "../contexts/ShopContext.jsx";
import {useAuthenticatedFetch} from "../hooks/index.js";
import {useSelector} from "react-redux";

const ModalChoosePlan = () => {
  const navigateTo = useNavigate();
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const { isSubscriptionUnpaid, setIsSubscriptionUnpaid } = useShopState();

  useEffect(() => {
    const modalContent = document.getElementById('not-dismissable-modal');

    if (modalContent) {
      let modal = modalContent.closest('.Polaris-Modal-Dialog__Modal');

      if (modal) {
        let closeButton = modal.querySelector('.Polaris-Modal-CloseButton')
        if (closeButton) {
          closeButton.style.display = 'none';

        }
      }
    }

    fetch('api/v2/merchant/is_subscription_unpaid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: shopAndHost.shop })
    }).then(response => response.json()).then((response) => { setIsSubscriptionUnpaid(response.subscription_not_paid) });

  }, [])

  const handleChoosePlan = useCallback(() => {
    navigateTo('/subscription');
  }, [navigateTo]);

  return (
  <Modal
      open={isSubscriptionUnpaid}
      onClose={() => false}
      title="Choose Plan"
      primaryAction={{
        content: 'Choose Plan',
        onAction: handleChoosePlan,
      }}
    >
      <Modal.Section>
        <div id="not-dismissable-modal">
          <p>{import.meta.env.VITE_REACT_APP_MODAL_CONTENT}</p>
        </div>
      </Modal.Section>
    </Modal>
  );
};

export default ModalChoosePlan;