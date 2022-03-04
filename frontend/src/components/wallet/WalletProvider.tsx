import { useWalletProvider } from 'components/wallet/useWalletProvider';
import { WalletContext } from 'components/wallet/WalletContext';
import React from 'react';
import { Modal } from 'components/modals/Modal';
import { walletSwitchDefaultEthereumChain } from 'utils/metamask';

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { walletContext } = useWalletProvider();

  const showChainWarning = !!(
    walletContext.chainId &&
    walletContext.chainId !== process.env.REACT_APP_SUPPORTED_CHAIN_ID
  );

  return (
    <>
      <WalletContext.Provider value={walletContext}>
        {children}
      </WalletContext.Provider>
      <Modal
        title="Please Switch Chains"
        icon="ExclamationIcon"
        iconColor="red"
        isOpen={showChainWarning}
        onRequestClose={() => {}}
      >
        <p>
          <span>Please change your wallet's network to the </span>
          <span>{process.env.REACT_APP_SUPPORTED_CHAIN_NAME} </span>
          <span>network.</span>
        </p>
        <button
          type="button"
          className="focus:outline-none -ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={walletSwitchDefaultEthereumChain}
        >
          Switch Network
        </button>
      </Modal>
    </>
  );
};
