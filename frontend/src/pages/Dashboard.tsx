import { useWallet } from 'components/wallet/useWallet';
import { utils } from 'ethers';
import { useMemo } from 'react';

const Dashboard = () => {
  const { provider, account } = useWallet();

  const signer = useMemo(() => provider?.getSigner(), [provider]);

  const buttonClick = async () => {
    const message = 'hello ser';
    const sig = await signer?.signMessage(message);
    const address = utils.getAddress(account || '');

    const response = await fetch('http://localhost:4000/api/activity/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sig, address, message }),
    });

    console.log(await response.json());
  };

  return (
    <div>
      <h2 className="mb-6">Dashboard</h2>
      <button
        onClick={buttonClick}
        className="focus:outline-none rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Sign Message
      </button>
    </div>
  );
};

export default Dashboard;
