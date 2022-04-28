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
import { isTestingEnvironment } from 'utils/testing';

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
    latestContractEvent: '',
    ERC20: ERC20__factory.connect(
      SmartContractAddresses.ENGITokenAddress,
      smartContractProvider
    ),
    TestENGI: isTestingEnvironment()
      ? TestENGI__factory.connect(
          SmartContractAddresses.ENGITokenAddress,
          smartContractProvider
        )
      : undefined,
    TestUSDC: isTestingEnvironment()
      ? TestUSDC__factory.connect(
          SmartContractAddresses.USDCTokenAddress,
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
