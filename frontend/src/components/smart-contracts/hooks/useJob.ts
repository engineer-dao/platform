import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { useWallet } from 'components/wallet/useWallet';
import { IJobData } from 'interfaces/IJobData';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addressesMatch } from 'utils/ethereum';
import { ISingleContractRouteParams } from '../../../interfaces/routes/ISingleContractRouteParams';
import { loadJobFromJobId } from '../../../services/jobs';

export const useJob = (
  jobId?: string
): { job: IJobData | undefined; isLoading: boolean } => {
  const { id } = useParams<ISingleContractRouteParams>();
  const { contracts } = useSmartContracts();
  const { account } = useWallet();
  const [job, setJob] = useState<IJobData>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () =>
      await loadJobFromJobId(jobId || id || '', contracts);

    if ((jobId || id) && account && contracts) {
      fetchJob()
        .then((job) => setJob(job))
        .finally(() => setIsLoading(false));
    }
  }, [jobId, account, contracts, id]);

  return {
    job,
    isLoading,
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

export const useAccountIsJobContractOwner = (): [
  isOwner: boolean,
  isLoading: boolean
] => {
  const { contracts } = useSmartContracts();
  const { account } = useWallet();
  const { job, isLoading: jobIsLoading } = useJob();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const _checkContractOwner = async () => {
      if (job) {
        const owner = await contracts.Job.owner();
        setIsOwner(addressesMatch(account, owner));
      }
    };

    _checkContractOwner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  return [isOwner, jobIsLoading];
};
