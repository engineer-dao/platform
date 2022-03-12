import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import { ContractReceipt } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';

interface IProps extends ITransactionModalProps {
  jobId: string;
}

export const TimeoutJobModal = (props: IProps) => {
  const { jobId, show, onFinish, onConfirmed, onError } = props;

  const { contracts } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    return contracts.Job.completeTimedOutJob(jobId);
  };

  // what to do when the transaction is confirmed on the blockchain
  const jobTxConfirmed = (receipt: ContractReceipt) => {
    const events = receipt.events;

    // extract the JobCompleted event and return the new job id
    let jobId = '';
    for (const event of events || []) {
      if (event.event === 'JobTimeoutPayout' && event.args) {
        jobId = event.args.jobId.toString();
        break;
      }
    }

    onConfirmed && onConfirmed(jobId);
  };

  // render the transaction modal
  return (
    <TransactionModal
      title="Receive Payment"
      onConfirmed={jobTxConfirmed}
      {...{ show, callContract, onFinish, onError }}
    />
  );
};
