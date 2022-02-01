import { IActivityFeedItem } from 'interfaces/IActivityFeedItem';
import { ChatAltIcon } from '@heroicons/react/solid';
import { randomChars } from '../../../utils/random';

interface CommentProps {
  activityItem: IActivityFeedItem;
}

const Comment: React.FC<CommentProps> = ({ activityItem }) => {
  return (
    <>
      <div className="relative">
        <img
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
          src={
            activityItem?.imageUrl ||
            `https://avatars.dicebear.com/api/micah/${randomChars(4)}.svg`
          }
          alt="Anon Avatar"
        />

        <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
          <ChatAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div>
          <div className="text-sm">
            <a
              href={activityItem?.person?.href}
              className="font-medium text-gray-900"
            >
              {activityItem?.person?.name || activityItem?.address}
            </a>
          </div>
          {activityItem?.created_at && (
            <p className="mt-0.5 text-sm text-gray-500">
              Commented {new Date(activityItem?.created_at).toDateString()}
            </p>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-700">
          <p>{activityItem?.message}</p>
        </div>
      </div>
    </>
  );
};

export default Comment;
