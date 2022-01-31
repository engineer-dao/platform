import { ethers } from 'hardhat';
import * as ContractTypes from '../../typechain/index';
import { Signer } from 'ethers';

export const T_SUFFIX = '000000000000000000';
export const ONE_TOKEN = '1' + T_SUFFIX;
export const TEN_TOKENS = '10' + T_SUFFIX;
export const ONE_HUND_TOKENS = '100' + T_SUFFIX;
export const ONE_THOUS_TOKENS = '1000' + T_SUFFIX;
export const ONE_HUND_THOUS_TOKENS = '100000' + T_SUFFIX;

export const JOB_ID_1 = 1;
export const JOB_ID_2 = 2;
export const JOB_ID_3 = 3;

export const STATE_Available = 1;
export const STATE_Started = 2;
export const STATE_Completed = 3;
export const STATE_Disputed = 4;
export const STATE_FinalApproved = 5;
export const STATE_FinalCanceledBySupplier = 6;
export const STATE_FinalMutualClose = 7;
export const STATE_FinalNoResponse = 8;
export const STATE_FinalDisputeResolvedForSupplier = 9;
export const STATE_FinalDisputeResolvedForEngineer = 10;
export const STATE_FinalDisputeResolvedWithSplit = 11;

export const DISPUTE_RESOLUTION_PCT = 0.06;

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
  const closeJobTx = await job.connect(signer).closeJob(jobId);

  return closeJobTx;
};

export const completeTimedOutJob = async (
  job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).engineer;
  }

  const closeJobTx = await job.connect(signer).completeTimedOutJob(jobId);

  return closeJobTx;
};

export const disputeJob = async (
  job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).supplier;
  }

  const disputeJobTx = await job.connect(signer).disputeJob(jobId);

  return disputeJobTx;
};

export const resolveDisputeForSupplier = async (
  job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).owner;
  }

  const resolveDisputeForSupplierTx = await job
    .connect(signer)
    .resolveDisputeForSupplier(jobId);

  return resolveDisputeForSupplierTx;
};

export const resolveDisputeForEngineer = async (
  job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).owner;
  }

  const resolveDisputeForEngineerTx = await job
    .connect(signer)
    .resolveDisputeForEngineer(jobId);

  return resolveDisputeForEngineerTx;
};

export const resolveDisputeWithCustomSplit = async (
  job: ContractTypes.Job,
  jobId: number,
  engineerAmountPct: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).owner;
  }

  const resolveDisputeWithCustomSplitTx = await job
    .connect(signer)
    .resolveDisputeWithCustomSplit(jobId, engineerAmountPct);

  return resolveDisputeWithCustomSplitTx;
};

export const withdrawDaoFunds = async (
  job: ContractTypes.Job,
  address: string,
  amount: string,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).owner;
  }

  const withdrawDaoFundsTx = await job
    .connect(signer)
    .withdrawDaoFunds(address, amount);

  return withdrawDaoFundsTx;
};

////////////////////////////////////////////////////////////////

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

// converts number into token value
//   supports 0, 1 or 2 decimal places
export const toBigNum = (num: number) => {
  return Math.floor(num * 100) + '0000000000000000';
};

// converts number into an integer percentage divided by 10000
//   supports 0, 1 or 2 decimal places
export const toPercentage = (num: number) => {
  return Math.floor(num * 100);
};
