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
import { contractDatabaseRef } from 'services/firebase';
import { get, child } from 'firebase/database';

interface IFirebaseEventData {
  jobCid: string | undefined;
  reporter: string | undefined;
}

export const fetchJobMetaData = async (
  jobId: string,
  Job: Job
): Promise<IJobMetaData | undefined> => {
  // load ipfs cid from firebase events, fallback to recent blockchain if not found
  const eventDataFromFirebase = await fetchEventDataFromFirebase(jobId);

  const ipfsCid =
    eventDataFromFirebase.jobCid ||
    (await fetchIpfsCidFromContractEvents(jobId, Job));

  if (!ipfsCid) {
    return undefined;
  }

  // find the reporter from firebase events
  const reporter = eventDataFromFirebase.reporter;

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

  // load job meta data
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

const fetchEventDataFromFirebase = async (jobId: string) => {
  const eventsDbRef = contractDatabaseRef(`${jobId}/events`);
  const snapshot = await get(eventsDbRef);
  const eventData: IFirebaseEventData = {
    jobCid: undefined,
    reporter: undefined,
  };
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();

      if (childData.type === 'JobPosted') {
        eventData.jobCid = childData.args.metadataCid;
      }
      if (childData.type === 'JobReported') {
        eventData.reporter = childData.args.reporter;
      }
    });
  }

  return eventData;
};

const fetchIpfsCidFromContractEvents = async (
  jobId: string,
  Job: Job
): Promise<string | undefined> => {
  const filter = Job.filters.JobPosted(BigNumber.from(jobId));
  const results = await Job.queryFilter(filter, -10000);
  const event = results?.[0];
  if (event) {
    return event.args.metadataCid;
  }
  return undefined;
};
