import { useWalletProvider } from 'components/wallet/useWalletProvider';
import { WalletContext } from 'components/wallet/WalletContext';
import React from 'react';
import { Modal } from 'components/modals/Modal';

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
      </Modal>
    </>
  );
};
