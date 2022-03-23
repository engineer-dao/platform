import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { useState } from 'react';
import { useJob } from '../../hooks/useJob';

export const useReportJob = () => {
  const [error, setError] = useState('');

  const { job } = useJob();

  const { contracts } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    if (job?.id && job?.ipfsCid) {
      return contracts.Job.reportJob(job.id, job.ipfsCid);
    }
  };

  const isDisabled = !(job?.id && job?.ipfsCid);

  return { callContract, error, isDisabled };
};
