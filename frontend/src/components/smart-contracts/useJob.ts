import { useEffect, useState } from 'react';
import { useSmartContracts } from 'components/smart-contracts/useSmartContracts';
import { useWallet } from 'components/wallet/useWallet';
import { BigNumber, ethers } from 'ethers';
import {
  IJobData,
  IJobSmartContractData,
  IJobMetaData,
} from 'interfaces/IJobData';
import { ISmartContractState } from 'interfaces/ISmartContractState';

const assembleJob = (
  jobId: string,
  jobContractData: IJobSmartContractData,
  jobMetaData: IJobMetaData
) => {
  const job: IJobData = {
    id: jobId,

    supplier: ethers.utils.getAddress(jobContractData.supplier),
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
    startTime: BigNumber.from(jobContractData.startTime).toNumber(),
    completedTime: BigNumber.from(jobContractData.completedTime).toNumber(),
    closedBySupplier: jobContractData.closedBySupplier,
    closedByEngineer: jobContractData.closedByEngineer,
    state: jobContractData.state,

    title: jobMetaData.title,
    description: jobMetaData.description,
    buyIn: jobMetaData.buyIn,
    acceptanceCriteria: jobMetaData.acceptanceCriteria,
  };

  return job;
};

const loadJobFromJobId = async (
  jobId: string,
  contracts: ISmartContractState
) => {
  // get the job data from the contract
  const job = await contracts.Job.jobs(jobId);

  // load job meta data from log...
  const filter = contracts.Job.filters.JobPosted(BigNumber.from(jobId));
  const results = await contracts.Job.queryFilter(filter);

  const event = results[0];

  const jobMetaDataJSON = event.args.jobMetaData;
  // TODO: validate meta data with a schema
  const unsafeJobMetaData = JSON.parse(jobMetaDataJSON);

  return assembleJob(jobId, job, unsafeJobMetaData);
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

export const useFindJobs = () => {
  const { contracts } = useSmartContracts();
  const { account } = useWallet();
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

      setJobs(allJobs);
      setIsLoading(false);
    };

    if (account) {
      fetchJobs();
    }
  }, [account, contracts]);

  return {
    jobs,
    isLoading,
  };
};
