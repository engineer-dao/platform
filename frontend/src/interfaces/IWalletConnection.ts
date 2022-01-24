import { ethers } from 'ethers';

import Web3Modal, { IProviderInfo } from 'web3modal';

export interface IWalletConnection {
  connected: boolean;
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  providerInfo: IProviderInfo | null;
}

export interface IWalletConnectionContext {
  walletConnection: IWalletConnection;
  setWalletConnection: (arg0: IWalletConnection) => {};
  connectToWallet: () => {};
}
