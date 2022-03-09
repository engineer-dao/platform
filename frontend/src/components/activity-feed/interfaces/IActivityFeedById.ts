import { IActivityFeedItem } from 'interfaces/IActivityFeedItem';

export interface IActivityFeedById {
  [uuid: string]: IActivityFeedItem;
}
