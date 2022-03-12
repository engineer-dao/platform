import { ERC20, TestERC20, Job } from 'contracts-typechain';

export interface ISmartContractState {
  isERC20Approved: boolean;
  chainIsSupported: boolean;
  walletIsConnected: boolean;
  Job: Job;
  ERC20: ERC20;
  TestERC20?: TestERC20;
}
