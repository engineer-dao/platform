import {
  ERC20__factory,
  TestERC20__factory,
  Job__factory,
} from 'contracts-typechain';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { createContext } from 'react';
import { ethers } from 'ethers';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { IWalletState } from 'interfaces/IWalletState';
import { isTestingEnvironment } from 'utils/testing';

interface ISmartContractContext {
  contracts: ISmartContractState;
  updateERC20Approval: (isERC20Approved: boolean) => void;
}

export const buildSmartContractState = (wallet: IWalletState) => {
  // build a default provider when the wallet is not connected
  const defaultSmartContractProvider = process.env
    .REACT_APP_ETHERS_PROVIDER_CHAIN_RPC_HOST
    ? new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_ETHERS_PROVIDER_CHAIN_RPC_HOST,
        ethers.BigNumber.from(
          process.env.REACT_APP_SUPPORTED_CHAIN_ID
        ).toNumber()
      )
    : new ethers.providers.BaseProvider('any');

  let smartContractProvider, chainIsSupported, walletIsConnected;
  if (wallet.provider !== null) {
    // when using a wallet, require the wallet's chain matches the application chain (e.g. Polygon)
    chainIsSupported = !!(
      wallet.chainId &&
      wallet.chainId === process.env.REACT_APP_SUPPORTED_CHAIN_ID
    );
    smartContractProvider = wallet.provider.getSigner();
    walletIsConnected = chainIsSupported;
  } else {
    // no wallet - use the RPC host
    smartContractProvider = defaultSmartContractProvider;
    chainIsSupported = true;
    walletIsConnected = false;
  }

  const contracts: ISmartContractState = {
    chainIsSupported,
    walletIsConnected,
    isERC20Approved: false,
    ERC20: ERC20__factory.connect(
      SmartContractAddresses.PaymentToken,
      smartContractProvider
    ),
    TestERC20: isTestingEnvironment()
      ? TestERC20__factory.connect(
          SmartContractAddresses.PaymentToken,
          smartContractProvider
        )
      : undefined,
    Job: Job__factory.connect(
      SmartContractAddresses.Job,
      smartContractProvider
    ),
  };

  return contracts;
};

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
  updateERC20Approval: () => {},
};

export const SmartContractContext = createContext<ISmartContractContext>(
  defaultSmartContractsContextValue
);
