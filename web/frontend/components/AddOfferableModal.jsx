import { Modal } from '@shopify/polaris';
import React, { useContext, useState, useEffect } from "react";
import {OfferContext} from "../contexts/OfferContext.jsx";

const AddOfferableModal = ({ openModal, setOpenModal }) => {
  const { offer } = useContext(OfferContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
      if (!(offer.offerable_product_details.length > 0 && offer.title !== '')) {
          setMessage('This offer can’t be published without at least one Offer Product and an Offer Title.\
                      Please enter this information in the Content tab.');
      } else if (!(offer.uses_ab_test  && offer.text_b.length > 0 && offer.cta_b.length > 0)) {
        setMessage('You need to add the text_b and cta_b fields to publish this offer with AB Testing.');
      }
    }, [offer.offerable_product_details.length, offer.title, offer.uses_ab_test, offer.text_b, offer.cta_b]); 

  const handleModalClose = (() => {
    setOpenModal(false)
  });

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      title="Offer Incomplete"
      primaryAction={{
        content: 'OK',
        onAction: handleModalClose,
      }}
    >
      <Modal.Section>
        <p>
          {message}
        </p>
      </Modal.Section>
    </Modal>
  );
};

export default AddOfferableModal;
