const walletAddToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenImgUrl: string,
  tokenDecimals: number
) => {
  try {
    // return value is a boolean. Like any RPC method, an error may be thrown.
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImgUrl, // A string url of the token logo
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// from https://docs.metamask.io/guide/rpc-api.html#unrestricted-methods as per EIP-3085
interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number; // usually 18
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

// interface WalletError {
//   code: number;
//   message: string;
// }

const defaultAddEthereumChainParameter: AddEthereumChainParameter = {
  chainId: String(process.env.REACT_APP_SUPPORTED_CHAIN_ID),
  chainName: String(process.env.REACT_APP_SUPPORTED_CHAIN_NAME),
  nativeCurrency: {
    name: String(process.env.REACT_APP_SUPPORTED_CHAIN_NATIVE_CURRENCY_NAME),
    symbol: String(
      process.env.REACT_APP_SUPPORTED_CHAIN_NATIVE_CURRENCY_SYMBOL
    ),
    decimals: Number(
      process.env.REACT_APP_SUPPORTED_CHAIN_NATIVE_CURRENCY_DECIMALS
    ),
  },
  rpcUrls: String(process.env.REACT_APP_RPC_URLS).split(','),
  blockExplorerUrls: process.env.REACT_APP_ICON_URLS
    ? String(process.env.REACT_APP_BLOCK_EXPLORER_URLS).split(',')
    : undefined,
  iconUrls: process.env.REACT_APP_ICON_URLS
    ? String(process.env.REACT_APP_ICON_URLS).split(',')
    : undefined,
};

const walletAddEthereumChain = async (
  addEthereumChainParameter: AddEthereumChainParameter
) => {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [addEthereumChainParameter],
    });
  } catch (addError) {
    console.error(2, addError);
  }
};

const walletSwitchEthereumChain = async (
  addEthereumChainParameter: AddEthereumChainParameter
) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: addEthereumChainParameter.chainId }],
    });
  } catch (switchError: any) {
    if ('code' in switchError) {
      if (switchError?.code === 4902) {
        // This error code indicates that the chain has not been added to MetaMask.
        await walletAddEthereumChain(addEthereumChainParameter);
      } else {
        console.error(switchError);
      }
    } else {
      console.error(switchError);
    }
  }
};

const walletSwitchDefaultEthereumChain = async () => {
  await walletSwitchEthereumChain(defaultAddEthereumChainParameter);
};

export {
  walletAddToken,
  defaultAddEthereumChainParameter,
  walletSwitchEthereumChain,
  walletSwitchDefaultEthereumChain,
  walletAddEthereumChain,
};
