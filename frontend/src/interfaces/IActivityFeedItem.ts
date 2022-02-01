import { ContractStatus } from 'enums/ContractStatus';

export interface IActivityFeedItem {
  id: string;
  type: 'message' | 'status';
  person?: {
    name?: string;
    href?: string;
  };
  status?: keyof typeof ContractStatus;
  imageUrl?: string;
  message?: string;
  date?: string;
  address?: string;
  created_at?: string;
}
