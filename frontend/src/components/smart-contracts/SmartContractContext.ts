import { ERC20__factory, Job__factory } from 'contracts-typechain';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { createContext } from 'react';
import { ethers } from 'ethers';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { IWalletState } from 'interfaces/IWalletState';

interface ISmartContractContext {
  contracts: ISmartContractState;
  updateERC20Approval: (isERC20Approved: boolean) => void;
}

export const buildSmartContractState = (
  wallet: IWalletState,
  isERC20Approved: boolean
) => {
  const walletProvider =
    wallet.provider !== null
      ? wallet.provider.getSigner()
      : new ethers.providers.BaseProvider('any');

  const contracts: ISmartContractState = {
    isERC20Approved: isERC20Approved,
    ERC20: ERC20__factory.connect(
      SmartContractAddresses.PaymentToken,
      walletProvider
    ),
    Job: Job__factory.connect(SmartContractAddresses.Job, walletProvider),
  };

  return contracts;
};

const initialWalletState: IWalletState = {
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
