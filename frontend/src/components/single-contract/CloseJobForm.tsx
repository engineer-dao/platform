import { CloseJobFormButton } from 'components/single-contract/CloseJobFormButton';
import { useWallet } from 'components/wallet/useWallet';
import React from 'react';
import { addressesMatch } from 'utils/ethereum';
import { useSingleContract } from './context/useSingleContract';

export const CloseJobForm = () => {
  const { data: job } = useSingleContract();

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

  return job ? (
    <div className="mt-6 overflow-hidden shadow sm:rounded-md">
      <div className="bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 text-sm font-normal leading-5">
            You may request to close this job. Both parties must agree to close
            the job for the payments to be refunded.
          </div>
        </div>
        <div className="mt-4 grid grid-cols-12 gap-6">
          <div className="col-span-6 text-center text-sm font-normal leading-5">
            <div className="font-bold">Supplier Status</div>
            {job.closedBySupplier ? (
              <div className="font-bold text-green-600">
                Supplier has requested job to be closed
              </div>
            ) : (
              <div className="font-bold text-gray-500">
                Not Closed By Supplier
              </div>
            )}
          </div>
          <div className="col-span-6 text-center text-sm font-normal leading-5">
            <div className="font-bold">Engineer Status</div>
            {job.closedByEngineer ? (
              <div className="font-bold text-green-600">
                Engineer has requested job to be closed
              </div>
            ) : (
              <div className="font-bold text-gray-500">
                Not Closed By Engineer
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-6 gap-6">
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
