import { utils } from 'ethers';

export const getWalletBalance = async (account: string) => {
  const balance = await window.ethereum.request({
    method: 'eth_getBalance',
    params: [account, 'latest'],
  });

  return utils.formatEther(balance);
};

export const shortenAddress = (fullAddress: string) => {
  return (
    fullAddress.substring(0, 6) +
    '...' +
    fullAddress.substring(fullAddress.length - 4)
  );
};
