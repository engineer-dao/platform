import { IActivityFeedById } from 'components/activity-feed/interfaces/IActivityFeedById';

export const sortActivityFeedByIdToArray = (
  activityFeedById: IActivityFeedById
) => {
  return Object.keys(activityFeedById)
    .map((uuid) => activityFeedById[uuid])
    .sort((a, b) => {
      const a_date = a.date || '';
      const b_date = b.date || '';
      if (a_date > b_date) {
        return 1;
      } else if (a_date < b_date) {
        return -1;
      } else {
        // when dates are the same, sort StatusChange (2) before ContractUpdate (3)
        return b.type - a.type;
      }
    });
};
