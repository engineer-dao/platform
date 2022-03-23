import { useActivityFeed } from 'components/activity-feed/hooks/useActivityFeed';
import { ActivityType } from 'enums/ActivityType';
import Comment from './activity-types/Comment';
import { ContractUpdate } from './activity-types/ContractUpdate';
import LoadingSkeleton from './activity-types/Loading';
import { StatusChange } from './activity-types/StatusChange';
import NewMessage from './NewMessage';
import { useAccountCanPostNewMessage } from 'components/activity-feed/hooks/useNewMessage';
import classNames from 'classnames';

const ActivityFeed = () => {
  const { loading, error, activityItems } = useActivityFeed();
  const [canPost] = useAccountCanPostNewMessage();

  return loading ? (
    <LoadingSkeleton />
  ) : activityItems.length || canPost ? (
    <div className="mt-4 flow-root overflow-hidden border-t border-gray-200 bg-white p-4 shadow sm:rounded-lg sm:px-6 sm:py-5">
      <ul>
        {!loading &&
          !error &&
          activityItems.map((activityItem, index) => {
            const isNotLastItem = index !== activityItems.length - 1;

            return (
              <li key={activityItem.id}>
                <div
                  className={classNames('relative', {
                    'pb-8': isNotLastItem,
                  })}
                >
                  {isNotLastItem ? (
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
      {canPost && <NewMessage />}
    </div>
  ) : null;
};

export default ActivityFeed;
