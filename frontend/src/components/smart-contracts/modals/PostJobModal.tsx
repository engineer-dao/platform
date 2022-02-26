import { ICreateContractForm } from 'components/create-contract/ICreateContractForm';
import { Modal } from 'components/modals/Modal';
import { usePostJob } from 'components/smart-contracts/modals/hooks/usePostJob';
import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';

interface IProps extends ITransactionModalProps {
  formData: ICreateContractForm;
}

export const PostJobModal = (props: IProps) => {
  const {
    formData,
    show: showPostJobModal,
    onFinish,
    onConfirmed,
    onError,
  } = props;

  const { showIPFSModal, jobTxConfirmed, callContract, errorMessage } =
    usePostJob({
      formData,
      showPostJobModal,
      onConfirmed,
    });
  const showErrorModal = errorMessage ? true : false;

  // show the IPFS modal first
  // then the transaction modal
  return (
    <>
      <Modal
        title="Uploading Job Data"
        icon="CloudUploadIcon"
        isOpen={!showErrorModal && showPostJobModal && showIPFSModal}
      >
        <p>Uploading the job data. Please wait a few seconds.</p>
      </Modal>
      <Modal
        title="An Error Occurred"
        icon="ExclamationIcon"
        iconColor="red"
        isOpen={showPostJobModal && showErrorModal}
        closeButton="Cancel"
        onRequestClose={onError}
      >
        <p>{errorMessage}</p>
      </Modal>
      <TransactionModal
        title="Post a New Job"
        onConfirmed={jobTxConfirmed}
        show={!showErrorModal && showPostJobModal && !showIPFSModal}
        {...{ callContract, onFinish, onError }}
      />
    </>
  );
};
