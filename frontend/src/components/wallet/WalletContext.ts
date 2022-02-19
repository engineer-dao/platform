import { createContext } from 'react';
import { IWalletContext } from 'interfaces/IWalletContext';

export const WalletContext = createContext<IWalletContext | undefined>(
  undefined
);
