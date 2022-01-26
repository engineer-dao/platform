import { ethers } from 'hardhat';
import * as ContractTypes from '../../typechain/index';
import { Signer } from 'ethers';

export const ONE_ETH = '1000000000000000000';
export const ONE_TENTH_ETH = '100000000000000000';
export const POINT_ZERO_NINE_ETH = '90000000000000000';
export const ONE_POINT_ONE_ETH = '1100000000000000000';

export const JOB_ID_1 = 1;
export const JOB_ID_2 = 2;
export const JOB_ID_3 = 3;

interface JobMetaData {
  ver?: string;
  name?: string;
  description?: string;
  acceptance?: string;
  contact?: string;
}

export const defaultJobMetaData: JobMetaData = {
  ver: '1',
  name: 'Job Name',
  description: 'The job description',
  acceptance: 'The job acceptance criteria',
  contact: 'owner@myjobsite.com',
};

export const deployAndPostJob = async (bounty: null | string = null) => {
  // deploy the contract
  const job = await deployJob();

  // returns jobTx
  await postSampleJob(job, bounty);

  return job;
};

export const postSampleJob = async (
  job: ContractTypes.Job,
  bounty: null | string = null,
  jobMetaData: JobMetaData | null = null,
  signer: Signer | null = null
) => {
  if (signer === null) {
    const [ownerSigner, supplierSigner, engineerSigner, otherSigner] =
      await ethers.getSigners();
    signer = supplierSigner;
  }

  if (jobMetaData === null) {
    jobMetaData = {
      ...defaultJobMetaData,
    };
  } else {
    jobMetaData = {
      ...defaultJobMetaData,
      ...jobMetaData,
    };
  }

  // post the job from the supplier address
  if (bounty === null) {
    bounty = ONE_ETH;
  }
  const postJobTx = await job
    .connect(signer)
    .postJob(JSON.stringify(jobMetaData), {
      value: bounty,
    });

  return postJobTx;
};

export const deployJob = async () => {
  // deploy the contract
  const Job = await ethers.getContractFactory('Job');
  const job = await Job.deploy();
  await job.deployed();
  return job;
};

export const startJob = async (
  job: ContractTypes.Job,
  jobId: number,
  buyIn: null | string = null,
  signer: Signer | null = null
) => {
  if (signer === null) {
    const [ownerSigner, supplierSigner, engineerSigner, otherSigner] =
      await ethers.getSigners();
    signer = engineerSigner;
  }

  if (buyIn === null) {
    buyIn = ONE_TENTH_ETH; // .01 ether
  }
  const startJobTx = await job.connect(signer).startJob(jobId, {
    value: buyIn,
  });

  return startJobTx;
};
