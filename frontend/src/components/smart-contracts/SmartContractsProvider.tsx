import React, { useMemo } from 'react';
import { SmartContractContext } from 'components/smart-contracts/SmartContractContext';
import { buildSmartContractState } from 'components/smart-contracts/utils/smartContracts';
import { ISmartContractState } from 'interfaces/ISmartContractState';
import { useWallet } from 'components/wallet/useWallet';
import { useContractEvents } from 'components/smart-contracts/hooks/useContractEvents';
import { useENGIApproval } from './hooks/useENGIEvents';
import { useUSDCApproval } from './hooks/useUSDCEvents';

export const SmartContractsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // connect the contracts using the wallet when the wallet state changes
  const wallet = useWallet();

  const initialContracts: ISmartContractState = useMemo(() => {
    return buildSmartContractState(wallet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  // listen to ERC20 token approval status when the blockchain changes
  const { isENGIApproved, setIsENGIApproved } = useENGIApproval(
    wallet,
    initialContracts
  );

  const { isUSDCApproved, setIsUSDCApproved } = useUSDCApproval(
    wallet,
    initialContracts
  );

  // listen for any blockchain events on the smart contract address
  const { latestContractEvent } = useContractEvents(initialContracts);

  // merge in the ERC20 status
  const contracts = {
    ...initialContracts,
    isENGIApproved,
    isUSDCApproved,
    latestContractEvent,
  };

  // create a context to pass down
  const smartContractsContext = {
    contracts: contracts,
    updateENGIApproval: setIsENGIApproved,
    updateUSDCApproval: setIsUSDCApproved,
  };

  return (
    <SmartContractContext.Provider value={smartContractsContext}>
      {children}
    </SmartContractContext.Provider>
  );
};
