import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { useWallet } from 'components/wallet/useWallet';
import { BigNumber, ethers } from 'ethers';
import {
  IFormattedJobSmartContractData,
  IJobData,
  IJobMetaData,
  IJobSmartContractData,
} from 'interfaces/IJobData';
import { IJobFilter } from 'interfaces/IJobFilter';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { useEffect, useState } from 'react';
import { fetchIpfsMetaData } from 'services/ipfs';
import { formatIntegerPercentage } from 'utils/number';

const CACHE_VERSION = 1;

enum CacheKeys {
  JOB_META = 'm',
  VERSION = 'v',
  TIMESTAMP = 't',
}

interface IJobCacheEntry {
  [CacheKeys.JOB_META]: IJobMetaData;
  [CacheKeys.VERSION]: number;
  [CacheKeys.TIMESTAMP]: number;
}

const formatJobContractData = (jobContractData: IJobSmartContractData) => {
  return {
    supplier: String(ethers.utils.getAddress(jobContractData.supplier)),
    engineer:
      jobContractData.engineer === ethers.constants.AddressZero
        ? undefined
        : ethers.utils.getAddress(jobContractData.engineer),
    bounty: BigNumber.from(jobContractData.bounty)
      .div(ethers.constants.WeiPerEther)
      .toNumber(),
    deposit: BigNumber.from(jobContractData.deposit)
      .div(ethers.constants.WeiPerEther)
      .toNumber(),
    depositPct: jobContractData.depositPct.toNumber(),
    formattedDepositPct: formatIntegerPercentage(jobContractData.depositPct),
    startTime: BigNumber.from(jobContractData.startTime).toNumber(),
    completedTime: BigNumber.from(jobContractData.completedTime).toNumber(),
    closedBySupplier: jobContractData.closedBySupplier,
    closedByEngineer: jobContractData.closedByEngineer,
    state: jobContractData.state,
  };
};

const loadJobFromJobId = async (
  jobId: string,
  contracts: ISmartContractState
) => {
  // load cached information
  const cachedJobMetaData = loadJobMetaDataFromCache(jobId);

  // always get the job data from the contract as it can change
  const jobContractData: IFormattedJobSmartContractData = formatJobContractData(
    await contracts.Job.jobs(jobId)
  );

  // load job meta data from IPFS if needed
  const jobMetaData = cachedJobMetaData
    ? cachedJobMetaData
    : await fetchJobMetaData(jobId, contracts);

  const assembledJob = {
    id: jobId,
    ...jobContractData,
    ...jobMetaData,
    paymentTokenName: process.env.REACT_APP_PAYMENT_TOKEN_NAME || '',
  };

  // save to cache
  if (!cachedJobMetaData) {
    const newCachedJobEntry: IJobCacheEntry = {
      [CacheKeys.JOB_META]: jobMetaData,
      [CacheKeys.VERSION]: CACHE_VERSION,
      [CacheKeys.TIMESTAMP]: Date.now(),
    };
    saveJobToCache(jobId, newCachedJobEntry);
  }

  return assembledJob;
};

export const clearEntireJobCache = () => {
  window.localStorage.clear();
};

export const useJob = (jobId: string) => {
  const { contracts } = useSmartContracts();
  const { account } = useWallet();
  const [jobData, setJobData] = useState<undefined | IJobData>();

  useEffect(() => {
    const fetchJob = async () => {
      setJobData(await loadJobFromJobId(jobId, contracts));
    };

    if (jobId && account) {
      fetchJob();
    }
  }, [jobId, account, contracts]);

  return jobData;
};

export const useFindJobsByCurrentWallet = () => {
  const { account } = useWallet();

  const [jobFilter, setJobFilter] = useState<IJobFilter>({
    fields: {
      supplier: '0x00',
      engineer: '0x00',
    },
  });

  // filter by wallet account (address)
  useEffect(() => {
    if (account) {
      const formattedAddress = ethers.utils.getAddress(account);
      setJobFilter((jobFilter) => {
        return {
          ...jobFilter,
          fields: {
            supplier: formattedAddress,
            engineer: formattedAddress,
          },
        };
      });
    }
  }, [account]);

  return useFindJobs(jobFilter);
};

export const useFindJobs = (jobFilter?: IJobFilter) => {
  const { contracts } = useSmartContracts();
  const { account, chainIsSupported } = useWallet();
  const [jobs, setJobs] = useState<IJobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      // load all jobs
      const highestJobCount = (await contracts.Job.jobCount()).toNumber();

      const allJobs = [] as IJobData[];
      for (
        let jobIdInteger = 1;
        jobIdInteger <= highestJobCount;
        ++jobIdInteger
      ) {
        // load
        const jobData = await loadJobFromJobId(String(jobIdInteger), contracts);
        allJobs.push(jobData);
      }

      if (jobFilter) {
        setJobs(filterJobs(allJobs, jobFilter));
      } else {
        setJobs(allJobs);
      }
      setIsLoading(false);
    };

    if (account && chainIsSupported) {
      fetchJobs();
    }
  }, [account, chainIsSupported, contracts, jobFilter]);

  return {
    jobs,
    isLoading,
  };
};

const buildJobCacheKey = (jobId: string) => {
  return `job:${jobId}`;
};

const loadJobMetaDataFromCache = (jobId: string) => {
  let cachedJobMetaData: IJobMetaData | undefined = undefined;
  const storage = window.localStorage;
  const jobCacheKey = buildJobCacheKey(jobId);
  const cachedJobString = storage.getItem(jobCacheKey);
  if (cachedJobString !== null) {
    const cachedJobEntry: IJobCacheEntry = JSON.parse(cachedJobString);
    cachedJobMetaData = cachedJobEntry[CacheKeys.JOB_META];
  }
  return cachedJobMetaData;
};

const saveJobToCache = (jobId: string, newCachedJobEntry: IJobCacheEntry) => {
  const storage = window.localStorage;
  const jobCacheKey = buildJobCacheKey(jobId);
  storage.setItem(jobCacheKey, JSON.stringify(newCachedJobEntry));
};

const fetchJobMetaData = async (
  jobId: string,
  contracts: ISmartContractState
): Promise<IJobMetaData> => {
  const filter = contracts.Job.filters.JobPosted(BigNumber.from(jobId));
  const results = await contracts.Job.queryFilter(filter);
  const event = results[0];
  const cidString = event.args.metadataCid;
  const unsafeJobMetaData = await fetchIpfsMetaData(cidString);

  // TODO: validate meta data with a schema
  // transform metadata
  return {
    ...unsafeJobMetaData,
    requiredDeposit: unsafeJobMetaData.deposit,
  };
};

const filterJobs = (jobs: IJobData[], jobFilter: IJobFilter) => {
  const filterFields = jobFilter.fields;

  const filteredJobs: IJobData[] = jobs.filter((job: IJobData) => {
    if (filterFields.id && job.id === filterFields.id) {
      return true;
    }
    if (filterFields.supplier && job.supplier === filterFields.supplier) {
      return true;
    }
    if (filterFields.engineer && job.engineer === filterFields.engineer) {
      return true;
    }
    if (filterFields.state && job.state === filterFields.state) {
      return true;
    }
    if (
      filterFields.paymentTokenName &&
      job.paymentTokenName === filterFields.paymentTokenName
    ) {
      return true;
    }

    return false;
  });

  return filteredJobs;
};
