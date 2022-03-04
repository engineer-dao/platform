import { ChatAltIcon, UserCircleIcon } from '@heroicons/react/solid';
import { IActivityFeedItem } from 'interfaces/IActivityFeedItem';
import { randomChars } from 'utils/random';

interface ContractUpdateProps {
  activityItem: IActivityFeedItem;
}

export const ContractUpdate: React.FC<ContractUpdateProps> = ({
  activityItem,
}) => {
  return activityItem.message ? (
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
        <div>
          <div className="text-sm">
            <a
              href={activityItem?.person?.href}
              className="font-medium text-gray-900"
            >
              {activityItem?.person?.name || activityItem?.address}
            </a>
          </div>
          {activityItem?.date && (
            <p className="mt-0.5 text-sm text-gray-500">
              Updated on {activityItem.date}
            </p>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-900">
          <span className="text-md inline-flex items-center rounded-full bg-gray-600 px-3 py-1 px-2 py-0.5 text-sm font-medium text-white">
            {activityItem?.message}
          </span>
        </div>
      </div>
    </>
  ) : null;
};
