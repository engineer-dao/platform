import React from 'react';
import { useSmartContracts } from 'components/smart-contracts/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/TransactionModal';
import { ethers, ContractReceipt } from 'ethers';

export const StartJobModal = ({
  jobId,
  deposit,
  show,
  onFinish,
  onConfirmed,
  onError,
}: {
  jobId: string;
  deposit: number;
  show: boolean;
  onFinish?: () => void;
  onConfirmed: (arg0: string) => void;
  onError?: (arg0: string) => void;
}) => {
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

    onConfirmed(jobId);
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
