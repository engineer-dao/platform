import React from 'react';
import { IDataTableItemActions } from 'interfaces/IDataTableItem';
import { useJob } from '../../smart-contracts/hooks/useJob';
import { useWallet } from '../../wallet/useWallet';
import { JobState } from '../../../enums/JobState';
import { CancelJobButton } from '../../single-contract/CancelJobButton';
import { StartJobButton } from '../../single-contract/StartJobButton';

const DataTableItemActions: React.FC<IDataTableItemActions> = (props) => {
  const { label, value } = props;

  const { crypto_value, crypto_suffix, fiat_suffix, fiat_value } = value;

  const { job } = useJob();
  const wallet = useWallet();

  const isSupplier =
    (wallet.account || '').toLowerCase() ===
    (job?.supplier || '').toLowerCase();

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
          {isSupplier && job?.state === JobState.Available ? (
            <CancelJobButton />
          ) : job?.state === JobState.Available ? (
            <StartJobButton />
          ) : null}
        </div>
      </dd>
    </div>
  );
};

export default DataTableItemActions;
