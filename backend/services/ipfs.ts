import pinataSDK from '@pinata/sdk';
import fetch from 'node-fetch';

const projectKey = process.env.IPFS_PINATA_PROJECT_KEY || '';
const projectSecret = process.env.IPFS_PINATA_PROJECT_SECRET || '';
const pinata = pinataSDK(projectKey, projectSecret);

const getIPFSData = async (cid: string) => {
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

  return await fetch(ipfsUrl, {
    method: 'GET',
  });
};

export { pinata, getIPFSData };
