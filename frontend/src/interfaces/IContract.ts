import { ContractStatus } from '../enums/ContractStatus';

interface IContractOwnership {
  supplier_address: string;
  engineer_address?: string;
  due_date: Date;
  started_at?: Date;
  ended_at?: Date;
}

export interface IContract {
  id: string;
  title: string;
  bounty: number;
  bounty_suffix: string;
  buy_in: number;
  buy_in_suffix: string;
  timeframe: string;
  status: keyof typeof ContractStatus;
  technologies: string[];
  testing_type: string[];
  anon_type: string[];
  ownership: IContractOwnership;
}
