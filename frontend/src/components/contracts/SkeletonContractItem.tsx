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
        <div className="h-10 w-10 rounded-full bg-gray-100 py-4" />
        <div className="w-full bg-gray-100 py-4" />
      </div>
    </li>
  );
};

export default SkeletonContractItem;
