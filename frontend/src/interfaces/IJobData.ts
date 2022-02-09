// import { ContractStatus } from '../enums/ContractStatus';
import { BigNumber } from 'ethers';

export enum IJobState {
  Available = 1,
  Started = 2,
  Completed = 3,
  Disputed = 4,
  FinalApproved = 5,
  FinalCanceledBySupplier = 6,
  FinalMutualClose = 7,
  FinalNoResponse = 8,
  FinalDisputeResolvedForSupplier = 9,
  FinalDisputeResolvedForEngineer = 10,
  FinalDisputeResolvedWithSplit = 11,
}

export const JobStateLabels = {
  1: 'Available',
  2: 'Started',
  3: 'Completed',
  4: 'Disputed',
  5: 'Finalized and Paid',
  6: 'Canceled By Supplier',
  7: 'Closed by Mutual Agreement',
  8: 'Abandoned with no Response',
  9: 'Dispute Resolved for Supplier',
  10: 'Dispute Resolved for Engineer',
  11: 'Dispute Resolved with Split',
};

export interface IJobSmartContractData {
  supplier: string;
  bounty: BigNumber;
  engineer: string;
  deposit: BigNumber;
  startTime: BigNumber;
  completedTime: BigNumber;
  closedBySupplier: boolean;
  closedByEngineer: boolean;
  state: number;
}

export interface IJobMetaData {
  title: string;
  description: string;
  buyIn: number;
  acceptanceCriteria: string;

  // timeframe: string;
  // status: keyof typeof ContractStatus;
  // technologies: string[];
  // testing_type: string[];
  // anon_type: string[];
  // ownership: IContractOwnership;
}

export interface IJobData extends IJobMetaData {
  id: string;

  supplier: string;
  engineer?: string;
  bounty: number;
  deposit: number;
  startTime?: number;
  completedTime?: number;
  closedBySupplier: boolean;
  closedByEngineer: boolean;
  state: IJobState;
}
