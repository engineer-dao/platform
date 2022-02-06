import React from 'react';
import {
  useSmartContracts,
  SmartContractAddresses,
} from 'components/smart-contracts/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/TransactionModal';
import { constants, ContractReceipt } from 'ethers';

export const ApproveERC20Modal = ({
  show,
  onFinish,
  onError,
}: {
  show: boolean;
  onFinish: () => void;
  onError?: (arg0: string) => void;
}) => {
  const { contracts, updateERC20Approval } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    return contracts.ERC20.approve(
      SmartContractAddresses.Job,
      constants.MaxUint256
    );
  };

  // what to do when the transaction is confirmed on the blockchain
  const onConfirmed = (receipt: ContractReceipt) => {
    updateERC20Approval(true);
  };

  // render the transaction modal
  return (
    <TransactionModal
      title="Approving Spending Allowance"
      {...{ show, callContract, onConfirmed, onFinish, onError }}
    />
  );
};
