import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { pinIpfsReportMetaData } from '../../../../services/ipfs';
import { useWallet } from '../../../wallet/useWallet';
import { useJob } from '../../hooks/useJob';

export const useReportJob = ({ reason }: { reason: string }) => {
  const { job } = useJob();
  const wallet = useWallet();

  const { contracts } = useSmartContracts();

  const callContract = async () => {
    const cid = await pinIpfsReportMetaData({
      address: wallet.account || '',
      sig: '',
      metadata: {
        reason,
        jobId: job?.id || 'Unknown',
        jobUrl: window.location.href,
      },
    });

    if (job?.id && cid) {
      return contracts.Job.reportJob(job.id, cid.ipfsCid);
    }
  };

  const isDisabled = !(job?.id && job?.ipfsCid && reason.length);

  return { callContract, isDisabled };
};
