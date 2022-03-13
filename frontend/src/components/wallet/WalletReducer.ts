import {
  IWalletState,
  WalletStateActionPayload,
} from 'interfaces/IWalletState';

type WalletAction = {
  type: 'set_wallet_connection';
  payload: WalletStateActionPayload;
};

export const walletReducer = (
  state: IWalletState,
  action: WalletAction
): IWalletState => {
  switch (action.type) {
    case 'set_wallet_connection': {
      const { account, connected, provider, providerInfo, chainId } =
        action?.payload;

      return {
        ...state,
        account,
        connected,
        provider,
        providerInfo,
        chainId,
      };
    }
    default: {
      return state;
    }
  }
};
