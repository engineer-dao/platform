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
          className="focus:outline-none mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={walletSwitchDefaultEthereumChain}
        >
          Switch Network
        </button>
      </Modal>
    </>
  );
};
