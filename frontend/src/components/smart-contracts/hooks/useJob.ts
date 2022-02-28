import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { useWallet } from 'components/wallet/useWallet';
import { IJobData } from 'interfaces/IJobData';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
