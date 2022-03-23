import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { useJob } from '../../hooks/useJob';

export const useReportJob = () => {
  const { job } = useJob();

  const { contracts } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    if (job?.id && job?.ipfsCid) {
      return contracts.Job.reportJob(job.id, job.ipfsCid);
    }
  };

  const isDisabled = !(job?.id && job?.ipfsCid);

  return { callContract, isDisabled };
};
