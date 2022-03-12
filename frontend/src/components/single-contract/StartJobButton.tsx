import { PlayIcon, ThumbUpIcon } from '@heroicons/react/solid';
import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { ApproveERC20Modal } from 'components/smart-contracts/modals/ApproveERC20Modal';
import { StartJobModal } from 'components/smart-contracts/modals/StartJobModal';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useJob } from '../smart-contracts/hooks/useJob';

export const StartJobButton: React.FC = () => {
  const { job } = useJob();

  const history = useHistory();

  const { contracts } = useSmartContracts();

  const [showApproveERC20Modal, setShowApproveERC20Modal] = useState(false);
  const [showStartJobModal, setShowStartJobModal] = useState(false);

  const handleButton = () => {
    setShowStartJobModal(true);
  };

  return job ? (
    contracts.isERC20Approved ? (
      <>
        <button
          type="submit"
          onClick={() => handleButton()}
          className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Accept
        </button>

        <StartJobModal
          jobId={job?.id}
          deposit={job?.requiredDeposit}
          show={showStartJobModal}
          onConfirmed={(jobId: string) => {
            setShowStartJobModal(false);
            // reload
            history.push(`/contract/${jobId}`);
          }}
          onError={() => {
            setShowStartJobModal(false);
          }}
        />
      </>
    ) : contracts.walletIsConnected ? (
      <>
        <button
          onClick={() => {
            setShowApproveERC20Modal(true);
          }}
          type="button"
          className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ThumbUpIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Approve Spending
        </button>

        <ApproveERC20Modal
          show={showApproveERC20Modal && !contracts.isERC20Approved}
          onFinish={() => setShowApproveERC20Modal(false)}
        />
      </>
    ) : null
  ) : null;
};
