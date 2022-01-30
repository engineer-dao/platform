import { WalletContext } from 'components/wallet/WalletContext';
import { useEffect, useContext } from 'react';
import { SmartContractState } from 'components/smart-contracts/SmartContractContext';
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
  contracts: SmartContractState,
  contract: BaseContract,
  buildFilter: () => EventFilter | undefined,
  handlerCallback: Listener
) => {
  useEffect(() => {
    // attach
    const filter = buildFilter();
    if (filter) {
      contract.on(filter, handlerCallback);
    }
    return () => {
      // detach
      const filter = buildFilter();
      if (filter) {
        contract.off(filter, handlerCallback);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contracts]);
};
