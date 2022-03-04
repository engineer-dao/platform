import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import { BigNumber, ContractReceipt } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';

interface IProps extends ITransactionModalProps {
  jobId: string;
  engineerAmountPct: number;
}

const BASE_PERCENTAGE = 100; // percentage is between 100 and 10000

export const ResolveSplitModal = (props: IProps) => {
  const { jobId, engineerAmountPct, show, onFinish, onConfirmed, onError } =
    props;

  const { contracts } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    return contracts.Job.resolveDisputeWithCustomSplit(
      jobId,
      BigNumber.from(engineerAmountPct).mul(BASE_PERCENTAGE)
    );
  };

  // what to do when the transaction is confirmed on the blockchain
  const jobTxConfirmed = (receipt: ContractReceipt) => {
    const events = receipt.events;

    // extract the JobDisputeResolved event and return the new job id
    const event = events?.filter((event) => {
      return event.event === 'JobDisputeResolved';
    })[0];
    const jobId = event?.args?.jobId.toString() || '';

    onConfirmed && onConfirmed(jobId);
  };

  // render the transaction modal
  return (
    <TransactionModal
      title="Resolve Dispute with Split"
      onConfirmed={jobTxConfirmed}
      {...{ show, callContract, onFinish, onError }}
    />
  );
};
