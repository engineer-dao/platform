import { useActivityFeed } from 'components/activity-feed/hooks/useActivityFeed';
import { ActivityType } from 'enums/ActivityType';
import Comment from './activity-types/Comment';
import { ContractUpdate } from './activity-types/ContractUpdate';
import { StatusChange } from './activity-types/StatusChange';
import NewMessage from './NewMessage';

const ActivityFeed = () => {
  const { loading, error, activityItems } = useActivityFeed();

  return (
    <div className="mt-4 flow-root overflow-hidden border-t border-gray-200 bg-white p-4 shadow sm:rounded-lg sm:px-6 sm:py-5">
      <ul className="-mb-8">
        {!loading &&
          !error &&
          activityItems.map((activityItem, index) => {
            return (
              <li key={activityItem.id}>
                <div className="relative pb-8">
                  {index !== activityItems.length - 1 ? (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    {activityItem.type === ActivityType.Message && (
                      <Comment activityItem={activityItem} />
                    )}
                    {activityItem.type === ActivityType.StatusChange && (
                      <StatusChange activityItem={activityItem} />
                    )}
                    {activityItem.type === ActivityType.ContractUpdate && (
                      <ContractUpdate activityItem={activityItem} />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
      <NewMessage />
    </div>
  );
};

export default ActivityFeed;
