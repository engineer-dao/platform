import { useEffect, useState } from 'react';
import { IJobData } from '../../../interfaces/IJobData';
import { IJobFilter } from '../../../interfaces/IJobFilter';
import { loadJobFromJobId, filterJobs } from '../../../services/jobs';
import { useWallet } from '../../wallet/useWallet';
import { useSmartContracts } from './useSmartContracts';

export const useJobs = (jobFilter?: IJobFilter) => {
  const { contracts } = useSmartContracts();
  const { account, chainIsSupported } = useWallet();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<IJobData[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const highestJobCount = (await contracts.Job.jobCount()).toNumber();

      const allJobs = [] as IJobData[];

      for (
        let jobIdInteger = 1;
        jobIdInteger <= highestJobCount;
        ++jobIdInteger
      ) {
        const jobData = await loadJobFromJobId(String(jobIdInteger), contracts);

        if (jobData) {
          allJobs.push(jobData);
        }
      }

      return filterJobs(allJobs, jobFilter);
    };

    if (account && chainIsSupported) {
      fetchJobs()
        .then((jobs) => setJobs(jobs))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [account, chainIsSupported, contracts, jobFilter]);

  return {
    jobs,
    isLoading,
  };
};
