import React from 'react';
import { IDataTableItemActions } from 'interfaces/IDataTableItem';

const DataTableItemActions: React.FC<IDataTableItemActions> = (props) => {
  const { label, value, button } = props;

  const { crypto_value, crypto_suffix, fiat_suffix, fiat_value } = value;

  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-lg text-gray-900 sm:col-span-2 sm:mt-0">
        <div className="flex justify-between">
          <div>
            <span className="font-bold">
              {crypto_value} {crypto_suffix}
            </span>
            {fiat_value && (
              <>
                &nbsp;({fiat_value} {fiat_suffix})
              </>
            )}
          </div>
          {button}
        </div>
      </dd>
    </div>
  );
};

export default DataTableItemActions;
