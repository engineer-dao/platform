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

      const chainIsSupported = !!(
        chainId && chainId === process.env.REACT_APP_SUPPORTED_CHAIN_ID
      );

      return {
        ...state,
        account,
        connected,
        provider,
        providerInfo,
        chainId,
        chainIsSupported,
      };
    }
    default: {
      return state;
    }
  }
};
