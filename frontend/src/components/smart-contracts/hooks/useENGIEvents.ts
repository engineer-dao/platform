import { Listener } from '@ethersproject/providers';
import { useBlockchainEventFilter } from 'components/smart-contracts/hooks/useBlockchainEvents';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { ERC20 } from 'contracts-typechain';
import { BigNumber, ethers } from 'ethers';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { IWalletState } from 'interfaces/IWalletState';
import { useMemo, useState } from 'react';
import { SupportedTokens } from '../../../enums/SupportedTokens';

export const useERC20Approval = (
  wallet: IWalletState,
  contracts: ISmartContractState,
  token: SupportedTokens
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
      token === SupportedTokens.ENGI ? contracts.ENGIToken : contracts.USDCToken
    );
    if (approved !== isERC20Approved) {
      setIsERC20Approved(approved);
    }
    setApprovalQueryComplete(true);
  };

  useMemo(() => {
    if (contracts.chainIsSupported && wallet.account) {
      lookupERC20ApprovalOnce();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.account, contracts.chainIsSupported, contracts.ENGIToken]);

  return { isERC20Approved, setIsERC20Approved, queryComplete };
};

const lookupERC20Approval = async (account: string, erc20Contract: ERC20) => {
  if (!account) {
    return false;
  }

  const transactionResult = await erc20Contract.allowance(
    account,
    SmartContractAddresses.Job
  );

  return transactionResult.gt(0);
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
  const filter = contracts.ENGIToken?.filters.Approval(
    wallet.account || ethers.constants.AddressZero,
    SmartContractAddresses.Job
  );
  useBlockchainEventFilter(contracts.ENGIToken, filter, onApprovalEventHandler);
};
