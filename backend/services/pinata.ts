import pinataSDK from '@pinata/sdk';

const projectKey = process.env.IPFS_PINATA_PROJECT_KEY || '';
const projectSecret = process.env.IPFS_PINATA_PROJECT_SECRET || '';
const pinata = pinataSDK(projectKey, projectSecret);

export { pinata };
