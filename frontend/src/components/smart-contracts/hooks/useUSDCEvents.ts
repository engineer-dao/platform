import { Listener } from '@ethersproject/providers';
import { useBlockchainEventFilter } from 'components/smart-contracts/hooks/useBlockchainEvents';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { ERC20 } from 'contracts-typechain';
import { BigNumber, ethers } from 'ethers';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { IWalletState } from 'interfaces/IWalletState';
import { useMemo, useState } from 'react';

export const useUSDCApproval = (
  wallet: IWalletState,
  contracts: ISmartContractState
) => {
  const [isUSDCApproved, setIsUSDCApproved] = useState(false);
  const [queryComplete, setApprovalQueryComplete] = useState(false);

  // update ERC20 token status when the blockchain changes
  useUSDCApprovalEventsFilter(wallet, contracts, (isApproved) => {
    setIsUSDCApproved(isApproved);
  });

  const lookupUSDCApprovalOnce = async () => {
    const approved = await lookupUSDCApproval(
      wallet.account || '',
      contracts.USDCToken
    );
    if (approved !== isUSDCApproved) {
      setIsUSDCApproved(approved);
    }
    setApprovalQueryComplete(true);
  };

  useMemo(() => {
    if (contracts.chainIsSupported && wallet.account) {
      lookupUSDCApprovalOnce();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.account, contracts.chainIsSupported, contracts.USDCToken]);

  return { isUSDCApproved, setIsUSDCApproved, queryComplete };
};

const lookupUSDCApproval = async (account: string, erc20Contract: ERC20) => {
  if (!account) {
    return false;
  }

  const transactionResult = await erc20Contract.allowance(
    account,
    SmartContractAddresses.Job
  );

  return transactionResult.gt(0);
};

const useUSDCApprovalEventsFilter = (
  wallet: IWalletState,
  contracts: ISmartContractState,
  onApprovalChange: (arg0: boolean) => void
) => {
  // update ERC20 token status when the blockchain changes
  const onApprovalEventHandler: Listener = (owner, spender, approvalAmount) => {
    onApprovalChange(BigNumber.from(approvalAmount).gt(0));
  };

  // listen for events
  const filter = contracts.USDCToken?.filters.Approval(
    wallet.account || ethers.constants.AddressZero,
    SmartContractAddresses.Job
  );
  useBlockchainEventFilter(contracts.USDCToken, filter, onApprovalEventHandler);
};
