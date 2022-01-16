import React from 'react';
import { IDataTableItem } from '../interfaces/IDataTableItem';

interface IDataTableItemProps {
  item: IDataTableItem;
}

const DataTableItem: React.FC<IDataTableItemProps> = (props) => {
  const { item } = props;
  const { key, value } = item;

  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{key}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {value}
      </dd>
    </div>
  );
};

export default DataTableItem;