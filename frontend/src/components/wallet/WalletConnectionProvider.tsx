import React, { useState, useEffect } from 'react';
import { WalletContext, DefaultWalletConnection } from 'contexts/WalletContext';
import { IMetaMaskError } from 'interfaces/IMetaMaskError';
import EventEmitter from 'events';
import { ethers } from 'ethers';
import Web3Modal, { getInjectedProvider, IProviderInfo } from 'web3modal';
import Fortmatic from 'fortmatic';

export const WalletConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [walletConnection, setWalletConnection] = useState(
    DefaultWalletConnection
  );

  let boundProviderConnection: EventEmitter | null = null;

  useEffect(() => {
    initWallet();

    return () => {
      if (boundProviderConnection != null) {
        unbindConnectionEvents(boundProviderConnection);
      }
    };
  });

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
    const web3Provider = await connectToWeb3Provider(providerInfo.id);
    accountChangedHandler(account, web3Provider);
  };

  const connectToWallet = async () => {
    const web3Provider = await connectToWeb3Provider(null);
    const accounts = await web3Provider.listAccounts();
    accountChangedHandler(accounts[0], web3Provider);
  };

  const connectToWeb3Provider = async (providerId: string | null) => {
    const connection =
      providerId == null
        ? await web3Modal.connect()
        : await web3Modal.connectTo(providerId);
    bindConnectionEvents(connection);
    boundProviderConnection = connection;
    const web3Provider = new ethers.providers.Web3Provider(connection);
    return web3Provider;
  };

  const accountChangedHandler = (
    newAccount: string | null,
    newProvider: ethers.providers.Web3Provider | null
  ) => {
    if (newAccount !== walletConnection.account) {
      if (newAccount !== null && newAccount.length > 0) {
        setWalletConnection({
          connected: true,
          account: newAccount,
          provider: newProvider,
          providerInfo: getInjectedProvider(),
        });
      } else {
        setWalletConnection({
          connected: false,
          account: null,
          provider: null,
          providerInfo: null,
        });
      }
    }
  };

  const bindConnectionEvents = (connection: EventEmitter) => {
    if (boundProviderConnection != null) {
      unbindConnectionEvents(boundProviderConnection);
    }
    connection.on('accountsChanged', onAccountsChanged);
    connection.on('connect', onConnected);
  };

  const onAccountsChanged = (accounts: string[]) => {
    // erase the connection and let the wallet reload
    accountChangedHandler(null, null);
  };

  const onConnected = (info: { chainId: number }) => {
    console.log(info);
  };

  const unbindConnectionEvents = (connection: EventEmitter) => {
    connection.removeListener('accountsChanged', onAccountsChanged);
    connection.removeListener('connect', onConnected);
  };

  const defaultWalletConnectionValue = {
    walletConnection,
    setWalletConnection,
    connectToWallet: connectToWallet,
  };

  return (
    <WalletContext.Provider value={defaultWalletConnectionValue}>
      {children}
    </WalletContext.Provider>
  );
};
