import { IActivityFeedById } from 'components/activity-feed/interfaces/IActivityFeedById';
import { applyMessagesToActivityFeedById } from 'components/activity-feed/utils/commentActivity';
import { applyEventsToActivityFeedById } from 'components/activity-feed/utils/eventActivity';
import { sortActivityFeedByIdToArray } from 'components/activity-feed/utils/sortActivity';
import { useJob } from 'components/smart-contracts/hooks/useJob';
import { useList } from 'react-firebase-hooks/database';
import { contractDatabaseRef } from 'services/firebase';

export const useActivityFeed = () => {
  const { job, isLoading: jobIsLoading } = useJob();
  const activityFeedById: IActivityFeedById = {};

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
