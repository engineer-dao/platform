import { ethers } from 'ethers';
import EventEmitter from 'events';
import Fortmatic from 'fortmatic';
import {
  IWalletState,
  WalletStateActionPayload,
} from 'interfaces/IWalletState';
import { useEffect, useMemo, useReducer, useState } from 'react';
import Web3Modal, { getInjectedProvider, IProviderInfo } from 'web3modal';
import { walletReducer } from './WalletReducer';

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

const initialState: IWalletState = {
  account: null,
  connected: false,
  provider: null,
  providerInfo: null,
  chainId: null,
  chainIsSupported: false,
};

const resetWalletAction: WalletStateActionPayload = {
  account: null,
  connected: false,
  provider: null,
  providerInfo: null,
  chainId: null,
};

export const useWalletProvider = () => {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  const [providerConnection, setProviderConnection] = useState<
    EventEmitter | undefined
  >(undefined);

  useEffect(() => {
    initWallet();

    if (providerConnection) {
      bindConnectionEvents(providerConnection);
    }

    return () => {
      if (providerConnection) {
        unbindConnectionEvents(providerConnection);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerConnection]);

  const initWallet = async () => {
    const providerInfo = getInjectedProvider();
    // console.log('providerInfo', providerInfo);
    if (providerInfo && providerInfo.name === 'MetaMask') {
      // try to autoconnect metamask
      if (window.ethereum) {
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        const result = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (result.length > 0) {
          // metamask is already connected
          const account = result[0];
          connectToInjectedMetamask(providerInfo, account, chainId);
        }
      }
    }
  };

  const connectToInjectedMetamask = async (
    providerInfo: IProviderInfo,
    account: string,
    chainId: string
  ) => {
    const provider = await connectToWeb3Provider(providerInfo.id);

    setWalletConnection({
      connected: true,
      account,
      provider,
      providerInfo,
      chainId,
    });
  };

  const connectToWallet = async () => {
    const provider = await connectToWeb3Provider(null);
    const account = (await provider.listAccounts())[0];

    let chainId = null;
    if (window.ethereum) {
      chainId = await window.ethereum.request({ method: 'eth_chainId' });
    }

    setWalletConnection({
      connected: true,
      account,
      provider,
      providerInfo: getInjectedProvider(),
      chainId,
    });
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();

    setWalletConnection(resetWalletAction);
  };

  const connectToWeb3Provider = async (providerId: string | null) => {
    const connection =
      providerId == null
        ? await web3Modal.connect()
        : await web3Modal.connectTo(providerId);
    setProviderConnection(connection);

    return new ethers.providers.Web3Provider(connection);
  };

  const onAccountsChanged = () => {
    // erase the connection and let the wallet reload
    setWalletConnection(resetWalletAction);

    initWallet();
  };

  const onChainChanged = () => {
    setWalletConnection(resetWalletAction);
  };

  const onConnected = (info: { chainId: number }) => {};

  const bindConnectionEvents = (connection: EventEmitter) => {
    connection.on('accountsChanged', onAccountsChanged);
    connection.on('chainChanged', onChainChanged);
    connection.on('connect', onConnected);
  };

  const unbindConnectionEvents = (connection: EventEmitter) => {
    connection.removeListener('accountsChanged', onAccountsChanged);
    connection.removeListener('chainChanged', onChainChanged);
    connection.removeListener('connect', onConnected);
  };

  const setWalletConnection = (payload: WalletStateActionPayload) => {
    dispatch({
      type: 'set_wallet_connection',
      payload,
    });
  };

  const walletContext = useMemo(
    () => ({
      ...state,
      setWalletConnection,
      connectToWallet,
      disconnectWallet,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return { walletContext };
};
