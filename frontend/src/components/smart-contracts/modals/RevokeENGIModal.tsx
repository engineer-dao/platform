import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import {
  SmartContractAddresses,
  useSmartContracts,
} from 'components/smart-contracts/hooks/useSmartContracts';
import { ContractReceipt } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';

export const RevokeENGIModal = (props: ITransactionModalProps) => {
  const { show, onFinish, onError } = props;

  const { contracts, updateENGIApproval } = useSmartContracts();

  const callContract = async () => {
    return contracts?.ENGIToken?.approve(SmartContractAddresses.Job, 0);
  };

  const onConfirmed = (receipt: ContractReceipt) => {
    updateENGIApproval(false);
  };

  return (
    <TransactionModal
      title="Revoke Spending Allowance"
      {...{ show, callContract, onConfirmed, onFinish, onError }}
    />
  );
};
