import { SupportedTokens } from '../../../enums/SupportedTokens';
import { IListBoxItem } from '../../../interfaces/IListBoxItem';

export interface ICreateContractForm {
  title: string;
  description: string;
  contactInformation: string;
  acceptanceCriteria: string;
  bounty: string;
  labels: IListBoxItem[];
  identity: IListBoxItem[];
  acceptanceTests: IListBoxItem[];
  requiredDeposit: string;
  endDate: string;
  token: SupportedTokens;
}
