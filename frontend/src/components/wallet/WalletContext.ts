import { createContext } from 'react';
import { IWalletState } from 'interfaces/IWalletState';

interface IWalletContext extends IWalletState {
  setWalletConnection: (arg0: IWalletState) => void;
  disconnectWallet: () => void;
  connectToWallet: () => void;
}

export const WalletContext = createContext<IWalletContext | undefined>(
  undefined
);
