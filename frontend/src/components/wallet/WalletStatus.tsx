import { utils } from 'ethers';
import { shortenAddress } from 'utils/ethereum';
import { useWallet } from './useWallet';

export const WalletConnectionStatus = () => {
  const {
    account,
    connected,
    providerInfo,
    connectToWallet,
    disconnectWallet,
  } = useWallet();

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
                {shortenAddress(utils.getAddress(account || ''))}
                <br />
                <p className="text-xs">Disconnect</p>
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
