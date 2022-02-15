import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { ContractReceipt, ethers } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';

interface IProps extends ITransactionModalProps {
  jobId: string;
  deposit: number;
}

export const StartJobModal = (props: IProps) => {
  const { jobId, deposit, show, onFinish, onConfirmed, onError } = props;

  const { contracts } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    const depositWei = ethers.utils.parseUnits(String(deposit));

    return contracts.Job.startJob(jobId, depositWei);
  };

  // what to do when the transaction is confirmed on the blockchain
  const jobTxConfirmed = (receipt: ContractReceipt) => {
    const events = receipt.events;

    // extract the JobStarted event and return the new job id
    let jobId = '';
    for (const event of events || []) {
      if (event.event === 'JobStarted' && event.args) {
        jobId = event.args.jobId.toString();
        break;
      }
    }

    onConfirmed && onConfirmed(jobId);
  };

  // render the transaction modal
  return (
    <TransactionModal
      title="Accept Job"
      onConfirmed={jobTxConfirmed}
      {...{ show, callContract, onFinish, onError }}
    />
  );
};
