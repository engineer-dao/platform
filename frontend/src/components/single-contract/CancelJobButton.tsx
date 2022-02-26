import { PlayIcon } from '@heroicons/react/solid';
import { CancelJobModal } from 'components/smart-contracts/modals/CancelJobModal';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSingleContract } from './context/useSingleContract';

export const CancelJobButton: React.FC = () => {
  const { data } = useSingleContract();

  const history = useHistory();

  const [showCancelJobModal, setShowCancelJobModal] = useState(false);

  const handleButton = () => {
    setShowCancelJobModal(true);
  };

  return data ? (
    <>
      <button
        type="submit"
        onClick={() => handleButton()}
        className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <PlayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Cancel Job
      </button>

      <CancelJobModal
        jobId={data.id}
        show={showCancelJobModal}
        onConfirmed={(jobId: string) => {
          setShowCancelJobModal(false);
          // reload
          history.push(`/contract/${jobId}`);
        }}
        onError={() => {
          setShowCancelJobModal(false);
        }}
      />
    </>
  ) : null;
};
