import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { JobContext } from 'components/smart-contracts/JobContext';
import { IJobData } from 'interfaces/IJobData';
import { ISingleContractRouteParams } from 'interfaces/routes/ISingleContractRouteParams';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadJobFromJobId } from 'services/jobs';

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams<ISingleContractRouteParams>();
  const { contracts } = useSmartContracts();

  const [job, setJob] = useState<IJobData | undefined>();
  const [loading, setLoading] = useState(true);

  // reload the job when any contract events occur on the job address
  useEffect(() => {
    if (id && contracts.Job) {
      // do not set as loading when loading a second time
      loadJobFromJobId(id, contracts.Job).then((job) => {
        setJob(job);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, contracts.Job, contracts.latestContractEvent]);

  const jobContext = {
    job,
    loading,
  };

  return (
    <JobContext.Provider value={jobContext}>{children}</JobContext.Provider>
  );
};
