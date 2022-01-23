import { useState, useEffect, useContext } from 'react';
import { utils } from 'ethers';
import { WalletContext } from 'contexts/WalletContext';
import { IMetaMaskError } from 'interfaces/IMetaMaskError';
import metamaskLogo from 'assets/img/metamask.svg';
import { getWalletBalance, shortenAddress } from 'utils/ethereum';

export const WalletConnectionStatus = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { walletConnection, setWalletConnection } = useContext(WalletContext);
  const [walletBalance, setWalletBalance] = useState<string | undefined>();

  const getBalance = async (balance: string) => {
    const _balance = await getWalletBalance(balance);

    setWalletBalance(_balance);
  };

  useEffect(() => {
    // on load, try and connect the current wallet
    initWallet();
  });

  useEffect(() => {
    walletConnection?.account && getBalance(walletConnection.account);
  }, [walletConnection]);

  const initWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((result: Array<string>) => {
          if (result.length > 0) {
            accountChangedHandler(result[0]);
          }
        })
        .catch((error: IMetaMaskError) => {
          // Some unexpected error.
          console.error(`Metamask returned error: ${error.message}`);
          setErrorMessage(error.message);
        });

      // handle account change
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  };

  function handleAccountsChanged(accounts: Array<string>) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      setErrorMessage('MetaMask has disconnected');
      accountChangedHandler('');
    } else if (accounts[0] !== walletConnection.account) {
      accountChangedHandler(accounts[0]);
    }
  }

  const connectWalletHandler = () => {
    if (window.ethereum) {
      setErrorMessage('');
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result: Array<string>) => {
          if (result.length > 0) {
            accountChangedHandler(result[0]);
          }
        })
        .catch((error: IMetaMaskError) => {
          let msg = error.message;
          if (error.code === 4001) {
            msg = 'You canceled the request. Please try again.';
          }
          setErrorMessage(msg);
        });
    } else {
      // MetaMask is not installed
      setErrorMessage('Please install MetaMask');
    }
  };

  const accountChangedHandler = (newAccount: string) => {
    if (newAccount !== walletConnection.account) {
      if (newAccount.length > 0) {
        setWalletConnection({
          connected: true,
          account: newAccount,
          provider: 'metamask',
        });
      } else {
        setWalletConnection({
          connected: false,
          account: '',
          provider: '',
        });
      }
    }
  };

  return (
    <>
      {/* button */}
      <div>
        {walletConnection.connected ? (
          // wallet is connected
          <button className="rounded-lg border-2 border:gray-700 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white py-2 px-3 w-100 whitespace-nowrap">
            <div className="flex w-full">
              <img className="w-6 mr-2" src={metamaskLogo} alt="MetaMask"></img>
              <div>
                {shortenAddress(utils.getAddress(walletConnection.account))} |{' '}
                {walletBalance} ETH
              </div>
            </div>
          </button>
        ) : (
          // wallet is not connected
          <button
            onClick={connectWalletHandler}
            className="rounded-lg border-2 border:gray-700 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white py-2 px-3 w-100 whitespace-nowrap"
          >
            <div className="w-full">Connect Wallet</div>
          </button>
        )}
      </div>

      {/* error message */}
      {errorMessage && (
        // display the error message
        <div className="my-2 py-2 px-3 bg-red-800 rounded-lg">
          <p className="font-medium text-white">{errorMessage}</p>
        </div>
      )}
    </>
  );
};
