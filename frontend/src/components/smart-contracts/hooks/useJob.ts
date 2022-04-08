import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { JobContext } from 'components/smart-contracts/JobContext';
import { useWallet } from 'components/wallet/useWallet';
import { IJobData } from 'interfaces/IJobData';
import { useContext, useEffect, useState } from 'react';
import { addressesMatch } from 'utils/ethereum';

export const useJob = (): { job: IJobData | undefined; isLoading: boolean } => {
  const jobContext = useContext(JobContext);
  return {
    job: jobContext.job,
    isLoading: jobContext.loading,
  };
};

export const useAccountIsJobContractDisputeResolver = (): [
  isDisputeResolver: boolean,
  isLoading: boolean
] => {
  const { contracts } = useSmartContracts();
  const { account } = useWallet();
  const { job, isLoading: jobIsLoading } = useJob();
  const [isDisputeResolver, setIsDisputeResolver] = useState(false);

  useEffect(() => {
    const _checkContractDisputeResolver = async () => {
      if (job) {
        const disputeResolver = await contracts.Job.disputeResolver();
        setIsDisputeResolver(addressesMatch(account, disputeResolver));
      }
    };

    _checkContractDisputeResolver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  return [isDisputeResolver, jobIsLoading];
};
