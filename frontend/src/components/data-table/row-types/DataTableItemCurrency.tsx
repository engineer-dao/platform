import classNames from 'classnames';
import React from 'react';
import { IDataTableItemCurrency } from '../../../interfaces/IDataTableItem';
import { StartJobButton } from '../../single-contract/StartJobButton';

const DataTableItemCurrency: React.FC<IDataTableItemCurrency> = (props) => {
  const { label, value, totalRow } = props;

  const { crypto_value, crypto_suffix, fiat_suffix, fiat_value } = value;

  return (
    <div
      className={classNames(
        totalRow && 'bg-gray-50',
        'py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'
      )}
    >
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd
        className={classNames(
          'mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0',
          totalRow && 'text-lg'
        )}
      >
        <div className="flex justify-between">
          <div>
            <span className="font-bold">
              {crypto_value} {crypto_suffix}
            </span>
            &nbsp;({fiat_value} {fiat_suffix})
          </div>
          {!!totalRow && <StartJobButton />}
        </div>
      </dd>
    </div>
  );
};

export default DataTableItemCurrency;
