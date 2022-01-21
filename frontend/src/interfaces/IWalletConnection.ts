export interface IWalletConnection {
  connected: boolean;
  account: string;
  provider: string;
}

export interface IWalletConnectionContext {
  walletConnection: IWalletConnection;
  setWalletConnection: (arg0: IWalletConnection) => {};
}

