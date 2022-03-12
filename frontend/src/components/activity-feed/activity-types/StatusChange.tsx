import { IActivityFeedItem } from 'interfaces/IActivityFeedItem';
import { UserCircleIcon } from '@heroicons/react/solid';
import { ChatAltIcon } from '@heroicons/react/solid';
import StatusChip from 'components/single-contract/StatusChip';
import { randomChars } from 'utils/random';

interface StatusChangeProps {
  activityItem: IActivityFeedItem;
}

export const StatusChange: React.FC<StatusChangeProps> = ({ activityItem }) => {
  return activityItem.status ? (
    <>
      {activityItem?.address ? (
        <div className="relative">
          <img
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
            src={
              activityItem?.imageUrl ||
              `https://avatars.dicebear.com/api/micah/${randomChars(
                4,
                activityItem?.address
              )}.svg`
            }
            alt="Anon Avatar"
          />

          <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
            <ChatAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </div>
      ) : (
        <div>
          <div className="relative px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
              <UserCircleIcon
                className="h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 py-1.5">
        <div className="text-sm text-gray-500">
          {activityItem?.person?.name || activityItem?.address ? (
            <>
              <a
                href={activityItem?.person?.href}
                className="font-medium text-gray-900"
              >
                {activityItem?.person?.name || activityItem?.address}
              </a>
            </>
          ) : null}
        </div>
        {!!activityItem?.date && (
          <div className="mt-0.5 flex align-middle text-sm text-gray-500">
            <p className="mt-0.5 mr-1">Changed status to</p>
            <div className="text-sm text-gray-700">
              <StatusChip state={activityItem.status} size="small" />
            </div>
            <p className="ml-1 mt-0.5">on {activityItem?.date}</p>
          </div>
        )}
        {!!activityItem?.message && (
          <div className="mt-2 text-sm text-gray-700">
            <p>{activityItem?.message}</p>
          </div>
        )}
      </div>
    </>
  ) : null;
};
