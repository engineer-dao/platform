import { WalletState } from './WalletContext';

export const walletReducer = (
  state: WalletState,
  action: WalletAction
): WalletState => {
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

export type WalletAction = {
  type: 'set_wallet_connection';
  payload: WalletState;
};
