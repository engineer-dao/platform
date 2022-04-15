import { useEffect, useState } from 'react';
import { IJobData } from '../../../interfaces/IJobData';
import { IJobFilter } from '../../../interfaces/IJobFilter';
import { filterJobs, loadJobFromJobId } from '../../../services/jobs';
import { useSmartContracts } from './useSmartContracts';

export const useJobs = (jobFilter?: IJobFilter) => {
  const { contracts } = useSmartContracts();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<IJobData[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setFetching(true);

      const highestJobCount = (await contracts.Job.jobCount()).toNumber();

      const allJobs = [] as IJobData[];

      for (
        let jobIdInteger = 1;
        jobIdInteger <= highestJobCount;
        ++jobIdInteger
      ) {
        const jobData = await loadJobFromJobId(
          String(jobIdInteger),
          contracts.Job
        );

        if (jobData) {
          allJobs.push(jobData);
        }
      }

      return filterJobs(allJobs, jobFilter);
    };

    if (contracts.chainIsSupported && contracts.Job && !fetching) {
      fetchJobs()
        .then((jobs) => {
          setJobs(jobs);
          setFetching(false);
          setIsLoading(false);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    jobFilter,
    contracts.chainIsSupported,
    contracts.Job,
    contracts.latestContractEvent,
  ]);

  return {
    jobs,
    isLoading,
  };
};
