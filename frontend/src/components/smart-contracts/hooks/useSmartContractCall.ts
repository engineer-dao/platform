import { useEffect, useState, useCallback } from 'react';

type CallContractCallback = () => Promise<any>;

export const useSmartContractCallback = <ResultType>(
  callContract: CallContractCallback,
  callbackDeps = []
): [callResult: ResultType | undefined, isLoading: boolean] => {
  const [isLoading, setIsLoading] = useState(true);
  const [callResult, setCallResult] = useState<ResultType | undefined>(
    undefined
  );

  useEffect(() => {
    const _callContract = async () => {
      setCallResult(await callContract());
      setIsLoading(false);
    };

    _callContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCallback(callContract, callbackDeps)]);

  return [callResult, isLoading];
};
