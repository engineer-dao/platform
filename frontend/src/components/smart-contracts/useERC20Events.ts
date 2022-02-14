import { ERC20 } from 'contracts-typechain';
import { useState, useMemo } from 'react';
import { useBlockchainEventFilter } from 'components/smart-contracts/useBlockchainEvents';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { BigNumber } from 'ethers';
import { Listener } from '@ethersproject/providers';
import { IWalletState } from 'interfaces/IWalletState';
import { ISmartContractState } from 'interfaces/ISmartContractState';

export const useERC20Approval = (
  wallet: IWalletState,
  contracts: ISmartContractState
) => {
  const [isERC20Approved, setIsERC20Approved] = useState(false);
  const [queryComplete, setApprovalQueryComplete] = useState(false);

  // update ERC20 token status when the blockchain changes
  useERC20ApprovalEventsFilter(wallet, contracts, (isApproved) => {
    setIsERC20Approved(isApproved);
  });

  const lookupERC20ApprovalOnce = async () => {
    const approved = await lookupERC20Approval(
      wallet.account || '',
      contracts.ERC20
    );
    if (approved !== isERC20Approved) {
      setIsERC20Approved(approved);
    }
    setApprovalQueryComplete(true);
  };

  useMemo(() => {
    lookupERC20ApprovalOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.account, contracts.ERC20]);

  return { isERC20Approved, setIsERC20Approved, queryComplete };
};

export const lookupERC20Approval = async (
  account: string,
  erc20Contract: ERC20
) => {
  // query the blockchain contract to see if we have approval
  if (account.length) {
    const transactionResult = await erc20Contract.allowance(
      account,
      SmartContractAddresses.Job
    );
    return transactionResult.gt(0);
  }

  return false;
};

const useERC20ApprovalEventsFilter = (
  wallet: IWalletState,
  contracts: ISmartContractState,
  onApprovalChange: (arg0: boolean) => void
) => {
  // update ERC20 token status when the blockchain changes
  const onApprovalEventHandler: Listener = (owner, spender, approvalAmount) => {
    onApprovalChange(BigNumber.from(approvalAmount).gt(0));
  };

  // listen for events
  const filter = contracts.ERC20.filters.Approval(
    wallet.account,
    SmartContractAddresses.Job
  );
  useBlockchainEventFilter(contracts.ERC20, filter, onApprovalEventHandler);
};
