import classNames from 'classnames';
import React from 'react';
import { IDataTableItemChips } from '../../../interfaces/IDataTableItem';
import { IListBoxItem } from '../../../interfaces/IListBoxItem';

const DataTableItemChips: React.FC<IDataTableItemChips> = (props) => {
  const { label, value, chipColor = 'bg-green-200 text-green-800' } = props;

  return (
    <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="align-self mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        <div className="flex flex-wrap">
          {(Array.isArray(value) ? value : ([value] as any[]))?.map(
            (item: IListBoxItem, index: number) => (
              <span
                key={index}
                className={classNames(
                  'mr-2 mb-1 flex items-center justify-center rounded-full px-3 py-0.5 text-center text-sm font-medium sm:mb-0',
                  chipColor
                )}
              >
                <div>{item.name}</div>
              </span>
            )
          )}
        </div>
      </dd>
    </div>
  );
};

export default DataTableItemChips;
