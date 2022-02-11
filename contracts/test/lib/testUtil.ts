import { ethers } from 'hardhat';
import * as ContractTypes from '../../typechain/index';
import { Signer, Contract, BigNumber } from 'ethers';
import { ERC20 } from "../../typechain/index";

export const T_SUFFIX = '000000000000000000';
export const ONE_TOKEN = '1' + T_SUFFIX;
export const TEN_TOKENS = '10' + T_SUFFIX;
export const ONE_HUND_TOKENS = '100' + T_SUFFIX;
export const ONE_THOUS_TOKENS = '1000' + T_SUFFIX;
export const ONE_HUND_THOUS_TOKENS = '100000' + T_SUFFIX;

export const JOB_ID_1 = 1;
export const JOB_ID_2 = 2;
export const JOB_ID_3 = 3;

export const STATE_DoesntExist = 0;
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

export const DEFAULT_DEPOSIT_PCT = 1000;
export const BASE_PERCENT = 10000;

// TODO: can be moved to env & env.testnet and called "DAO_STABLE_COIN_ADDRESS"
// polygon mainnet
export const USDC_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";

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

export const deployDaoTreasury = async () => {
    const DaoTreasury = await (
        await ethers.getContractFactory('DaoTreasury')
    ).deploy();
    await DaoTreasury.deployed();
    return DaoTreasury;
};

export const deployERC20Token = async () => {
    const testToken = await (
        await ethers.getContractFactory('TestERC20')
    ).deploy();
    await testToken.deployed();
    return testToken;
};

export const deployJob = async (TestToken: ContractTypes.TestERC20) => {
    // deploy the contract
    const Job = await ethers.getContractFactory('Job');
    const job = await Job.deploy(TestToken.address);
    await job.deployed();
    return job;
};

export const setupJobAndTokenBalances = async () => {
    const TestToken = await deployERC20Token();
    const DaoTreasury = await deployDaoTreasury();
    const JobContract = await deployJob(TestToken);

    const _signers = await signers();

    await (await JobContract.setDaoTreasury(DaoTreasury.address)).wait();
    await (await JobContract.setResolver(_signers.resolver.address)).wait();

    await (await DaoTreasury.setJobContract(JobContract.address)).wait();
    await (await DaoTreasury.setStableCoin(USDC_ADDRESS)).wait();

    // send balances
    await TestToken.transfer(_signers.supplier.address, ONE_THOUS_TOKENS);
    await TestToken.transfer(_signers.engineer.address, ONE_THOUS_TOKENS);
    await TestToken.transfer(_signers.addr1.address, ONE_THOUS_TOKENS);
    await TestToken.transfer(_signers.addr2.address, ONE_THOUS_TOKENS);
    await TestToken.transfer(_signers.addr3.address, ONE_THOUS_TOKENS);

    // approve the job contract to spend on their behalf
    await TestToken
        .connect(_signers.supplier)
        .approve(JobContract.address, ONE_HUND_THOUS_TOKENS);
    await TestToken
        .connect(_signers.engineer)
        .approve(JobContract.address, ONE_HUND_THOUS_TOKENS);
    await TestToken
        .connect(_signers.addr1)
        .approve(JobContract.address, ONE_HUND_THOUS_TOKENS);
    await TestToken
        .connect(_signers.addr2)
        .approve(JobContract.address, ONE_HUND_THOUS_TOKENS);
    await TestToken
        .connect(_signers.addr3)
        .approve(JobContract.address, ONE_HUND_THOUS_TOKENS);

    return { JobContract, TestToken, DaoTreasury };
};

export const getBalanceOf = async (TokenContract: ERC20, address: string): Promise<BigNumber> => {
    return await TokenContract.balanceOf(address);
}

export const postSampleJob = (signer: undefined | Signer = undefined) => async (
    Job: ContractTypes.Job,
    token: ERC20,
    bounty: undefined | string = undefined,
    depositPct: undefined | number = DEFAULT_DEPOSIT_PCT,
    jobMetaData: undefined | JobMetaData = undefined,
) => {
    if (!signer) {
        signer = (await signers()).supplier;
    }

    if (!jobMetaData) {
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
    if (!bounty) {
        bounty = ONE_HUND_TOKENS;
    }

    const postJobTx = await Job
        .connect(signer)
        .postJob(token.address, bounty, depositPct, JSON.stringify(jobMetaData));

    return postJobTx;
};

export const startJob = async (
    Job: ContractTypes.Job,
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
    const startJobTx = await Job.connect(signer).startJob(jobId, deposit);

    return startJobTx;
};

export const completeJob = async (
    Job: ContractTypes.Job,
    jobId: number,
    signer: Signer | null = null
) => {
    if (signer === null) {
        signer = (await signers()).engineer;
    }

    const completeJobTx = await Job.connect(signer).completeJob(jobId);

    return completeJobTx;
};

export const approveJob = async (
    Job: ContractTypes.Job,
    jobId: number,
    signer: Signer | null = null
) => {
    if (signer === null) {
        signer = (await signers()).supplier;
    }

    const approveJobTx = await Job.connect(signer).approveJob(jobId);

    return approveJobTx;
};

export const cancelJob = async (
    Job: ContractTypes.Job,
    jobId: number,
    signer: Signer | null = null
) => {
    if (signer === null) {
        signer = (await signers()).supplier;
    }

    const cancelJobTx = await Job.connect(signer).cancelJob(jobId);

    return cancelJobTx;
};

export const closeBySupplier = async (
    Job: ContractTypes.Job,
    jobId: number
) => {
    const signer = (await signers()).supplier;

    return await closeJob(Job, jobId, signer);
};

export const closeByEngineer = async (
    Job: ContractTypes.Job,
    jobId: number
) => {
    const signer = (await signers()).engineer;

    return await closeJob(Job, jobId, signer);
};

export const closeJob = async (
    Job: ContractTypes.Job,
    jobId: number,
    signer: Signer
) => {
    const closeJobTx = await Job.connect(signer).closeJob(jobId);

    return closeJobTx;
};

export const completeTimedOutJob = async (
    Job: ContractTypes.Job,
    jobId: number,
    signer: Signer | null = null
) => {
    if (signer === null) {
        signer = (await signers()).engineer;
    }

    const closeJobTx = await Job.connect(signer).completeTimedOutJob(jobId);

    return closeJobTx;
};

export const disputeJob = async (
    Job: ContractTypes.Job,
    jobId: number,
    signer: Signer | null = null
) => {
    if (signer === null) {
        signer = (await signers()).supplier;
    }

    const disputeJobTx = await Job.connect(signer).disputeJob(jobId);

    return disputeJobTx;
};

export const delistJob = async (
    Job: ContractTypes.Job,
    jobId: number,
    signer: Signer | null = null
) => {
    if (signer === null) {
        signer = (await signers()).owner;
    }

    const delistJobTx = await Job.connect(signer).delistJob(jobId, "");

    return delistJobTx;
};

export const resolveDisputeForSupplier = async (
    Job: ContractTypes.Job,
    jobId: number,
    signer: Signer | null = null
) => {
    if (signer === null) {
        signer = (await signers()).owner;
    }

    const resolveDisputeForSupplierTx = await Job
        .connect(signer)
        .resolveDisputeForSupplier(jobId);

    return resolveDisputeForSupplierTx;
};

export const resolveDisputeForEngineer = async (
    Job: ContractTypes.Job,
    jobId: number,
    signer: Signer | null = null
) => {
    if (signer === null) {
        signer = (await signers()).owner;
    }

    const resolveDisputeForEngineerTx = await Job
        .connect(signer)
        .resolveDisputeForEngineer(jobId);

    return resolveDisputeForEngineerTx;
};

export const resolveDisputeWithCustomSplit = async (
    Job: ContractTypes.Job,
    jobId: number,
    engineerAmountPct: number,
    signer: Signer | null = null
) => {
    if (signer === null) {
        signer = (await signers()).owner;
    }

    const resolveDisputeWithCustomSplitTx = await Job
        .connect(signer)
        .resolveDisputeWithCustomSplit(jobId, engineerAmountPct);

    return resolveDisputeWithCustomSplitTx;
};

export const getJobPayouts = async (
    Job: ContractTypes.Job,
    jobId: number,
) => {
    const [forEngineer, forEngineerNoDeposit, forDao] = await Job
        .getJobPayouts(jobId);

    return {
        forEngineer, forEngineerNoDeposit, forDao
    };
};

export const getDisputePayouts = async (
    Job: ContractTypes.Job,
    jobId: number,
) => {
    const [forWinner, forDao] = await Job
        .getDisputePayouts(jobId);

    return {
        forWinner, forDao
    };
};

// export const withdrawDaoFunds = async (
//     job: ContractTypes.Job,
//     address: string,
//     amount: string,
//     signer: Signer | null = null
// ) => {
//     if (signer === null) {
//         signer = (await signers()).owner;
//     }
//
//     const withdrawDaoFundsTx = await job
//         .connect(signer)
//         .withdrawDaoFunds(address, amount);
//
//     return withdrawDaoFundsTx;
// };

////////////////////////////////////////////////////////////////
export const signers = async () => {
    const [owner, resolver, supplier, engineer, addr1, addr2, addr3] =
        await ethers.getSigners();
    return {
        owner,
        resolver,
        supplier,
        engineer,
        addr1,
        addr2,
        addr3,
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
