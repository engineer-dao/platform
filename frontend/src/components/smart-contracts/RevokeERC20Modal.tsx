import React from 'react';
import {
  useSmartContracts,
  SmartContractAddresses,
} from 'components/smart-contracts/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/TransactionModal';
import { ethers } from 'ethers';

export const RevokeERC20Modal = ({
  show,
  onFinish,
  onError,
}: {
  show: boolean;
  onFinish: () => void;
  onError?: (arg0: string) => void;
}) => {
  const { contracts, updateERC20Approval } = useSmartContracts();

  const callContract = async () => {
    return contracts.ERC20.approve(SmartContractAddresses.Job, 0);
  };

  const onConfirmed = (receipt: ethers.providers.TransactionReceipt) => {
    updateERC20Approval(false);
  };

  return (
    <TransactionModal
      title="Revoke Spending Allowance"
      {...{ show, callContract, onConfirmed, onFinish }}
    />
  );
};
