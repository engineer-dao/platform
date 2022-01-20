import React from 'react';
import { DefaultWalletConnectionContext } from 'lib/wallet/WalletConnection';

export const WalletContext = React.createContext(
  DefaultWalletConnectionContext
);

/*
// Usage: Do this to get the current account in any component

import { useContext } from 'react';
const { walletConnection } = useContext(WalletContext);
console.log(walletConnection.account); // string like 0x1c7c0aa3255af235c6e80621533ce74e4fbbdb3d
*/
