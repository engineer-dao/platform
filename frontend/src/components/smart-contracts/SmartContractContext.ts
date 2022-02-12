import { ERC20__factory, ERC20, Job__factory, Job } from 'contracts-typechain';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { createContext } from 'react';
import { WalletState } from 'components/wallet/WalletContext';
import { ethers } from 'ethers';

export type ISmartContractContext = {
  contracts: SmartContractState;
  updateERC20Approval: (isERC20Approved: boolean) => void;
};

export interface SmartContractState {
  isERC20Approved: boolean;
  Job: Job;
  ERC20: ERC20;
}

export const buildSmartContractState = (
  wallet: WalletState,
  isERC20Approved: boolean
) => {
  const walletProvider =
    wallet.provider !== null
      ? wallet.provider.getSigner()
      : new ethers.providers.BaseProvider('any');

  const contracts: SmartContractState = {
    isERC20Approved: isERC20Approved,
    ERC20: ERC20__factory.connect(
      SmartContractAddresses.PaymentToken,
      walletProvider
    ),
    Job: Job__factory.connect(SmartContractAddresses.Job, walletProvider),
  };

  return contracts;
};

const initialWalletState: WalletState = {
  account: null,
  connected: false,
  provider: null,
  providerInfo: null,
};

const initialSmartContractsState = buildSmartContractState(
  initialWalletState,
  false
);

const defaultSmartContractsContextValue: ISmartContractContext = {
  contracts: initialSmartContractsState,
  updateERC20Approval: () => {},
};

export const SmartContractContext = createContext<ISmartContractContext>(
  defaultSmartContractsContextValue
);
