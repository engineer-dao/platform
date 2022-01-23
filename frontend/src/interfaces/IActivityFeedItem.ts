import { ContractStatus } from 'enums/ContractStatus';

export interface IActivityFeedItem {
  id: string;
  type: 'comment' | 'status';
  person: {
    name: string;
    href: string;
  };
  status?: keyof typeof ContractStatus;
  imageUrl?: string;
  comment?: string;
  date?: string;
}
