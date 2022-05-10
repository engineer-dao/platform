import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { ApproveENGIModal } from 'components/smart-contracts/modals/ApproveENGIModal';
import { RevokeENGIModal } from 'components/smart-contracts/modals/RevokeENGIModal';
import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import { useEffect, useState } from 'react';
import { walletAddToken } from 'utils/metamask';
import { useNotifications } from '../components/notifications/useNotifications';
import { syncEvents } from 'services/activityFeed';
import { ApproveUSDCModal } from '../components/smart-contracts/modals/ApproveUSDCModal';
import { RevokeUSDCModal } from '../components/smart-contracts/modals/RevokeUSDCModal';

const Dashboard = () => {
  const { pushNotification } = useNotifications();

  const { contracts } = useSmartContracts();

  const [showApproveENGI, setShowApproveENGI] = useState(false);
  const [showRevokeENGI, setShowRevokeENGI] = useState(false);
  const [showApproveUSDC, setShowApproveUSDC] = useState(false);
  const [showRevokeUSDC, setShowRevokeUSDC] = useState(false);
  const [showSetDaoTreasury, setShowSetDaoTreasury] = useState(false);
  const [daoTreasuryAddress, setDaoTreasuryAddress] = useState('');
  const [showENGIFaucet, setShowENGIFaucet] = useState(false);
  const [showUSDCFaucet, setShowUSDCFaucet] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [whitelisted, setWhitelisted] = useState<string[]>([]);

  useEffect(() => {
    contracts.Job.getAllPaymentTokens &&
      contracts.Job.getAllPaymentTokens()
        .then((item: string[]) => {
          setWhitelisted(item);
        })
        .catch((error) => console.log('this happen: ', error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contracts.Job.getAllPaymentTokens]);

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
        Is ENGI token approved?
        <pre>{contracts.isENGIApproved ? 'YES' : 'NO'}</pre>
        <pre>{errorMessage}</pre>
      </div>
      <div className="mt-2">
        {!contracts.isENGIApproved && (
          <button
            onClick={() => {
              setShowApproveENGI(true);
            }}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Approve
          </button>
        )}
        {contracts.isENGIApproved && (
          <button
            onClick={() => {
              setShowRevokeENGI(true);
            }}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Revoke
          </button>
        )}
      </div>
      <div className="mt-5">
        Is USDC token approved?
        <pre>{contracts.isUSDCApproved ? 'YES' : 'NO'}</pre>
        <pre>{errorMessage}</pre>
      </div>
      <div className="mt-2">
        {!contracts.isUSDCApproved && (
          <button
            onClick={() => {
              setShowApproveUSDC(true);
            }}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Approve
          </button>
        )}
        {contracts.isUSDCApproved && (
          <button
            onClick={() => {
              setShowRevokeUSDC(true);
            }}
            type="button"
            className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Revoke
          </button>
        )}
      </div>
      <div className="mt-5">
        Whitelisted Tokens
        {whitelisted.map((item) => (
          <pre>{item}</pre>
        ))}
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

      <div className="mt-5">
        <div>Token Faucet</div>
        <div>
          <button
            onClick={() => {
              setShowENGIFaucet(true);
            }}
            type="button"
            className="focus:outline-none mb-2 ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Get ENGI Tokens
          </button>
        </div>

        <div>
          <button
            onClick={() => {
              setShowUSDCFaucet(true);
            }}
            type="button"
            className="focus:outline-none mb-2 ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Get USDC Tokens
          </button>
        </div>

        <div>
          <button
            onClick={async () => {
              walletAddToken(
                String(process.env.REACT_APP_ENGI_TOKEN_ADDRESS),
                'ENGI',
                String(process.env.REACT_APP_PAYMENT_TOKEN_IMG_URL),
                parseInt(String(process.env.REACT_APP_PAYMENT_TOKEN_DECIMALS))
              );
            }}
            type="button"
            className="focus:outline-none mb-2 ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Add ENGI Token to Wallet
          </button>
        </div>

        <div>
          <button
            onClick={async () => {
              walletAddToken(
                String(process.env.REACT_APP_USDC_TOKEN_ADDRESS),
                'USDC',
                String(process.env.REACT_APP_PAYMENT_TOKEN_IMG_URL),
                parseInt(String(process.env.REACT_APP_PAYMENT_TOKEN_DECIMALS))
              );
            }}
            type="button"
            className="focus:outline-none mb-2 ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Add USDC Token to Wallet
          </button>
        </div>

        <TransactionModal
          title="Get ENGI Tokens"
          onConfirmed={() => {}}
          show={showENGIFaucet}
          callContract={async () => {
            return contracts.TestENGI?.requestTokens();
          }}
          onFinish={() => {
            setShowENGIFaucet(false);
          }}
          onError={(error: string) => {
            setErrorMessage(error);
          }}
        />

        <TransactionModal
          title="Get USDC Tokens"
          onConfirmed={() => {}}
          show={showUSDCFaucet}
          callContract={async () => {
            return contracts.TestUSDC?.requestTokens();
          }}
          onFinish={() => {
            setShowUSDCFaucet(false);
          }}
          onError={(error: string) => {
            setErrorMessage(error);
          }}
        />
      </div>

      <div className="mt-5">
        <div>Test Refresh</div>
        <div>
          <button
            onClick={() => {
              syncEvents();
            }}
            type="button"
            className="focus:outline-none ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Refresh Contract Events
          </button>
        </div>
      </div>

      <ApproveENGIModal
        show={showApproveENGI}
        onFinish={() => setShowApproveENGI(false)}
        onError={(error: any) => setErrorMessage(error)}
      />
      <RevokeENGIModal
        show={showRevokeENGI}
        onFinish={() => setShowRevokeENGI(false)}
      />
      <ApproveUSDCModal
        show={showApproveUSDC}
        onFinish={() => setShowApproveUSDC(false)}
        onError={(error: any) => setErrorMessage(error)}
      />
      <RevokeUSDCModal
        show={showRevokeUSDC}
        onFinish={() => setShowRevokeUSDC(false)}
      />
    </div>
  );
};

export default Dashboard;
