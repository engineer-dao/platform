import { JobState } from 'enums/JobState';
import { BigNumber } from 'ethers';
import { IListBoxItem } from './IListBoxItem';

export interface IJobSmartContractData {
  supplier: string;
  bounty: BigNumber;
  engineer: string;
  deposit: BigNumber;
  depositPct: BigNumber;
  startTime: BigNumber;
  completedTime: BigNumber;
  closedBySupplier: boolean;
  closedByEngineer: boolean;
  state: number;
}

export interface IJobMetaData {
  title: string;
  description: string;
  requiredDeposit: number;
  acceptanceCriteria: string;
  labels: IListBoxItem[];
  identity: IListBoxItem[];
  acceptanceTests: IListBoxItem[];
  endDate: string;
}

export interface IFormattedJobSmartContractData {
  supplier: string;
  engineer?: string;
  bounty: number;
  deposit: number;
  depositPct: number;
  formattedDepositPct: string;
  startTime?: number;
  completedTime?: number;
  closedBySupplier: boolean;
  closedByEngineer: boolean;
  state: JobState;
}


export interface IJobData extends IJobMetaData, IFormattedJobSmartContractData {
  id: string;

  paymentTokenName: string;
}
