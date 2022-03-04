import { useJob } from 'components/smart-contracts/hooks/useJob';
import { ResolveEngineerModal } from 'components/smart-contracts/modals/ResolveEngineerModal';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const ResolveForEngineerButton = () => {
  const { job, isLoading } = useJob();
  const history = useHistory();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResolveEngineerModal, setShowResolveEngineerModal] =
    useState(false);

  return !isLoading && job ? (
    <>
      <div className="col-span-6 text-sm font-normal leading-5">
        <div className="font-bold">Option 2</div>
        Resolve this dispute for the engineer. The engineer is awarded the
        bounty and refunded their deposit.
      </div>
      <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
        <button
          onClick={() => {
            setShowResolveEngineerModal(true);
          }}
          disabled={isSubmitting}
          type="submit"
          className={
            'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' +
            (isSubmitting
              ? ' bg-indigo-100 hover:bg-indigo-100'
              : ' bg-indigo-600 hover:bg-indigo-700')
          }
        >
          Resolve For Engineer
        </button>
      </div>

      <ResolveEngineerModal
        jobId={job.id}
        show={showResolveEngineerModal}
        onConfirmed={(jobId: string) => {
          setShowResolveEngineerModal(false);
          // reload
          history.push(`/contract/${jobId}`);
        }}
        onError={() => {
          setIsSubmitting(false);
          setShowResolveEngineerModal(false);
        }}
      />
    </>
  ) : null;
};
