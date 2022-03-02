import React from 'react';
import { IDataTableItemText } from '../../../interfaces/IDataTableItem';

const DataTableItemText: React.FC<IDataTableItemText> = (props) => {
  const { label, value } = props;

  return value ? (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {value}
      </dd>
    </div>
  ) : null;
};

export default DataTableItemText;
