import React, { useEffect, useMemo, useReducer } from 'react';
import { IMetaMaskError } from 'interfaces/IMetaMaskError';
import EventEmitter from 'events';
import { ethers } from 'ethers';
import Web3Modal, { getInjectedProvider, IProviderInfo } from 'web3modal';
import Fortmatic from 'fortmatic';
import { WalletContext, WalletState } from 'components/wallet/WalletContext';
import { walletReducer } from './WalletReducer';

const initialState: WalletState = {
  account: null,
  connected: false,
  provider: null,
  providerInfo: null,
};

const fortmaticNetworkOptions = {
  rpcUrl: 'https://rpc-mainnet.maticvigil.com',
  chainId: 137,
};

const providerOptions = {
  fortmatic: {
    package: Fortmatic,
    options: {
      key: process.env.REACT_APP_FORTMATIC_KEY || 'INVALID_KEY',
      network: fortmaticNetworkOptions,
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: false,
  providerOptions,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  let boundProviderConnection: EventEmitter | null = null;

  const [state, dispatch] = useReducer(walletReducer, initialState);

  useEffect(() => {
    initWallet();

    return () => {
      if (boundProviderConnection != null) {
        unbindConnectionEvents(boundProviderConnection);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initWallet = async () => {
    const providerInfo = getInjectedProvider();
    if (providerInfo && providerInfo.name === 'MetaMask') {
      // try to autoconnect metamask
      if (window.ethereum) {
        window.ethereum
          .request({ method: 'eth_accounts' })
          .then((result: Array<string>) => {
            if (result.length > 0) {
              // metamask is already connected
              const account = result[0];
              connectToInjectedMetamask(providerInfo, account);
            }
          })
          .catch((error: IMetaMaskError) => {
            // Some unexpected error.
            console.error(`Metamask returned error: ${error.message}`);
          });
      }
    }
  };

  const connectToInjectedMetamask = async (
    providerInfo: IProviderInfo,
    account: string
  ) => {
    const provider = await connectToWeb3Provider(providerInfo.id);

    setWalletConnection({
      connected: true,
      account,
      provider,
      providerInfo,
    });
  };

  const connectToWallet = async () => {
    const provider = await connectToWeb3Provider(null);
    const account = (await provider.listAccounts())[0];

    setWalletConnection({
      connected: true,
      account,
      provider,
      providerInfo: getInjectedProvider(),
    });
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();

    setWalletConnection(initialState);
  };

  const connectToWeb3Provider = async (providerId: string | null) => {
    const connection =
      providerId == null
        ? await web3Modal.connect()
        : await web3Modal.connectTo(providerId);
    bindConnectionEvents(connection);
    boundProviderConnection = connection;

    return new ethers.providers.Web3Provider(connection);
  };

  const bindConnectionEvents = (connection: EventEmitter) => {
    if (boundProviderConnection != null) {
      unbindConnectionEvents(boundProviderConnection);
    }
    connection.on('accountsChanged', onAccountsChanged);
    connection.on('connect', onConnected);
  };

  const onAccountsChanged = () => {
    // erase the connection and let the wallet reload
    setWalletConnection(initialState);
  };

  const onConnected = (info: { chainId: number }) => {
    console.log(info);
  };

  const unbindConnectionEvents = (connection: EventEmitter) => {
    connection.removeListener('accountsChanged', onAccountsChanged);
    connection.removeListener('connect', onConnected);
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
      setWalletConnection,
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
