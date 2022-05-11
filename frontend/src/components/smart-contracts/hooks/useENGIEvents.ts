import { Listener } from '@ethersproject/providers';
import { useBlockchainEventFilter } from 'components/smart-contracts/hooks/useBlockchainEvents';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { ERC20 } from 'contracts-typechain';
import { BigNumber, ethers } from 'ethers';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { IWalletState } from 'interfaces/IWalletState';
import { useMemo, useState } from 'react';

export const useENGIApproval = (
  wallet: IWalletState,
  contracts: ISmartContractState
) => {
  const [isENGIApproved, setIsENGIApproved] = useState(false);
  const [queryComplete, setApprovalQueryComplete] = useState(false);

  // update ERC20 token status when the blockchain changes
  useENGIApprovalEventsFilter(wallet, contracts, (isApproved) => {
    setIsENGIApproved(isApproved);
  });

  const lookupENGIApprovalOnce = async () => {
    const approved = await lookupENGIApproval(
      wallet.account || '',
      contracts.ENGIToken
    );
    if (approved !== isENGIApproved) {
      setIsENGIApproved(approved);
    }
    setApprovalQueryComplete(true);
  };

  useMemo(() => {
    if (contracts.chainIsSupported && wallet.account) {
      lookupENGIApprovalOnce();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.account, contracts.chainIsSupported, contracts.ENGIToken]);

  return { isENGIApproved, setIsENGIApproved, queryComplete };
};

const lookupENGIApproval = async (account: string, erc20Contract: ERC20) => {
  if (!account) {
    return false;
  }

  const transactionResult = await erc20Contract.allowance(
    account,
    SmartContractAddresses.Job
  );

  return transactionResult.gt(0);
};

const useENGIApprovalEventsFilter = (
  wallet: IWalletState,
  contracts: ISmartContractState,
  onApprovalChange: (arg0: boolean) => void
) => {
  // update ERC20 token status when the blockchain changes
  const onApprovalEventHandler: Listener = (owner, spender, approvalAmount) => {
    onApprovalChange(BigNumber.from(approvalAmount).gt(0));
  };

  // listen for events
  const filter = contracts.ENGIToken?.filters.Approval(
    wallet.account || ethers.constants.AddressZero,
    SmartContractAddresses.Job
  );
  useBlockchainEventFilter(contracts.ENGIToken, filter, onApprovalEventHandler);
};
