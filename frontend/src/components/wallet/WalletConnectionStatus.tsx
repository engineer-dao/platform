import { useState, useEffect, useContext } from 'react';
import { utils } from 'ethers';
import { WalletContext } from 'lib/wallet/WalletContext';
import metamaskLogo from 'assets/img/metamask.svg';

declare const window: Window &
  typeof globalThis & {
    ethereum: any;
  };

interface MetaMaskError {
  code: number;
  message: string;
}

export const WalletConnectionStatus = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [defaultAccount, setDefaultAccount] = useState('');
  const [shortAddress, setShortAddress] = useState('');
  const { walletConnection, setWalletConnection } = useContext(WalletContext);

  useEffect(() => {
    // on load, try and connect the current wallet
    initWallet();
  });

  const initWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((result: Array<string>) => {
          if (result.length > 0) {
            accountChangedHandler(result[0]);
          }
        })
        .catch((error: MetaMaskError) => {
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
    } else if (accounts[0] !== defaultAccount) {
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
        .catch((error: MetaMaskError) => {
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
    if (newAccount !== defaultAccount) {
      setDefaultAccount(newAccount);

      if (newAccount.length > 0) {
        setShortAddress(shorten(utils.getAddress(newAccount)));
        setWalletConnection({
          connected: true,
          account: newAccount,
          provider: 'metamask',
        });
      } else {
        setShortAddress('');
        setWalletConnection({
          connected: false,
          account: '',
          provider: '',
        });
      }
    }
  };

  const shorten = (fullAddress: string) => {
    return (
      fullAddress.substring(0, 6) +
      '...' +
      fullAddress.substring(fullAddress.length - 4)
    );
  };

  return (
    <div>
      <div className="rounded-lg border-2 border:gray-700 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white py-2 px-3 w-min whitespace-nowrap">
        {defaultAccount ? (
          <button className="flex">
            <img className="w-6 mr-2" src={metamaskLogo} alt="MetaMask"></img>
            <span className="pr-6">{shortAddress}</span>
          </button>
        ) : (
          // wallet is not connected
          <button onClick={connectWalletHandler} className="btn">
            Connect Wallet
          </button>
        )}
      </div>
      {errorMessage && (
        // display the error message
        <div className="my-2 py-2 px-3 bg-red-800 rounded-lg">
          <p className="font-medium text-white">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
