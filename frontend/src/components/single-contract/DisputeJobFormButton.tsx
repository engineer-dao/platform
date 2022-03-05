import { useJob } from 'components/smart-contracts/hooks/useJob';
import { DisputeJobModal } from 'components/smart-contracts/modals/DisputeJobModal';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface IDisputeJobFormButtonProps {
  label?: string;
}

export const DisputeJobFormButton: React.FC<IDisputeJobFormButtonProps> = (
  props
) => {
  const { label } = props;
  const { job, isLoading } = useJob();
  const history = useHistory();

  const [showDisputeJobModal, setShowDisputeJobModal] = useState(false);

  return job && !isLoading ? (
    <div style={showDisputeJobModal ? { opacity: 0.5 } : {}}>
      <button
        disabled={showDisputeJobModal}
        onClick={() => setShowDisputeJobModal(true)}
        type="submit"
        className={
          'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2' +
          (showDisputeJobModal
            ? ' bg-red-100 hover:bg-red-100'
            : ' bg-red-600 hover:bg-red-700')
        }
      >
        {label || 'Close Job'}
      </button>

      <DisputeJobModal
        jobId={job.id}
        show={showDisputeJobModal}
        onConfirmed={(jobId: string) => {
          setShowDisputeJobModal(false);
          // reload
          history.push(`/contract/${jobId}`);
        }}
        onError={() => {
          setShowDisputeJobModal(false);
        }}
      />
    </div>
  ) : null;
};
