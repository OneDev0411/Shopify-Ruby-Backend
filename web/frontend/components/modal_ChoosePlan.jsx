import {useCallback, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@shopify/polaris';
import {useShopState} from "../contexts/ShopContext.jsx";

const ModalChoosePlan = () => {
  const navigateTo = useNavigate();
  const { isSubscriptionUnpaid } = useShopState();

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