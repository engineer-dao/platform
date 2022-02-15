import { ERC20, Job } from 'contracts-typechain';

export interface ISmartContractState {
  isERC20Approved: boolean;
  Job: Job;
  ERC20: ERC20;
}
