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

  const updateBalance = async (account: string | null) => {
    if (account) {
      const _balance = await getWalletBalance(account);
      setWalletBalance(_balance.substring(0, 9));
    } else {
      setWalletBalance(undefined);
    }
  };

  useEffect(() => {
    updateBalance(account);
  }, [account]);

  return (
    <>
      {/* button */}
      <div>
        {connected ? (
          // wallet is connected
          <button
            onClick={() => disconnectWallet()}
            className="border:gray-700 w-100 whitespace-nowrap rounded-lg border-2 py-2 px-3 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white"
          >
            <div className="flex w-full">
              {providerInfo && providerInfo.logo && (
                <img
                  className="mr-2 w-6"
                  src={providerInfo.logo}
                  alt="MetaMask"
                ></img>
              )}
              <div>
                {account ? shortenAddress(utils.getAddress(account)) : ''}
                {walletBalance && <> | {walletBalance} ETH</>}
              </div>
            </div>
          </button>
        ) : (
          // wallet is not connected
          <button
            onClick={connectToWallet}
            className="border:gray-700 w-100 whitespace-nowrap rounded-lg border-2 py-2 px-3 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white"
          >
            <div className="w-full">Connect Wallet</div>
          </button>
        )}
      </div>
    </>
  );
};
