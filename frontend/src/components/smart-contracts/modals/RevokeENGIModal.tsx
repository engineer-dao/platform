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

  const { contracts, updateERC20Approval } = useSmartContracts();

  const callContract = async () => {
    return contracts?.TestENGI?.approve(SmartContractAddresses.Job, 0);
  };

  const onConfirmed = (receipt: ContractReceipt) => {
    updateERC20Approval(false);
  };

  return (
    <TransactionModal
      title="Revoke Spending Allowance"
      {...{ show, callContract, onConfirmed, onFinish, onError }}
    />
  );
};
