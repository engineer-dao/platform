import { JobState } from 'enums/JobState';
import { ActivityType } from 'enums/ActivityType';

export interface IActivityFeedItem {
  id: string;
  type: ActivityType;
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
