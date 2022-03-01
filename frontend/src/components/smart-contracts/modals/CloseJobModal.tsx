import { JobClosedEvent } from 'contracts-typechain/Job';
import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import { ContractReceipt } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';

interface IProps extends ITransactionModalProps {
  jobId: string;
}

export const CloseJobModal = (props: IProps) => {
  const { jobId, show, onFinish, onConfirmed, onError } = props;

  const { contracts } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    return contracts.Job.closeJob(jobId);
  };

  // what to do when the transaction is confirmed on the blockchain
  const jobTxConfirmed = (receipt: ContractReceipt) => {
    const events = receipt.events;

    // extract the JobClosed event and return the new job id
    const event = events?.filter((event) => {
      return (
        event.event === 'JobClosedBySupplier' ||
        event.event === 'JobClosedByEngineer'
      );
    })[0] as JobClosedEvent | undefined;
    const jobId = event ? event.args.jobId.toString() : '';

    onConfirmed && onConfirmed(jobId);
  };

  // render the transaction modal
  return (
    <TransactionModal
      title="Close Job"
      onConfirmed={jobTxConfirmed}
      {...{ show, callContract, onFinish, onError }}
    />
  );
};
