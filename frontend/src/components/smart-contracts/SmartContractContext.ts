import { buildSmartContractState } from 'components/smart-contracts/utils/smartContracts';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { IWalletState } from 'interfaces/IWalletState';
import { createContext } from 'react';

interface ISmartContractContext {
  contracts: ISmartContractState;
  updateENGIApproval: (isERC20Approved: boolean) => void;
  updateUSDCApproval: (isERC20Approved: boolean) => void;
}

const initialWalletState: IWalletState = {
  account: null,
  connected: false,
  provider: null,
  providerInfo: null,
  chainId: null,
};

const initialSmartContractsState = buildSmartContractState(initialWalletState);

const defaultSmartContractsContextValue: ISmartContractContext = {
  contracts: initialSmartContractsState,
  updateENGIApproval: () => {},
  updateUSDCApproval: () => {},
};

export const SmartContractContext = createContext<ISmartContractContext>(
  defaultSmartContractsContextValue
);
