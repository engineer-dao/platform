import classNames from 'classnames';
import React from 'react';
import { IDataTableItem } from '../../../interfaces/IDataTableItem';

const DataTableItemChips: React.FC<IDataTableItem> = (props) => {
  const { label, value, chipColor } = props;

  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        <div className="flex">
          {(Array.isArray(value) ? value : [value])?.map((item: string) => (
            <span
              className={classNames(
                chipColor,
                'mr-2 px-3 py-0.5 rounded-full text-sm font-medium bg-green-200 text-green-800'
              )}
            >
              {item}
            </span>
          ))}
        </div>
      </dd>
    </div>
  );
};

export default DataTableItemChips;
