import { TypedEvent } from 'contracts-typechain/common';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { useEffect, useState } from 'react';

export const useContractEvents = (contracts: ISmartContractState) => {
  const [latestContractEvent, setLatestContractEvent] = useState('');

  // update the latest contract event when any activity happens on the Job address
  const onEventHandler = (contractEvent: TypedEvent<any>) => {
    setLatestContractEvent(
      [
        contractEvent.blockHash,
        contractEvent.transactionHash,
        contractEvent.logIndex,
      ].join('/')
    );
  };

  useEffect(() => {
    contracts.Job.on('*', onEventHandler);
    return () => {
      contracts.Job.off('*', onEventHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contracts.Job]);

  return { latestContractEvent };
};
