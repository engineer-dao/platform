import { WalletContext } from 'components/wallet/WalletContext';
import { useEffect, useContext } from 'react';
import { BaseContract, EventFilter } from 'ethers';
import { Listener } from '@ethersproject/providers';

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('No Contract Context Found');
  }
  return context;
};

export const useBlockchainEventFilter = (
  contract: BaseContract,
  filter: EventFilter,
  handlerCallback: Listener
) => {
  useEffect(() => {
    // attach
    contract.on(filter, handlerCallback);
    return () => {
      // detach
      contract.off(filter, handlerCallback);
    };
  }, [contract, filter, handlerCallback]);
};
