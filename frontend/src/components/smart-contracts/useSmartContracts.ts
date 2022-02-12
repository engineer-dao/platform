import { SmartContractContext } from 'components/smart-contracts/SmartContractContext';
import { useContext } from 'react';

export const useSmartContracts = () => {
  return useContext(SmartContractContext);
};

export const getEventLogEntry = async () => {};

export { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
