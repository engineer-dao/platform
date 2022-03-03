const walletAddToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenImgUrl: string,
  tokenDecimals: number
) => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
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

    if (wasAdded) {
      console.log('Added token', tokenSymbol, 'to wallet');
    } else {
      console.log('Cancelled adding', tokenSymbol, 'token to wallet');
    }
  } catch (error) {
    console.log(error);
  }
};

export { walletAddToken };
