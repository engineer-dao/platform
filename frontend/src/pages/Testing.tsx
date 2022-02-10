import { useNotifications } from '../components/notifications/useNotifications';

import { useState } from 'react';
import { useSmartContracts } from 'components/smart-contracts/useSmartContracts';

import { ApproveERC20Modal } from 'components/smart-contracts/ApproveERC20Modal';
import { RevokeERC20Modal } from 'components/smart-contracts/RevokeERC20Modal';

import { useMoralis } from 'react-moralis';

const Dashboard = () => {
  const { pushNotification } = useNotifications();

  const { contracts } = useSmartContracts();

  const [showApproveERC20, setShowApproveERC20] = useState(false);
  const [showRevokeERC20, setShowRevokeERC20] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const {
    authenticate,
    isAuthenticated,
    enableWeb3,
    isWeb3Enabled,
    web3EnableError,
  } = useMoralis();

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

      <ApproveERC20Modal
        show={showApproveERC20}
        onFinish={() => setShowApproveERC20(false)}
        onError={(error) => setErrorMessage(error)}
      />
      <RevokeERC20Modal
        show={showRevokeERC20}
        onFinish={() => setShowRevokeERC20(false)}
      />

      <div className="mt-5">
        <div>
          <div>
            <button
              className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => enableWeb3()}
            >
              enableWeb3
            </button>
          </div>
          <div>
            <button
              className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => authenticate()}
            >
              authenticate
            </button>
          </div>
          <div>
            <pre>isAuthenticated: {JSON.stringify(isAuthenticated)}</pre>
            {/*<pre>user: {JSON.stringify(user, null, 2)}</pre>*/}

            <pre>isWeb3Enabled: {JSON.stringify(isWeb3Enabled)}</pre>
            <pre>web3EnableError: {JSON.stringify(web3EnableError)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
