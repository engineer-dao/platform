import { Job } from 'contracts-typechain';
import { BigNumber, ethers } from 'ethers';
import { SmartContractAddresses } from '../components/smart-contracts/SmartContractAddresses';
import { SupportedTokens } from '../enums/SupportedTokens';
import {
  IJobData,
  IJobMetaData,
  IJobSmartContractData,
} from '../interfaces/IJobData';
import { IJobFilter } from '../interfaces/IJobFilter';
import { fetchIpfsMetaData } from './ipfs';

export const fetchJobMetaData = async (
  jobId: string,
  Job: Job
): Promise<IJobMetaData | undefined> => {
  const filter = Job.filters.JobPosted(BigNumber.from(jobId));
  const results = await Job.queryFilter(filter);
  const event = results?.[0];
  const ipfsCid = event.args.metadataCid;

  const reportFilter = Job.filters.JobReported(BigNumber.from(jobId));
  const reportResults = await Job.queryFilter(reportFilter);
  const reportEvent = reportResults?.[0];
  const reporter = reportEvent?.args?.reporter;

  const data = await fetchIpfsMetaData(ipfsCid);

  return { ...data, ipfsCid, reporter };
};

export const filterJobs = (jobs: IJobData[], jobFilter?: IJobFilter) => {
  if (!jobFilter) {
    return jobs;
  }

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

export const loadJobFromJobId = async (jobId: string, Job: Job) => {
  // always get the job data from the contract as it can change
  const jobContractData = formatJobContractData(await Job.jobs(jobId));

  // load job meta data from IPFS if needed
  const jobMetaData = await fetchJobMetaData(jobId, Job);

  if (jobMetaData === undefined) {
    return undefined;
  }

  const assembledJob = {
    id: jobId,
    ...jobContractData,
    ...jobMetaData,
    paymentTokenName: process.env.REACT_APP_PAYMENT_TOKEN_NAME || '',
  };

  return assembledJob;
};

export const formatJobContractData = (
  jobContractData: IJobSmartContractData
) => {
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
    requiredDeposit: jobContractData.requiredDeposit
      .div(ethers.constants.WeiPerEther)
      .toNumber(),
    startTime: BigNumber.from(jobContractData.startTime).toNumber(),
    completedTime: BigNumber.from(jobContractData.completedTime).toNumber(),
    closedBySupplier: jobContractData.closedBySupplier,
    closedByEngineer: jobContractData.closedByEngineer,
    state: jobContractData.state,
    token:
      jobContractData.token === SmartContractAddresses.ENGIToken
        ? SupportedTokens.ENGI
        : SupportedTokens.USDC,
  };
};
