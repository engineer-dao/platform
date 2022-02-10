import React from 'react';
import { MoralisProvider } from 'react-moralis';
import { WalletProvider } from 'components/wallet/WalletProvider';

export const MoralisWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const appId = process.env.REACT_APP_MORALIS_APP_ID || '';
  const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL || '';

  if (appId === '' || serverUrl === '') {
    return (
      <div>
        Please configure REACT_APP_MORALIS_APP_ID and
        REACT_APP_MORALIS_SERVER_URL
      </div>
    );
  }

  return (
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <WalletProvider>{children}</WalletProvider>
    </MoralisProvider>
  );
};
