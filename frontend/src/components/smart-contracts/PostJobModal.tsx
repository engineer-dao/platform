import React from 'react';
import { useSmartContracts } from 'components/smart-contracts/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/TransactionModal';
import { ethers, ContractReceipt } from 'ethers';
import { CreateFormValues } from 'components/forms/types';

export const PostJobModal = ({
  formData,
  show,
  onFinish,
  onConfirmed,
  onError,
}: {
  formData: CreateFormValues;
  show: boolean;
  onFinish?: () => void;
  onConfirmed: (arg0: string) => void;
  onError?: (arg0: string) => void;
}) => {
  const { contracts } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    const { bounty, ...formDataToSerialize } = formData;
    const bountyWei = ethers.utils.parseUnits(formData.bounty.toString());
    const jobMetaData = JSON.stringify(formDataToSerialize);
    return contracts.Job.postJob(bountyWei, jobMetaData);
  };

  // what to do when the transaction is confirmed on the blockchain
  const jobTxConfirmed = (receipt: ContractReceipt) => {
    const events = receipt.events;

    // extract the JobPosted event and return the new job id
    let jobId = '';
    for (const event of events || []) {
      if (event.event === 'JobPosted' && event.args) {
        jobId = event.args.jobId.toString();
        break;
      }
    }

    onConfirmed(jobId);
  };

  // render the transaction modal
  return (
    <TransactionModal
      title="Post a New Job"
      onConfirmed={jobTxConfirmed}
      {...{ show, callContract, onFinish, onError }}
    />
  );
};
