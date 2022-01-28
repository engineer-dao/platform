import { ethers } from 'hardhat';
import * as ContractTypes from '../../typechain/index';
import { Signer } from 'ethers';

// export const ONE_ETH = '1000000000000000000';
// export const ONE_TENTH_ETH = '100000000000000000';
// export const POINT_ZERO_NINE_ETH = '90000000000000000';
// export const ONE_POINT_ONE_ETH = '1100000000000000000';

export const ONE_TOKEN = '1000000000000000000';
export const TEN_TOKENS = '10000000000000000000';
export const ONE_HUND_TOKENS = '100000000000000000000';
export const ONE_HUND_TEN_TOKENS = '110000000000000000000';
export const NINETY_TOKENS = '9000000000000000000';
export const ELEVEN_HUND_TOKENS = '110000000000000000000';
export const ONE_THOUS_TOKENS = '1000000000000000000000';
export const ONE_THOUS_NINETY_TOKENS = '1090000000000000000000';
export const ONE_HUND_THOUS_TOKENS = '100000000000000000000000';

export const JOB_ID_1 = 1;
export const JOB_ID_2 = 2;
export const JOB_ID_3 = 3;

export const STATE_Available = 1;
export const STATE_Started = 2;
export const STATE_Completed = 3;
export const STATE_FinalApproved = 4;
export const STATE_FinalCanceledBySupplier = 5;
export const STATE_FinalMutualClose = 6;

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

export const deployERC20Token = async () => {
  const testToken = await (
    await ethers.getContractFactory('TestERC20')
  ).deploy();
  await testToken.deployed();
  return testToken;
};

export const deployJob = async (testToken: ContractTypes.TestERC20) => {
  // deploy the contract
  const Job = await ethers.getContractFactory('Job');
  const job = await Job.deploy(testToken.address);
  await job.deployed();
  return job;
};

export const setupJobAndTokenBalances = async () => {
  const testToken = await deployERC20Token();
  const job = await deployJob(testToken);

  // send balances
  const _signers = await signers();
  await testToken.transfer(_signers.supplier.address, ONE_THOUS_TOKENS);
  await testToken.transfer(_signers.engineer.address, ONE_THOUS_TOKENS);
  await testToken.transfer(_signers.other.address, ONE_THOUS_TOKENS);
  await testToken.transfer(_signers.other2.address, ONE_THOUS_TOKENS);
  await testToken.transfer(_signers.other3.address, ONE_THOUS_TOKENS);

  // approve the job contract to spend on their behalf
  await testToken
    .connect(_signers.supplier)
    .approve(job.address, ONE_HUND_THOUS_TOKENS);
  await testToken
    .connect(_signers.engineer)
    .approve(job.address, ONE_HUND_THOUS_TOKENS);
  await testToken
    .connect(_signers.other)
    .approve(job.address, ONE_HUND_THOUS_TOKENS);
  await testToken
    .connect(_signers.other2)
    .approve(job.address, ONE_HUND_THOUS_TOKENS);
  await testToken
    .connect(_signers.other3)
    .approve(job.address, ONE_HUND_THOUS_TOKENS);

  return { job, testToken };
};

// export const deployAndPostJob = async (bounty: null | string = null) => {
//   // deploy the contract
//   const job = await deployJob(await deployERC20Token());

//   // returns jobTx
//   await postSampleJob(job, bounty);

//   return job;
// };

export const postSampleJob = async (
  job: ContractTypes.Job,
  bounty: null | string = null,
  jobMetaData: JobMetaData | null = null,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).supplier;
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

  // post the job from the supplier address;
  if (bounty === null) {
    bounty = ONE_HUND_TOKENS;
  }
  const postJobTx = await job
    .connect(signer)
    .postJob(bounty, JSON.stringify(jobMetaData));

  return postJobTx;
};

export const startJob = async (
  job: ContractTypes.Job,
  jobId: number,
  deposit: null | string = null,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).engineer;
  }

  if (deposit === null) {
    deposit = TEN_TOKENS; // $10
  }
  const startJobTx = await job.connect(signer).startJob(jobId, deposit);

  return startJobTx;
};

export const completeJob = async (
  job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).engineer;
  }

  const completeJobTx = await job.connect(signer).completeJob(jobId);

  return completeJobTx;
};

export const approveJob = async (
  job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).supplier;
  }

  const approveJobTx = await job.connect(signer).approveJob(jobId);

  return approveJobTx;
};

export const cancelJob = async (
  job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).supplier;
  }

  const cancelJobTx = await job.connect(signer).cancelJob(jobId);

  return cancelJobTx;
};

export const closeBySupplier = async (
  job: ContractTypes.Job,
  jobId: number
) => {
  const signer = (await signers()).supplier;

  return await closeJob(job, jobId, signer);
};

export const closeByEngineer = async (
  job: ContractTypes.Job,
  jobId: number
) => {
  const signer = (await signers()).engineer;

  return await closeJob(job, jobId, signer);
};

export const closeJob = async (
  job: ContractTypes.Job,
  jobId: number,
  signer: Signer
) => {
  if (signer === null) {
    signer = (await signers()).supplier;
  }

  const closeJobTx = await job.connect(signer).closeJob(jobId);

  return closeJobTx;
};

export const signers = async () => {
  const [owner, supplier, engineer, other, other2, other3] =
    await ethers.getSigners();
  return {
    owner,
    supplier,
    engineer,
    other,
    other2,
    other3,
  };
};
