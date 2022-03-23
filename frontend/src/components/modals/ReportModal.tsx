import React, { useState } from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import { useNotifications } from '../notifications/useNotifications';
import { useSmartContracts } from '../smart-contracts/hooks/useSmartContracts';
import { useReportJob } from '../smart-contracts/modals/hooks/useReportJob';
import { TransactionModal } from '../smart-contracts/modals/TransactionModal';
import { Modal } from './Modal';

interface IReportModal {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const ReportModal: React.FC<IReportModal> = (props) => {
  const { isOpen, setOpen } = props;
  const { contracts } = useSmartContracts();
  const { callContract, isDisabled } = useReportJob();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const { pushNotification } = useNotifications();

  const handleClick = () => {
    setIsTransacting(true);
    setShowTransactionModal(true);
  };

  const onTransactionComplete = () => {
    setIsTransacting(false);
    setShowTransactionModal(false);
    setOpen(false);
  };

  const onError = (e: any) => {
    setIsTransacting(false);
    setShowTransactionModal(false);

    pushNotification({
      heading: 'Error',
      content: `There was an error, please try again. \n ${e}`,
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setOpen(false)}
        icon="FlagIcon"
      >
        <p className="mb-4">
          If you believe this job violates our Terms of Service, you can report
          it and receive a reward (10% of the bounty.)
        </p>
        <p className="mb-4">
          Reporting a job requires a $50 stake. Upon acceptance, your stake will
          be refunded. If the report is declined, you will lose your stake.
        </p>
        {contracts.isERC20Approved ? (
          <PrimaryButton
            color="red"
            content="Report"
            disabled={isDisabled || isTransacting}
            loading={isTransacting}
            onClick={handleClick}
          />
        ) : (
          <PrimaryButton
            color="blue"
            content="Approve Spending"
            disabled={isDisabled || isTransacting}
            loading={isTransacting}
            onClick={handleClick}
          />
        )}
      </Modal>
      <TransactionModal
        title="Reporting Job"
        show={showTransactionModal}
        syncOnConfirm
        {...{
          callContract,
          onConfirmed: () => onTransactionComplete(),
          onError: (e) => onError(e),
        }}
      />
    </>
  );
};

export default ReportModal;
