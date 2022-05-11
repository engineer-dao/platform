import { ethers } from 'hardhat';
import * as ContractTypes from '../../typechain/index';
import { Signer, Contract, BigNumber, BytesLike } from 'ethers';
import { ERC20 } from '../../typechain/index';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { extractAbi } from 'typechain';
import { ABI_ERC20 } from './abis';
import fs from 'fs-extra';
import path from 'path';

export const T_SUFFIX = '000000000000000000';
export const ONE_TOKEN = '1' + T_SUFFIX;
export const TEN_TOKENS = '10' + T_SUFFIX;
export const FIFTY_TOKENS = '50' + T_SUFFIX;
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
export const STATE_Reported = 5;
export const STATE_FinalApproved = 6;
export const STATE_FinalCanceledBySupplier = 7;
export const STATE_FinalMutualClose = 8;
export const STATE_FinalNoResponse = 9;
export const STATE_FinalDisputeResolvedForSupplier = 10;
export const STATE_FinalDisputeResolvedForEngineer = 11;
export const STATE_FinalDisputeResolvedWithSplit = 12;
export const STATE_FinalDelisted = 13;
export const DISPUTE_RESOLUTION_PCT = 0.06;

export const DEFAULT_REQUIRED_DEPOSIT = FIFTY_TOKENS;
export const BASE_PERCENT = 10000;

export const DEFAULT_JOB_METADATA_CID =
  'bafkxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx000';
export const DEFAULT_REPORT_META_CID =
  'bafkxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx001';
export const DEFAULT_REPORT_RESOLVE_REASON_CID =
  'bafkxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx003';
export const ZERO_ADDRESS = ethers.constants.AddressZero;

// TODO: can be moved to env & env.testnet and called "DAO_STABLE_COIN_ADDRESS"
// polygon mainnet
export const USDC_ADDRESS = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
export const QUICK_SWAP_POLY_ADDRESS =
  '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';

let erc20TokenSetupInstructions: string[];

interface JobMetaData {
  ver?: string;
  name?: string;
  description?: string;
  acceptance?: string;
  contact?: string;
}

export const deployDaoTreasury = async () => {
  const DaoTreasury = await (
    await ethers.getContractFactory('DaoTreasury')
  ).deploy(QUICK_SWAP_POLY_ADDRESS);
  await DaoTreasury.deployed();
  return DaoTreasury;
};

export const deployTestRouter = async () => {
  const TestRouter = await (
    await ethers.getContractFactory('TestRouter')
  ).deploy();
  await TestRouter.deployed();
  return TestRouter;
};

export const deployERC20Token = async (): Promise<ERC20> => {
  const testToken = await (
    await ethers.getContractFactory('TestENGI')
  ).deploy();
  await testToken.deployed();
  return testToken;
};

export const deployJob = async (
  TestENGIToken: ContractTypes.ERC20,
  DaoTreasury: ContractTypes.DaoTreasury,
  resolver: string
) => {
  const _signers = await signers();

  // deploy the job implementation
  const Job = await ethers.getContractFactory('Job');
  const jobImplementation = await Job.deploy();
  await jobImplementation.deployed();

  // deploy the proxy contract
  const JobProxy = await ethers.getContractFactory('JobProxy');
  const calldata = [] as BytesLike; // empty calldata
  const jobProxy = await JobProxy.deploy(
    jobImplementation.address,
    _signers.owner.address,
    calldata
  );

  // Get the job contract at the proxy address
  const job = Job.attach(jobProxy.address);

  // initialize the job contract at the proxy address
  await job.initialize(TestENGIToken.address, DaoTreasury.address, resolver);

  return job;
};

export const readTokensConfig = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    fs.readFile(
      path.join(__dirname, './tokenInstructions.json'),
      'utf8',
      (err, data) => {
        if (err) {
          return resolve([]);
        }

        const content = JSON.parse(data);

        resolve(content);
      }
    );
  });
};

export const setup = async () => {
  const instructions = await readTokensConfig();
  if (instructions && instructions.length > 0) {
    erc20TokenSetupInstructions = instructions;
  }
};

export const executeERC20TokenInstructions = async (
  JobContract: ContractTypes.Job
): Promise<ERC20> => {
  const idToToken: { [id: string]: ERC20 } = {};

  await erc20TokenSetupInstructions.reduce(async (chain, operation) => {
    return chain.then(async () => {
      const [type, id] = operation.split(' ');
      switch (type) {
        case 'add':
          if (idToToken[id]) {
            await updatePaymentTokens(JobContract, idToToken[id].address, true);
          } else {
            const Token = await deployERC20Token();
            idToToken[id] = Token;
            await updatePaymentTokens(JobContract, Token.address, true);
          }
          break;
        case 'remove':
          await updatePaymentTokens(JobContract, idToToken[id].address, false);
          break;
      }
    });
  }, Promise.resolve());

  const [type, idToUse] =
    erc20TokenSetupInstructions[erc20TokenSetupInstructions.length - 1].split(
      ' '
    );
  if (type !== 'use') {
    throw Error("Last instruction must be 'use'");
  }

  const TestToken = idToToken[idToUse];
  if (!TestToken) {
    throw Error("Wrong 'use' ... no such token " + idToToken);
  }
  return TestToken;
};

export const setupJobAndTokenBalances = async () => {
  const _signers = await signers();

  let InitialToken = await deployERC20Token();
  const DaoTreasury = await deployDaoTreasury();
  const JobContract = await deployJob(
    InitialToken,
    DaoTreasury,
    _signers.resolver.address
  );

  let TestToken;
  if (!erc20TokenSetupInstructions) {
    TestToken = InitialToken;
  } else {
    TestToken = await executeERC20TokenInstructions(JobContract);

    // so that we don't distribute InitialToken balanced as well
    await JobContract.setReportToken(TestToken.address);
  }

  await (await JobContract.setDaoTreasury(DaoTreasury.address)).wait();
  await (await JobContract.setResolver(_signers.resolver.address)).wait();

  await (await DaoTreasury.setJobContract(JobContract.address)).wait();
  await (await DaoTreasury.setStableCoin(USDC_ADDRESS)).wait();

  // send balances
  await TestToken.transfer(_signers.supplier.address, ONE_THOUS_TOKENS);
  await TestToken.transfer(_signers.engineer.address, ONE_THOUS_TOKENS);
  await TestToken.transfer(_signers.addr1.address, ONE_THOUS_TOKENS);
  await TestToken.transfer(_signers.addr2.address, ONE_THOUS_TOKENS);
  await TestToken.transfer(_signers.reporter.address, ONE_THOUS_TOKENS);

  // approve the job contract to spend on their behalf
  await TestToken.connect(_signers.supplier).approve(
    JobContract.address,
    ONE_HUND_THOUS_TOKENS
  );
  await TestToken.connect(_signers.engineer).approve(
    JobContract.address,
    ONE_HUND_THOUS_TOKENS
  );
  await TestToken.connect(_signers.addr1).approve(
    JobContract.address,
    ONE_HUND_THOUS_TOKENS
  );
  await TestToken.connect(_signers.addr2).approve(
    JobContract.address,
    ONE_HUND_THOUS_TOKENS
  );
  await TestToken.connect(_signers.reporter).approve(
    JobContract.address,
    ONE_HUND_THOUS_TOKENS
  );

  return { JobContract, TestToken, DaoTreasury };
};

export const updatePaymentTokens = async (
  JobContract: ContractTypes.Job,
  addr: string,
  enable: boolean
): Promise<void> => {
  await JobContract.updatePaymentTokens(addr, enable);
};

export const getAllowedTokens = async (
  JobContract: ContractTypes.Job
): Promise<string[]> => {
  return await JobContract.getAllPaymentTokens();
};

export const getERC20Contract = (addr: string, signer: Signer): ERC20 => {
  return new Contract(addr, ABI_ERC20, signer) as ERC20;
};

export const getERC20Contracts = async (
  addresses: string[]
): Promise<ERC20[]> => {
  const _signers = await signers();

  const contracts: ERC20[] = addresses.map((addr) => {
    return getERC20Contract(addr, _signers.owner);
  });

  return contracts;
};

export const getBalanceOf = async (
  TokenContract: ERC20 | string,
  address: string
): Promise<BigNumber> => {
  if (typeof TokenContract === 'string') {
    const _signers = await signers();
    TokenContract = new Contract(
      TokenContract,
      ABI_ERC20,
      _signers.owner
    ) as ERC20;
  }
  return await TokenContract.balanceOf(address);
};

export const postSampleJob =
  (signer: undefined | Signer = undefined) =>
  async (
    Job: ContractTypes.Job,
    token: ERC20,
    bounty: undefined | string = undefined,
    requiredDeposit: undefined | string = DEFAULT_REQUIRED_DEPOSIT,
    metadataCid: undefined | string = undefined
  ) => {
    if (!signer) {
      signer = (await signers()).supplier;
    }

    if (!metadataCid) {
      metadataCid = DEFAULT_JOB_METADATA_CID;
    }

    // post the job from the supplier address;
    if (!bounty) {
      bounty = toBigNum(100 * 1.1); // $100 + 10%
    }

    const postJobTx = await Job.connect(signer).postJob(
      token.address,
      bounty,
      requiredDeposit,
      metadataCid
    );

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
    deposit = FIFTY_TOKENS; // $50
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

export const reportJob = async (
  Job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).reporter;
  }

  const reportJobTx = await Job.connect(signer).reportJob(
    jobId,
    DEFAULT_REPORT_META_CID
  );

  return reportJobTx;
};

export const acceptReport = async (
  Job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).resolver;
  }

  const acceptReportTx = await Job.connect(signer).acceptReport(
    jobId,
    DEFAULT_REPORT_RESOLVE_REASON_CID
  );

  return acceptReportTx;
};

export const declineReport = async (
  Job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).resolver;
  }

  const declineReportTx = await Job.connect(signer).declineReport(
    jobId,
    DEFAULT_REPORT_RESOLVE_REASON_CID
  );

  return declineReportTx;
};

export const resolveDisputeForSupplier = async (
  Job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).resolver;
  }

  const resolveDisputeForSupplierTx = await Job.connect(
    signer
  ).resolveDisputeForSupplier(jobId);

  return resolveDisputeForSupplierTx;
};

export const resolveDisputeForEngineer = async (
  Job: ContractTypes.Job,
  jobId: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).resolver;
  }

  const resolveDisputeForEngineerTx = await Job.connect(
    signer
  ).resolveDisputeForEngineer(jobId);

  return resolveDisputeForEngineerTx;
};

export const resolveDisputeWithCustomSplit = async (
  Job: ContractTypes.Job,
  jobId: number,
  engineerAmountPct: number,
  signer: Signer | null = null
) => {
  if (signer === null) {
    signer = (await signers()).resolver;
  }

  const resolveDisputeWithCustomSplitTx = await Job.connect(
    signer
  ).resolveDisputeWithCustomSplit(jobId, engineerAmountPct);

  return resolveDisputeWithCustomSplitTx;
};

export const getJobPayouts = async (Job: ContractTypes.Job, jobId: number) => {
  const [forEngineer, forEngineerNoDeposit, forDao] = await Job.getJobPayouts(
    jobId
  );

  return {
    forEngineer,
    forEngineerNoDeposit,
    forDao,
  };
};

export const getDisputePayouts = async (
  Job: ContractTypes.Job,
  jobId: number
) => {
  const [forWinner, forDao] = await Job.getDisputePayouts(jobId);

  return {
    forWinner,
    forDao,
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
  const [owner, resolver, supplier, engineer, reporter, addr1, addr2] =
    await ethers.getSigners();
  return {
    owner,
    resolver,
    supplier,
    engineer,
    reporter,
    addr1,
    addr2,
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
