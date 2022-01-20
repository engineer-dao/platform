import classNames from 'classnames';
import React from 'react';
import { IDataTableItemChips } from '../../../interfaces/IDataTableItem';

const DataTableItemChips: React.FC<IDataTableItemChips> = (props) => {
  const { label, value, chipColor = 'bg-green-200 text-green-800' } = props;

  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 align-self">
        <div className="flex flex-wrap">
          {(Array.isArray(value) ? value : ([value] as any[]))?.map(
            (item: string, index: number) => (
              <span
                key={index}
                className={classNames(
                  'mr-2 mb-1 sm:mb-0 px-3 py-0.5 rounded-full text-sm font-medium flex items-center justify-center text-center',
                  chipColor
                )}
              >
                <div>{item}</div>
              </span>
            )
          )}
        </div>
      </dd>
    </div>
  );
};

export default DataTableItemChips;
