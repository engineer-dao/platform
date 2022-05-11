import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import {
  SmartContractAddresses,
  useSmartContracts,
} from 'components/smart-contracts/hooks/useSmartContracts';
import { ContractReceipt } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';

export const RevokeUSDCModal = (props: ITransactionModalProps) => {
  const { show, onFinish, onError } = props;

  const { contracts, updateUSDCApproval } = useSmartContracts();

  const callContract = async () => {
    return contracts.USDCToken.approve(SmartContractAddresses.Job, 0);
  };

  const onConfirmed = (receipt: ContractReceipt) => {
    updateUSDCApproval(false);
  };

  return (
    <TransactionModal
      title="Revoke Spending Allowance"
      {...{ show, callContract, onConfirmed, onFinish, onError }}
    />
  );
};
