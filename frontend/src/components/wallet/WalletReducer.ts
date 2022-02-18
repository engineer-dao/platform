import { IWalletState } from 'interfaces/IWalletState';

type WalletAction = {
  type: 'set_wallet_connection';
  payload: IWalletState;
};

export const walletReducer = (
  state: IWalletState,
  action: WalletAction
): IWalletState => {
  switch (action.type) {
    case 'set_wallet_connection': {
      const { account, connected, provider, providerInfo } = action?.payload;

      return {
        ...state,
        account,
        connected,
        provider,
        providerInfo,
      };
    }
    default: {
      return state;
    }
  }
};
