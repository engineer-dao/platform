import { ChevronRightIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React from 'react';

const SkeletonContractItem = (props: { opacity: string | number }) => {
  const { opacity } = props;

  return (
    <li
      className={classNames(
        'col-span-1 animate-pulse divide-y divide-gray-200 rounded-lg bg-white shadow',
        {
          [`opacity-${String(opacity)}`]: opacity,
        }
      )}
    >
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        {/* Left section */}
        <div className="flex-1 truncate">
          <div className="flex flex-col items-start">
            <div className="mb-6 h-6 w-full rounded-sm bg-gray-100 py-4" />
            <div className="mt-1 h-6 w-full rounded-sm bg-gray-100 py-4" />
          </div>
        </div>

        {/* Right section */}
        <div className="flex-0 truncate">
          <span className="inline-flex h-10 w-20 items-center rounded-full bg-gray-100 px-4 py-1 text-lg font-medium" />
        </div>
        <div className="ml-5 flex-shrink-0">
          <ChevronRightIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </li>
  );
};

export default SkeletonContractItem;
