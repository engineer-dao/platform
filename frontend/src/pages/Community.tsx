import { useState } from 'react';
import { Modal } from 'components/ui/Modal';

const Community = () => {
  const [showModal, setShowModal] = useState(true);

  // find Icon types at https://unpkg.com/browse/@heroicons/react@1.0.5/outline/index.js
  return (
    <>
      <div>Community</div>

      <Modal
        title="This Page Isn't Ready Yet"
        icon="InformationCircleIcon"
        closeButton="Got it"
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <p>We're working on this page. It isn't ready yet.</p>
      </Modal>
    </>
  );
};

export default Community;
