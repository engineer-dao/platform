import { ethers } from 'ethers';
import { createContext } from 'react';

import { IProviderInfo } from 'web3modal';

export interface WalletState {
  connected: boolean;
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  providerInfo: IProviderInfo | null;
}

export interface IWalletContext extends WalletState {
  setWalletConnection: (arg0: WalletState) => void;
  disconnectWallet: () => void;
  connectToWallet: () => void;
}

export const WalletContext = createContext<IWalletContext | undefined>(
  undefined
);
