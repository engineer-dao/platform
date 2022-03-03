import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import { ContractReceipt } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';

interface IProps extends ITransactionModalProps {
  jobId: string;
}

export const DisputeJobModal = (props: IProps) => {
  const { jobId, show, onFinish, onConfirmed, onError } = props;

  const { contracts } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    return contracts.Job.disputeJob(jobId);
  };

  // what to do when the transaction is confirmed on the blockchain
  const jobTxConfirmed = (receipt: ContractReceipt) => {
    const events = receipt.events;

    // extract the JobDisputed event and return the new job id
    const event = events?.filter((event) => {
      return event.event === 'JobDisputed';
    })[0];
    const jobId = event?.args?.jobId.toString() || '';

    onConfirmed && onConfirmed(jobId);
  };

  // render the transaction modal
  return (
    <TransactionModal
      title="Dispute Job"
      onConfirmed={jobTxConfirmed}
      {...{ show, callContract, onFinish, onError }}
    />
  );
};
