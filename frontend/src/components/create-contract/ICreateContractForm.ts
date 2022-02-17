import { IListBoxItem } from '../../interfaces/IListBoxItem';

export interface ICreateContractForm {
  title: string;
  description: string;
  acceptanceCriteria: string;
  bounty: string;
  labels: IListBoxItem[];
  identity: IListBoxItem[];
  acceptanceTests: IListBoxItem[];
  deposit: string;
  endDate: string;
}
