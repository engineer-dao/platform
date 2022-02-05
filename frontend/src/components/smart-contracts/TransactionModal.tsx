import React, { useEffect, useState } from 'react';
import { ContractTransaction } from 'ethers';
import { Modal } from 'components/ui/Modal';
import { ethers } from 'ethers';

export type CallContractCallback = () => Promise<ContractTransaction>;

enum TXStatus {
  Ready = 'Ready',
  Waiting = 'Waiting',
  Finished = 'Finished',
  Error = 'Error',
}

export type OnConfirmedCallback = (
  receipt: ethers.providers.TransactionReceipt
) => void;

export type TransactionError = {
  message: string;
};

export const TransactionModal = ({
  show,
  title,
  callContract,
  onConfirmed,
  onFinish,
  onError,
}: {
  show: boolean;
  title: string;
  callContract: CallContractCallback;
  onConfirmed?: OnConfirmedCallback;
  onFinish: () => void;
  onError?: (arg0: string) => void;
}) => {
  const [txStatus, setTxStatus] = useState<TXStatus>(TXStatus.Ready);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  // this is a finite state machine that cycles through Ready, Waiting, Error (optionally) and Finished statuses
  useEffect(() => {
    if (show) {
      if (txStatus === TXStatus.Ready) {
        // call the smart contract function, then handle the response or error
        callContract()
          .then((tx: ContractTransaction) => {
            tx.wait()
              .then((receipt: ethers.providers.TransactionReceipt) => {
                // completed the transaction - callback and set to finished
                onConfirmed && onConfirmed(receipt);
                setTxStatus(TXStatus.Finished);
              })
              .catch((e: TransactionError) => {
                // completed the transaction - callback and set to error state
                const _errorMessage = e.message || 'Unknown error';
                setErrorMessage(_errorMessage);
                onError && onError(_errorMessage);
                setTxStatus(TXStatus.Error);
              });
          })
          .catch((e: TransactionError) => {
            const _errorMessage = e.message || 'Unknown error';
            setErrorMessage(_errorMessage);
            onError && onError(_errorMessage);
            setTxStatus(TXStatus.Error);
          });

        // after calling the contract, go to status waiting
        setTxStatus(TXStatus.Waiting);
      }

      // if we are in a waiting state, then show the regular modal
      if (txStatus === TXStatus.Waiting) {
        setShowModal(true);
        setShowErrorModal(false);
      }

      // if we are in an error state, then show the error modal
      if (txStatus === TXStatus.Error) {
        setShowModal(false);
        setShowErrorModal(true);
      }

      // if we are finished, then close the modal
      if (txStatus === TXStatus.Finished) {
        // don't show any modals
        onFinish();
        setShowModal(false);
        setShowErrorModal(false);
      }
    } else {
      // if we are not showing the modal, reset the status to ready
      setTxStatus(TXStatus.Ready);
      setShowModal(false);
      setShowErrorModal(false);
    }
  }, [
    callContract,
    onConfirmed,
    onFinish,
    onError,
    show,
    showModal,
    setShowModal,
    showErrorModal,
    setShowErrorModal,
    txStatus,
    setTxStatus,
    setErrorMessage,
  ]);

  return (
    <>
      <Modal title={title} icon="ClockIcon" isOpen={showModal}>
        <p>
          Please accept this transaction in your wallet and wait for it to
          confirm on the blockchain.
        </p>
      </Modal>
      <Modal
        title="There was an error"
        icon="ExclamationIcon"
        isOpen={showErrorModal}
        onRequestClose={() => {
          setTxStatus(TXStatus.Finished);
        }}
      >
        <p>The following error occurred:</p>
        <p>{errorMessage}</p>
      </Modal>
    </>
  );
};
