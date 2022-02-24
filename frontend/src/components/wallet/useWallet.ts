import { WalletContext } from 'components/wallet/WalletContext';
import { useContext } from 'react';
import { IWalletContext } from 'interfaces/IWalletContext';

// returns the wallet context
export const useWallet = (): IWalletContext => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('No Contract Context Found');
  }
  return context;
};
