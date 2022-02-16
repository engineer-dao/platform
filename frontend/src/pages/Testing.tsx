import { useNotifications } from '../components/notifications/useNotifications';

import { useState } from 'react';
import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';

import { ApproveERC20Modal } from 'components/smart-contracts/modals/ApproveERC20Modal';
import { RevokeERC20Modal } from 'components/smart-contracts/modals/RevokeERC20Modal';
import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';

const Dashboard = () => {
  const { pushNotification } = useNotifications();

  const { contracts } = useSmartContracts();

  const [showApproveERC20, setShowApproveERC20] = useState(false);
  const [showRevokeERC20, setShowRevokeERC20] = useState(false);
  const [showSetDaoTreasury, setShowSetDaoTreasury] = useState(false);
  const [daoTreasuryAddress, setDaoTreasuryAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  return (
    <div>
      <h2 className="mb-6">Testing</h2>
      <button
        onClick={() =>
          pushNotification({
            open: true,
            heading: 'Here is a note',
            content: 'This is some text',
          })
        }
      >
        Open Notification
      </button>

      <div className="mt-5">
        Is ERC 20 token approved?
        <pre>{contracts.isERC20Approved ? 'YES' : 'NO'}</pre>
        <pre>{errorMessage}</pre>
      </div>
      <div className="mt-2">
        {!contracts.isERC20Approved && (
          <button
            onClick={() => {
              setShowApproveERC20(true);
            }}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Approve
          </button>
        )}
        {contracts.isERC20Approved && (
          <button
            onClick={() => {
              setShowRevokeERC20(true);
            }}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Revoke
          </button>
        )}
      </div>

      <div className="mt-5">
        <div>Set Dao Treasury</div>
        <div>
          <input
            type="text"
            size={45}
            value={daoTreasuryAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setDaoTreasuryAddress(e.target.value);
            }}
          />
          <button
            onClick={() => {
              setShowSetDaoTreasury(true);
            }}
            type="button"
            className="focus:outline-none ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Set Address
          </button>
        </div>
        <TransactionModal
          title="Complete Job"
          onConfirmed={() => {}}
          show={showSetDaoTreasury}
          callContract={async () => {
            return contracts.Job.setDaoTreasury(daoTreasuryAddress);
          }}
          onFinish={() => {
            setShowSetDaoTreasury(false);
          }}
          onError={(error: string) => {
            setErrorMessage(error);
          }}
        />
      </div>

      <ApproveERC20Modal
        show={showApproveERC20}
        onFinish={() => setShowApproveERC20(false)}
        onError={(error) => setErrorMessage(error)}
      />
      <RevokeERC20Modal
        show={showRevokeERC20}
        onFinish={() => setShowRevokeERC20(false)}
      />
    </div>
  );
};

export default Dashboard;
