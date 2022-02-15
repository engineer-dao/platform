import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import {
  SmartContractAddresses,
  useSmartContracts,
} from 'components/smart-contracts/hooks/useSmartContracts';
import { constants, ContractReceipt } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React from 'react';

export const ApproveERC20Modal = (props: ITransactionModalProps) => {
  const { show, onFinish, onError } = props;

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
