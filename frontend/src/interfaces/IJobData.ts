import { JobState } from 'enums/JobState';
import { BigNumber } from 'ethers';

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
  state: JobState;
}
