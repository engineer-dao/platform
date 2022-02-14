import { useBlockchainEventFilter } from 'components/wallet/useWallet';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { BigNumber } from 'ethers';
import { Listener } from '@ethersproject/providers';
import { IWalletState } from 'interfaces/IWalletState';
import { ISmartContractState } from 'interfaces/ISmartContractState';

export const useERC20ApprovalEventsFilter = (
  wallet: IWalletState,
  contracts: ISmartContractState,
  onApprovalChange: (arg0: boolean) => void
) => {
  // update ERC20 token status when the blockchain changes
  const onApprovalEventHandler: Listener = (owner, spender, approvalAmount) => {
    onApprovalChange(BigNumber.from(approvalAmount).gt(0));
  };

  // listen for events
  useBlockchainEventFilter(
    contracts,
    contracts.ERC20,
    () => {
      if (wallet.account) {
        return contracts.ERC20.filters.Approval(
          wallet.account,
          SmartContractAddresses.Job
        );
      }
    },
    onApprovalEventHandler
  );
};

export const useERC20Approval = (
  wallet: IWalletState,
  contracts: ISmartContractState,
  onApprovalFound: (arg0: boolean) => void
) => {
  // query the blockchain contract to see if we have approval
  const callAllowance = async (account: string) => {
    if (account.length) {
      const transactionResult = await contracts.ERC20.allowance(
        account,
        SmartContractAddresses.Job
      );
      onApprovalFound(transactionResult.gt(0));
    }
  };

  if (wallet.account) {
    callAllowance(wallet.account);
  }
};
