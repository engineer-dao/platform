import React from 'react';

import { IWalletConnection } from 'interfaces/IWalletConnection';

export const DefaultWalletConnection: IWalletConnection = {
  connected: false,
  account: null,
  provider: null,
  providerInfo: null,
};

const defaultWalletConnectionContext = {
  walletConnection: DefaultWalletConnection,
  setWalletConnection: (arg0: IWalletConnection) => {},
  connectToWallet: () => {},
};

export const WalletContext = React.createContext(
  defaultWalletConnectionContext
);

/*
// Usage: Do this to get the current account in any component

import { useContext } from 'react';
const { walletConnection } = useContext(WalletContext);
console.log(walletConnection.account); // string like 0x1c7c0aa3255af235c6e80621533ce74e4fbbdb3d
console.log(walletConnection.provider); //  ethers.providers.Web3Provider | null
*/
