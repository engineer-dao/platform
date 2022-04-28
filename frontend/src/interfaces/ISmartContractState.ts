import { ERC20, Job, TestUSDC, TestENGI } from 'contracts-typechain';

export interface ISmartContractState {
  isERC20Approved: boolean;
  chainIsSupported: boolean;
  walletIsConnected: boolean;
  latestContractEvent: string;
  Job: Job;
  ERC20: ERC20;
  TestENGI?: TestENGI;
  TestUSDC?: TestUSDC;
}
