import { JobState } from 'enums/JobState';

export interface IActivityFeedItem {
  id: string;
  type: 'message' | 'status';
  person?: {
    name?: string;
    href?: string;
  };
  status?: JobState;
  imageUrl?: string;
  message?: string;
  date?: string;
  address?: string;
  created_at?: string;
}
