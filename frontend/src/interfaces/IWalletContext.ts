import { IWalletState } from 'interfaces/IWalletState';

export interface IWalletContext extends IWalletState {
  setWalletConnection: (arg0: IWalletState) => void;
  disconnectWallet: () => void;
  connectToWallet: () => void;
}
