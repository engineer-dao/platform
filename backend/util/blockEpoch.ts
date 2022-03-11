import { IBlockchainEventRef } from 'interfaces/IBlockchainEventRef';

// Sync this many blocks at a time
export const SYNC_BLOCK_CHUNK_SIZE = parseInt(
  process.env.SYNC_BLOCK_CHUNK_SIZE || '1000'
);

// convert into epoch, 998 => 0, 999 => 0, 1000 => 1000,  1001 => 1000, 1002 => 1000, etc.
export const blockNumberToBlockEpoch = (blockNumber: number) => {
  return Math.max(0, blockNumber - (blockNumber % SYNC_BLOCK_CHUNK_SIZE));
};

// group a block range into an array of blocks
export const groupBlocksByEpoch = (startingBlock: number, toBlock: number) => {
  const epochBlocks: [number, number][] = [];

  let safety = 0;
  while (startingBlock <= toBlock) {
    const epoch = blockNumberToBlockEpoch(startingBlock);
    const epochEnd = Math.min(toBlock, epoch + SYNC_BLOCK_CHUNK_SIZE);

    epochBlocks.push([epoch, epochEnd]);

    // when increasing by 1, this is required
    if (epochEnd === toBlock) {
      break;
    }

    startingBlock = epochEnd;
  }
  return epochBlocks;
};
