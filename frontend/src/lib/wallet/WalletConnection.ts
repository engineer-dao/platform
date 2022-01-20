export interface WalletConnection {
  connected: boolean;
  account: string;
  provider: string;
}

export interface WalletConnectionContext {
  walletConnection: WalletConnection;
  setWalletConnection: (arg0: WalletConnection) => {};
}

export const DefaultWalletConnection = {
  connected: false,
  account: '',
  provider: '',
};

export const DefaultWalletConnectionContext = {
  walletConnection: DefaultWalletConnection,
  setWalletConnection: (arg0: WalletConnection) => {},
};
