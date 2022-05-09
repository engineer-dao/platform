import { ERC20, TestENGI, TestUSDC, Job } from 'contracts-typechain';

export interface ISmartContractState {
  isENGIApproved: boolean;
  isUSDCApproved: boolean;
  chainIsSupported: boolean;
  walletIsConnected: boolean;
  latestContractEvent: string;
  Job: Job;
  ENGIToken: ERC20;
  USDCToken: ERC20;
  TestENGI: TestENGI;
  TestUSDC: TestUSDC;
}
