import { useEffect, useState } from 'react';
import { IJobData } from '../../../interfaces/IJobData';
import { IJobFilter } from '../../../interfaces/IJobFilter';
import { filterJobs, loadJobFromJobId } from '../../../services/jobs';
import { useSmartContracts } from './useSmartContracts';

export const useJobs = (jobFilter?: IJobFilter) => {
  const { contracts } = useSmartContracts();
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

    if (contracts.chainIsSupported) {
      fetchJobs()
        .then((jobs) => setJobs(jobs))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [contracts.chainIsSupported, contracts, jobFilter]);

  return {
    jobs,
    isLoading,
  };
};
