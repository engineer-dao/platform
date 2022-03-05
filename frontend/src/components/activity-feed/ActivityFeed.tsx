import { ref } from 'firebase/database';
import { useList } from 'react-firebase-hooks/database';
import { useParams } from 'react-router-dom';
import { ISingleContractRouteParams } from '../../interfaces/routes/ISingleContractRouteParams';
import { database } from '../../services/firebase';
import Comment from './activity-types/Comment';
import { StatusChange } from './activity-types/StatusChange';
import NewMessage from './NewMessage';

const ActivityFeed = () => {
  const { id } = useParams<ISingleContractRouteParams>();

  const dbRef = ref(database, `messages/${id}`);

  const [snapshots, loading, error] = useList(dbRef);

  return (
    <div className="mt-4 flow-root overflow-hidden border-t border-gray-200 bg-white p-4 shadow sm:rounded-lg sm:px-6 sm:py-5">
      <ul className="-mb-8">
        {!loading &&
          !error &&
          snapshots?.map((snapshot, index) => {
            const activityItem = snapshot.val();

            return (
              <li key={snapshot.key}>
                <div className="relative pb-8">
                  {index !== snapshots?.length - 1 ? (
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
            );
          })}
      </ul>
      <NewMessage />
    </div>
  );
};

export default ActivityFeed;
