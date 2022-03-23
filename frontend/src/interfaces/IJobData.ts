import { JobState } from 'enums/JobState';
import { BigNumber } from 'ethers';
import { IListBoxItem } from './IListBoxItem';

export interface IJobSmartContractData {
  supplier: string;
  bounty: BigNumber;
  engineer: string;
  deposit: BigNumber;
  requiredDeposit: BigNumber;
  startTime: BigNumber;
  completedTime: BigNumber;
  closedBySupplier: boolean;
  closedByEngineer: boolean;
  state: number;
}

export interface IJobMetaData {
  version: number;
  title: string;
  description: string;
  contactInformation: string;
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
  requiredDeposit: number;
  startTime?: number;
  completedTime?: number;
  closedBySupplier: boolean;
  closedByEngineer: boolean;
  state: JobState;
}

export interface IJobData extends IJobMetaData, IFormattedJobSmartContractData {
  id: string;
  ipfsCid?: string;
  paymentTokenName: string;
}

export interface IIPFSJobMetaData {
  version: number;
  title: string;
  description: string;
  contactInformation: string;
  acceptanceCriteria: string;
  labels: string[];
  identity: string[];
  acceptanceTests: string[];
  endDate: string;
}
