import { IJobState } from 'interfaces/IJobData';

export interface IActivityFeedItem {
  id: string;
  type: 'message' | 'status';
  person?: {
    name?: string;
    href?: string;
  };
  status?: IJobState;
  imageUrl?: string;
  message?: string;
  date?: string;
  address?: string;
  created_at?: string;
}
