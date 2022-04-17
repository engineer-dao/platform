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
    fullAddress.substring(0, 10) +
    '...' +
    fullAddress.substring(fullAddress.length - 4)
  );
};

export const addressesMatch = (
  address1: string | undefined | null,
  address2: string | undefined | null
): boolean => {
  if (!address1 || !address2) {
    return false;
  }
  return address1?.toLowerCase() === address2?.toLowerCase();
};
