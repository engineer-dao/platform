import { activity } from 'mocks/activityFeed';
import Comment from './activity-types/Comment';
import { StatusChange } from './activity-types/StatusChange';

const ActivityFeed = () => {
  return (
    <div className="flow-root bg-white shadow overflow-hidden sm:rounded-lg border-t border-gray-200 mt-4 p-4 sm:px-6 sm:py-5">
      <ul role="list" className="-mb-8">
        {activity.map((activityItem, index) => (
          <li key={activityItem.id}>
            <div className="relative pb-8">
              {index !== activity.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                {activityItem.type === 'comment' ? (
                  <Comment activityItem={activityItem} />
                ) : activityItem.type === 'status' ? (
                  <StatusChange activityItem={activityItem} />
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
