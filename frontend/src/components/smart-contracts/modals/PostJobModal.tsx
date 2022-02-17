import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { ContractReceipt, ethers } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';
import { ICreateContractForm } from '../../create-contract/ICreateContractForm';

interface IProps extends ITransactionModalProps {
  formData: ICreateContractForm;
}

export const PostJobModal = (props: IProps) => {
  const { formData, show, onFinish, onConfirmed, onError } = props;

  const { contracts } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    const { bounty, ...formDataToSerialize } = formData;
    const bountyWei = ethers.utils.parseUnits(formData.bounty.toString());
    const jobMetaData = JSON.stringify(formDataToSerialize);

    const depositPct = 1000; // TODO - hook this up to the form value

    return contracts.Job.postJob(
      SmartContractAddresses.PaymentToken,
      bountyWei,
      depositPct,
      jobMetaData
    );
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

    onConfirmed && onConfirmed(jobId);
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
