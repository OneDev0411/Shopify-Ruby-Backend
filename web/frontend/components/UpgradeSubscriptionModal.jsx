import {useNavigate} from 'react-router-dom';
import { Modal } from '@shopify/polaris';
import React from "react";

const UpgradeSubscriptionModal = ({ openModal, setOpenModal }) => {
  const navigateTo = useNavigate();

  const handleChoosePlan = (() => {
    navigateTo('/subscription');
  });

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      title="Upgrade Plan"
      primaryAction={{
        content: 'Upgrade Plan',
        onAction: handleChoosePlan,
      }}
    >
      <Modal.Section>
        <p>
          You are currently at the limit for published offers. Click the button below to upgrade your
          plan and get access to unlimited offers and features!
        </p>
      </Modal.Section>
    </Modal>
  );
};

export default UpgradeSubscriptionModal;