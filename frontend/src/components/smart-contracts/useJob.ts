import { useEffect, useState } from 'react';
import { useSmartContracts } from 'components/smart-contracts/useSmartContracts';
import {
  useWallet,
  useBlockchainEventFilter,
} from 'components/wallet/useWallet';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { Listener } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

export const useJob = (jobId: string) => {
  const { contracts } = useSmartContracts();
  const { account } = useWallet();
  const [jobData, setJobData] = useState<undefined | string>();

  useEffect(() => {
    const fetchJob = async () => {
      const job = await contracts.Job.jobs(jobId);
      console.log(`fetchJob job ${jobId}`, JSON.stringify(typeof job, null, 2));
      setJobData(job.supplier);

      // load job meta data from log...
      const filter = contracts.Job.filters.JobPosted(BigNumber.from(jobId));
      const results = await contracts.Job.queryFilter(filter, -100, 'latest');
      console.log('results', JSON.stringify(results, null, 2));
      // setJobData(job.supplier);
      // set the meta data filter
    };

    if (jobId && account) {
      fetchJob();
    }
  }, [jobId, account, contracts]);

  const onJobPosted: Listener = (jobId, jobMetaData) => {
    console.log('onJobPosted jobId:', JSON.stringify(jobId, null, 2));
    console.log(
      'onJobPosted jobMetaData:',
      JSON.stringify(jobMetaData, null, 2)
    );
  };

  console.log('useBlockchainEventFilter');
  useBlockchainEventFilter(
    contracts,
    contracts.Job,
    () => {
      return contracts.Job.filters.JobPosted(BigNumber.from(jobId));
    },
    onJobPosted
  );

  return jobData;
};
