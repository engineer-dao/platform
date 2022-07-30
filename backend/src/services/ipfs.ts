import pinataSDK from '@pinata/sdk';
import axios from 'axios';

const projectKey = process.env.IPFS_PINATA_PROJECT_KEY || '';
const projectSecret = process.env.IPFS_PINATA_PROJECT_SECRET || '';
const pinata = pinataSDK(projectKey, projectSecret);

const getIPFSData = async (cid: string) => {
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

  return await axios(ipfsUrl, {
    method: 'GET',
  });
};

export { pinata, getIPFSData };
