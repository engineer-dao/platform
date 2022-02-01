import { IActivityFeedItem } from 'interfaces/IActivityFeedItem';
import { UserCircleIcon } from '@heroicons/react/solid';
import StatusChip from 'components/single-contract/StatusChip';

interface StatusChangeProps {
  activityItem: IActivityFeedItem;
}

export const StatusChange: React.FC<StatusChangeProps> = ({ activityItem }) => {
  return activityItem.status ? (
    <>
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
      <div className="min-w-0 flex-1 py-1.5">
        <div className="text-sm text-gray-500">
          <a
            href={activityItem?.person?.href}
            className="font-medium text-gray-900"
          >
            {activityItem?.person?.name}
          </a>{' '}
          changed status to{' '}
          <StatusChip status={activityItem.status} size="small" />{' '}
          <span className="whitespace-nowrap">{activityItem.date}</span>
        </div>
      </div>
    </>
  ) : null;
};
