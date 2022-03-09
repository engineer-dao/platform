import { IActivityFeedById } from 'components/activity-feed/interfaces/IActivityFeedById';
import { ActivityType } from 'enums/ActivityType';
import { DataSnapshot } from 'firebase/database';
import { formatDateTime } from 'utils/date';

export const applyMessagesToActivityFeedById = (
  activityFeedById: IActivityFeedById,
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
