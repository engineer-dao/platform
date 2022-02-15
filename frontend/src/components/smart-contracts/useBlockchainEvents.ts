import { useEffect } from 'react';
import { BaseContract, EventFilter } from 'ethers';
import { Listener } from '@ethersproject/providers';

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
