import { CloseJobFormButton } from 'components/single-contract/CloseJobFormButton';
import { useJob } from 'components/smart-contracts/hooks/useJob';
import { useWallet } from 'components/wallet/useWallet';
import React from 'react';
import { addressesMatch } from 'utils/ethereum';
import DataTableItemText from 'components/data-table/row-types/DataTableItemText';

export const CloseJobForm = () => {
  const { job, isLoading } = useJob();

  const { account } = useWallet();

  // do not show if engineer/supplier has already requested the job be closed
  const isEngineer = addressesMatch(account, job?.engineer);
  const isSupplier = addressesMatch(account, job?.supplier);
  const showCloseButton =
    job &&
    ((isEngineer && !job.closedByEngineer) ||
      (isSupplier && !job.closedBySupplier));
  const isFinalCloseButton =
    job &&
    ((isEngineer && job.closedBySupplier) ||
      (isSupplier && job.closedByEngineer));

  return !isLoading && job ? (
    <div className="mt-6 overflow-hidden shadow sm:rounded-md">
      <div className="bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 text-sm font-normal leading-5">
            You may request to close this job. Both parties must agree to close
            the job for the payments to be refunded.
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="border-t border-b border-gray-200 px-4 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <DataTableItemText
              label="Supplier Status"
              value={job.closedBySupplier ? 'Requested closed' : 'Not closed'}
            />
            <DataTableItemText
              label="Engineer Status"
              value={job.closedByEngineer ? 'Requested closed' : 'Not closed'}
            />
          </dl>
        </div>
      </div>
      <div className="bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
            {showCloseButton && (
              <CloseJobFormButton
                label={
                  isFinalCloseButton ? 'Close Job' : 'Request to Close Job'
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
