import { IActivityFeedItem } from 'interfaces/IActivityFeedItem';

export type ActivityFeedById = {
  [uuid: string]: IActivityFeedItem;
};

export interface IEventActivity {
  type: string;
  created_at: string;
  args?: any;
}
