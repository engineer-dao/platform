import { useJob } from 'components/smart-contracts/hooks/useJob';
import { useList } from 'react-firebase-hooks/database';
import { contractDatabaseRef } from 'services/firebase';
import { ActivityFeedById } from './activity';
import { applyMessagesToActivityFeedById } from './utils/commentActivity';
import { applyEventsToActivityFeedById } from './utils/eventActivity';

export const useActivityFeed = () => {
  const { job, isLoading: jobIsLoading } = useJob();
  const activityFeedById: ActivityFeedById = {};

  // load events from firebase
  const eventsDbRef = job ? contractDatabaseRef(`${job.id}/events`) : null;
  const [eventSnapshots, eventsAreLoading, eventListError] =
    useList(eventsDbRef);

  // load messages from firebase
  const messagesDbRef = job ? contractDatabaseRef(`${job.id}/messages`) : null;
  const [messageSnapshots, messagesAreLoading, messageListError] =
    useList(messagesDbRef);

  // update the activity feed with events
  if (job && eventSnapshots) {
    applyEventsToActivityFeedById(activityFeedById, job, eventSnapshots);
  }

  // update the activity feed with messages
  if (job && messageSnapshots) {
    applyMessagesToActivityFeedById(activityFeedById, messageSnapshots);
  }

  // convert to array and sort by time
  const activityItems = sortActivityFeedByIdToArray(activityFeedById);

  return {
    loading: jobIsLoading || eventsAreLoading || messagesAreLoading,
    error: eventListError || messageListError,
    activityItems,
  };
};

const sortActivityFeedByIdToArray = (activityFeedById: ActivityFeedById) => {
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
