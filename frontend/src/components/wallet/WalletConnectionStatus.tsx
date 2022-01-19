import { useState } from 'react';
import { utils } from 'ethers';
import metamaskLogo from '../../assets/img/metamask.svg';

declare const window: Window &
  typeof globalThis & {
    ethereum: any;
  };

const WalletConnectionStatus = () => {
  const [defaultAccount, setDefaultAccount] = useState('');
  const [shortAddress, setShortAddress] = useState('');

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result: Array<string>) => {
          accountChangedHandler(result[0]);
        });
    } else {
      // need better error handling...
      alert('Please install MetaMask');
    }
  };

  const accountChangedHandler = (newAccount: string) => {
    setDefaultAccount(newAccount);
    setShortAddress(shorten(utils.getAddress(newAccount)));
  };

  const shorten = (fullAddress: string) => {
    return (
      fullAddress.substring(0, 6) +
      '...' +
      fullAddress.substring(fullAddress.length - 4)
    );
  };

  return (
    <div className="rounded-lg border-2 border:gray-700 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white py-2 px-3 w-min whitespace-nowrap">
      {defaultAccount ? (
        <button className="flex">
          <img className="w-6 mr-2" src={metamaskLogo} alt="MetaMask" />
          <span className="pr-6">{shortAddress}</span>
        </button>
      ) : (
        <button onClick={connectWalletHandler} className="btn">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnectionStatus;
