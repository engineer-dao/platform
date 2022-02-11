import React, { useEffect, useMemo, useReducer } from 'react';
import { WalletContext, WalletState } from 'components/wallet/WalletContext';
import { walletReducer } from './WalletReducer';
import { MetaMaskLogoURI } from './WalletProviderData';
import { useMoralis } from 'react-moralis';
import { IMetaMaskError } from 'interfaces/IMetaMaskError';

const initialState: WalletState = {
  account: null,
  connected: false,
  provider: null,
  providerInfo: null,
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { web3, enableWeb3, isWeb3Enabled, account, logout } = useMoralis();

  const [state, dispatch] = useReducer(walletReducer, initialState);

  useEffect(() => {
    if (isWeb3Enabled && account) {
      setWalletConnection({
        connected: true,
        account,
        provider: web3,
        providerInfo: {
          id: 'metamask',
          logo: MetaMaskLogoURI,
          type: 'web3',
          check: '',
          name: 'metamask',
        },
      });
    } else {
      setWalletConnection(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3, isWeb3Enabled, account]);

  // try to log in to ethereum on load
  useEffect(() => {
    // try to autoconnect metamask
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((result: Array<string>) => {
          if (result.length > 0) {
            // metamask is already connected - automatically enable web3
            enableWeb3();
          }
        })
        .catch((error: IMetaMaskError) => {
          // Some unexpected error.
          console.error(`Metamask returned error: ${error.message}`);
        });
    }
  }, [window.ethereum]);

  const connectToWallet = () => {
    enableWeb3({ provider: undefined });
  };

  const disconnectWallet = () => {
    logout();
  };

  const setWalletConnection = (payload: WalletState) => {
    dispatch({
      type: 'set_wallet_connection',
      payload,
    });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      connectToWallet,
      disconnectWallet,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
