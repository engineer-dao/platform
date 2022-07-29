import { ethers } from 'ethers';

export const getBlockTimestamp = async (blockNumber: number) => {
  const provider = getProvider();
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
};

export const getLatestBlockHeight = async () => {
  const provider = getProvider();
  return await provider.getBlockNumber();
};

export const getProvider = () => {
  return ethers.getDefaultProvider(process.env.ETHERS_PROVIDER_CHAIN_RPC_HOST);
};
