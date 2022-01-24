import { WalletContext } from 'components/wallet/WalletContext';
import { useContext } from 'react';

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('No Contract Context Found');
  }

  return context;
};
