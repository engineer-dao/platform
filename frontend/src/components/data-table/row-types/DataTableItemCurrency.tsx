import React from 'react';
import { IDataTableItemCurrency } from '../../../interfaces/IDataTableItem';

const DataTableItemCurrency: React.FC<IDataTableItemCurrency> = (props) => {
  const { label, value } = props;

  const { crypto_value, crypto_suffix, fiat_suffix, fiat_value } = value;

  return (
    <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
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
        </div>
      </dd>
    </div>
  );
};

export default DataTableItemCurrency;
