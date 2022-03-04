import DataTableItemText from 'components/data-table/row-types/DataTableItemText';
import { DisputeJobFormButton } from 'components/single-contract/DisputeJobFormButton';
import { useJob } from 'components/smart-contracts/hooks/useJob';
import { useWallet } from 'components/wallet/useWallet';
import { JobState } from 'enums/JobState';
import React from 'react';
import { addressesMatch } from 'utils/ethereum';

export const DisputeJobForm = () => {
  const { job, isLoading } = useJob();

  const { account } = useWallet();

  // do not show if engineer/supplier has already requested the job be closed
  const isSupplier = addressesMatch(account, job?.supplier);
  const showDisputeButton =
    job &&
    isSupplier &&
    (job.state === JobState.Started || job.state === JobState.Completed);

  const showDisputeStatus = job && job.state === JobState.Disputed;

  return !isLoading && job ? (
    <div className="mt-6 overflow-hidden shadow sm:rounded-md">
      <div className="bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 text-sm font-normal leading-5">
            As the supplier, you may request to dispute this job. A dispute will
            be resolved with one or both parties receiving payments. Read more
            about{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://engineerdao.notion.site/Dispute-Resolution-5536124a81b84bf68a4c673f6a70bd66"
              className="underline"
            >
              dispute resolution
            </a>
            .
          </div>
        </div>
      </div>
      {showDisputeStatus && (
        <div className="bg-white">
          <div className="border-t border-b border-gray-200 px-4 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <DataTableItemText label="Dispute Status" value="In Review" />
            </dl>
          </div>
        </div>
      )}
      <div className="bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
            {showDisputeButton && <DisputeJobFormButton label="Dispute Job" />}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
