import { ActivityType } from 'enums/ActivityType';
import { DataSnapshot } from 'firebase/database';
import { ActivityFeedById } from '../activity';
import { formatDateTime } from './date';

export const applyMessagesToActivityFeedById = (
  activityFeedById: ActivityFeedById,
  messageSnapshots: DataSnapshot[]
) => {
  messageSnapshots.forEach((snapshot) => {
    if (snapshot.key) {
      const value = snapshot.val();
      const date = new Date(value.created_at);

      activityFeedById[snapshot.key] = {
        id: snapshot.key,
        type: ActivityType.Message,
        date: formatDateTime(date),
        ...value,
      };
    }
  });
  return activityFeedById;
};
