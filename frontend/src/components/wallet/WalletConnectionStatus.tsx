import { useState, useEffect, useContext } from 'react';
import { utils } from 'ethers';
import { WalletContext } from 'contexts/WalletContext';
import { getWalletBalance, shortenAddress } from 'utils/ethereum';

export const WalletConnectionStatus = () => {
  const { walletConnection, connectToWallet } = useContext(WalletContext);
  const [walletBalance, setWalletBalance] = useState<string | undefined>();

  const getBalance = async (balance: string) => {
    const _balance = await getWalletBalance(balance);

    setWalletBalance(_balance);
  };

  useEffect(() => {
    walletConnection?.account && getBalance(walletConnection.account);
  }, [walletConnection]);

  return (
    <>
      {/* button */}
      <div>
        {walletConnection.connected ? (
          // wallet is connected
          <button className="rounded-lg border-2 border:gray-700 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white py-2 px-3 w-100 whitespace-nowrap">
            <div className="flex w-full">
              {walletConnection.providerInfo &&
                walletConnection.providerInfo.logo && (
                  <img
                    className="w-6 mr-2"
                    src={walletConnection.providerInfo.logo}
                    alt="MetaMask"
                  ></img>
                )}
              <div>
                {shortenAddress(
                  utils.getAddress(walletConnection.account || '')
                )}
                {walletBalance && <> | {walletBalance} ETH</>}
              </div>
            </div>
          </button>
        ) : (
          // wallet is not connected
          <button
            onClick={connectToWallet}
            className="rounded-lg border-2 border:gray-700 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white py-2 px-3 w-100 whitespace-nowrap"
          >
            <div className="w-full">Connect Wallet</div>
          </button>
        )}
      </div>
    </>
  );
};
