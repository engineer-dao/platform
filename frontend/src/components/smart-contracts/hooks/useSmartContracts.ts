import { SmartContractContext } from 'components/smart-contracts/SmartContractContext';
import { CallOverrides } from 'ethers';
import { useContext, useEffect, useState } from 'react';

export const useSmartContracts = () => {
  return useContext(SmartContractContext);
};

// calls a smart contract method and returns the result
export const useSmartContractCall = <ResultType>(
  contractMethod: (overrides?: CallOverrides) => Promise<ResultType>
): [callResult: ResultType | undefined, isLoading: boolean] => {
  const [isLoading, setIsLoading] = useState(true);
  const [callResult, setCallResult] = useState<ResultType | undefined>(
    undefined
  );

  useEffect(() => {
    const _callContract = async () => {
      const result = await contractMethod.call(this);
      setCallResult(result);
      setIsLoading(false);
    };

    _callContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractMethod]);

  return [callResult, isLoading];
};

export const getEventLogEntry = async () => {};

export { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
