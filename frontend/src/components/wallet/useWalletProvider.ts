import { ethers } from 'ethers';
import EventEmitter from 'events';
import Fortmatic from 'fortmatic';
import WalletConnectProvider from '@walletconnect/web3-provider';
import WalletLink from 'walletlink';
import {
  IWalletState,
  WalletStateActionPayload,
} from 'interfaces/IWalletState';
import { useEffect, useMemo, useReducer, useState } from 'react';
import Web3Modal, { getInjectedProvider, IProviderInfo } from 'web3modal';
import { walletReducer } from './WalletReducer';

// this should be replaced by an env variable. I provided a dummy one for now
const infuraId = process.env.REACT_APP_INFURA_ID || 'dummy';
const chainIdInt = parseInt(String(process.env.REACT_APP_SUPPORTED_CHAIN_ID));

const ethProvider = require('eth-provider');
const fortmaticNetworkOptions = {
  rpcUrl: process.env.REACT_APP_RPC_URL,
  chainId: chainIdInt,
};

const providerOptions = {
  /* See Provider Options Section */
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: infuraId,
    },
  },
  walletlink: {
    package: WalletLink, // Required
    options: {
      appName: 'EngineerDAO', // Required
      // infuraId: infuraId, // Required unless you provide a JSON RPC url; see `rpc` below
      rpc: process.env.REACT_APP_RPC_URL, // Optional if `infuraId` is provided; otherwise it's required
      chainId: chainIdInt, // Optional. It defaults to 1 if not provided
      appLogoUrl: null, // Optional. Application logo image URL. favicon is used if unspecified
      darkMode: false, // Optional. Use dark theme, defaults to false
    },
  },
  fortmatic: {
    package: Fortmatic,
    options: {
      key: process.env.REACT_APP_FORTMATIC_KEY || 'INVALID_KEY',
      network: fortmaticNetworkOptions,
    },
  },
  frame: {
    package: ethProvider, // required
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
