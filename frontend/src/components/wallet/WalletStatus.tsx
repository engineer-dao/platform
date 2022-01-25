import { useState, useEffect } from 'react';
import { utils } from 'ethers';
import { getWalletBalance, shortenAddress } from 'utils/ethereum';
import { useWallet } from './useWallet';

export const WalletConnectionStatus = () => {
  const {
    account,
    connected,
    providerInfo,
    connectToWallet,
    disconnectWallet,
  } = useWallet();
  const [walletBalance, setWalletBalance] = useState<string | undefined>();

  const getBalance = async (account: string) => {
    const _balance = await getWalletBalance(account);

    setWalletBalance(_balance);
  };

  useEffect(() => {
    account && getBalance(account);
  }, [account]);

  return (
    <>
      {/* button */}
      <div>
        {connected ? (
          // wallet is connected
          <button
            onClick={() => disconnectWallet()}
            className="rounded-lg border-2 border:gray-700 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white py-2 px-3 w-100 whitespace-nowrap"
          >
            <div className="flex w-full">
              {providerInfo && providerInfo.logo && (
                <img
                  className="w-6 mr-2"
                  src={providerInfo.logo}
                  alt="MetaMask"
                ></img>
              )}
              <div>
                {shortenAddress(utils.getAddress(account || ''))}
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
