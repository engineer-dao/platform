import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { JobVariables } from 'enums/JobVariables';
import { useEffect, useState } from 'react';

// load a variable by name from the Job smart contract
export const useJobContractVariable = <ResultType>(
  contractVariable: JobVariables
): [callResult: ResultType | undefined, isLoading: boolean] => {
  const { contracts } = useSmartContracts();

  const [isLoading, setIsLoading] = useState(true);
  const [callResult, setCallResult] = useState<ResultType | undefined>(
    undefined
  );

  useEffect(() => {
    const _callContract = async () => {
      switch (contractVariable) {
        case JobVariables.MINIMUM_BOUNTY:
          setCallResult(
            (await contracts.Job.MINIMUM_BOUNTY()) as unknown as ResultType
          );
          break;

        case JobVariables.MINIMUM_DEPOSIT:
          setCallResult(
            (await contracts.Job.MINIMUM_DEPOSIT()) as unknown as ResultType
          );
          break;

        case JobVariables.DAO_FEE:
          setCallResult(
            (await contracts.Job.DAO_FEE()) as unknown as ResultType
          );
          break;

        case JobVariables.RESOLUTION_FEE_PERCENTAGE:
          setCallResult(
            (await contracts.Job.RESOLUTION_FEE_PERCENTAGE()) as unknown as ResultType
          );
          break;

        case JobVariables.MINIMUM_SPLIT_CHUNK_PERCENTAGE:
          setCallResult(
            (await contracts.Job.MINIMUM_SPLIT_CHUNK_PERCENTAGE()) as unknown as ResultType
          );
          break;

        case JobVariables.COMPLETED_TIMEOUT_SECONDS:
          setCallResult(
            (await contracts.Job.COMPLETED_TIMEOUT_SECONDS()) as unknown as ResultType
          );
          break;

        case JobVariables.REPORT_DEPOSIT:
          setCallResult(
            (await contracts.Job.REPORT_DEPOSIT()) as unknown as ResultType
          );
          break;

        case JobVariables.REPORT_TOKEN:
          setCallResult(
            (await contracts.Job.REPORT_TOKEN()) as unknown as ResultType
          );
          break;

        case JobVariables.REPORT_REWARD_PERCENT:
          setCallResult(
            (await contracts.Job.REPORT_REWARD_PERCENT()) as unknown as ResultType
          );
          break;

        case JobVariables.daoTreasury:
          setCallResult(
            (await contracts.Job.daoTreasury()) as unknown as ResultType
          );
          break;

        case JobVariables.disputeResolver:
          setCallResult(
            (await contracts.Job.disputeResolver()) as unknown as ResultType
          );
          break;

        case JobVariables.jobCount:
          setCallResult(
            (await contracts.Job.jobCount()) as unknown as ResultType
          );
          break;
      }
      setIsLoading(false);
    };

    _callContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractVariable]);

  return [callResult, isLoading];
};
