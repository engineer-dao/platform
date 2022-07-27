import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import {
  ERC20__factory,
  Job__factory,
  TestENGI__factory,
  TestUSDC__factory,
} from 'contracts-typechain';
import { ethers } from 'ethers';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { IWalletState } from 'interfaces/IWalletState';

// builds a smart contracts state based on the wallet state
export const buildSmartContractState = (wallet: IWalletState) => {
  // build a default provider when the wallet is not connected
  const defaultSmartContractProvider = process.env.REACT_APP_CHAIN_WS_PROVIDER
    ? new ethers.providers.WebSocketProvider(
        process.env.REACT_APP_CHAIN_WS_PROVIDER,
        ethers.BigNumber.from(
          process.env.REACT_APP_SUPPORTED_CHAIN_ID
        ).toNumber()
      )
    : new ethers.providers.BaseProvider('any');

  let smartContractProvider, chainIsSupported, walletIsConnected;

  smartContractProvider = defaultSmartContractProvider;
  chainIsSupported = true;
  walletIsConnected = false;

  const contracts: ISmartContractState = {
    chainIsSupported,
    walletIsConnected,
    isENGIApproved: false,
    isUSDCApproved: false,
    latestContractEvent: '',
    ENGIToken: ERC20__factory.connect(
      SmartContractAddresses.ENGIToken,
      smartContractProvider
    ),
    USDCToken: ERC20__factory.connect(
      SmartContractAddresses.USDCToken,
      smartContractProvider
    ),
    TestENGI: TestENGI__factory.connect(
      SmartContractAddresses.ENGIToken,
      smartContractProvider
    ),
    TestUSDC: TestUSDC__factory.connect(
      SmartContractAddresses.USDCToken,
      smartContractProvider
    ),
    Job: Job__factory.connect(
      SmartContractAddresses.Job,
      smartContractProvider
    ),
  };

  return contracts;
};
