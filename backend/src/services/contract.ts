import { Job, Job__factory } from '../contracts-typechain';
import { getProvider } from './ethereum';

export const loadAllEvents = async (fromBlock?: number, toBlock?: number) => {
  const contract = getJobContract();

  const filter = {
    address: contract.address,
    topics: [],
  };

  return await contract.queryFilter(filter, fromBlock, toBlock);
};

export const getJobContract = (): Job => {
  if (!process.env.JOB_CONTRACT_ADDRESS) {
    throw new Error('JOB_CONTRACT_ADDRESS not defined');
  }

  return Job__factory.connect(process.env.JOB_CONTRACT_ADDRESS, getProvider());
};
