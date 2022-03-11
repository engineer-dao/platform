import { formatDateTime } from 'utils/date';
import { useJob } from 'components/smart-contracts/hooks/useJob';
import { useSmartContractCallback } from 'components/smart-contracts/hooks/useSmartContractCall';
import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { TimeoutJobModal } from 'components/smart-contracts/modals/TimeoutJobModal';
import { BigNumber } from 'ethers';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const TimeoutJobForm = () => {
  const { job } = useJob();
  const history = useHistory();

  const { contracts } = useSmartContracts();

  // get the job timeout
  const [jobTimeoutSeconds, timeoutLoading] =
    useSmartContractCallback<BigNumber>(() => {
      return contracts.Job.COMPLETED_TIMEOUT_SECONDS();
    });

  // do job timeout math
  const jobTimeoutMs =
    job?.completedTime && jobTimeoutSeconds
      ? (job.completedTime + jobTimeoutSeconds.toNumber()) * 1000
      : 0;
  const jobIsTimedOut = jobTimeoutMs > 0 && jobTimeoutMs < Date.now();

  const [showTimeoutJobModal, setShowTimeoutJobModal] = useState(false);

  return job && !timeoutLoading ? (
    <div
      className="mt-6 overflow-hidden shadow sm:rounded-md"
      style={showTimeoutJobModal ? { opacity: 0.5 } : {}}
    >
      <div className="bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 text-sm font-normal leading-5">
            {!jobIsTimedOut ? (
              <>
                If the supplier does not respond before
                <span className="font-bold">
                  {' ' + formatDateTime(new Date(jobTimeoutMs))}
                </span>
                , you may mark this job complete and receive payment.
              </>
            ) : (
              <>You may mark this job complete and receive payment.</>
            )}
          </div>
          <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
            <button
              onClick={() => {
                setShowTimeoutJobModal(true);
              }}
              disabled={!jobIsTimedOut || showTimeoutJobModal}
              type="submit"
              className={
                'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:ring-offset-2' +
                (!jobIsTimedOut || showTimeoutJobModal
                  ? ' bg-green-100 hover:bg-green-100'
                  : ' bg-green-600 hover:bg-green-700')
              }
            >
              Receive Payment
            </button>

            <TimeoutJobModal
              jobId={job.id}
              show={showTimeoutJobModal}
              onConfirmed={(jobId: string) => {
                setShowTimeoutJobModal(false);
                // reload
                history.push(`/contract/${jobId}`);
              }}
              onError={() => {
                setShowTimeoutJobModal(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
