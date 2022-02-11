import { useEffect, useState } from 'react';
import { useSmartContracts } from 'components/smart-contracts/useSmartContracts';
import { useWallet } from 'components/wallet/useWallet';
import { BigNumber, ethers } from 'ethers';
import { useMoralisQuery } from 'react-moralis';
import {
  IJobData,
  IJobSmartContractData,
  IJobMetaData,
  IJobState,
} from 'interfaces/IJobData';

const assembleJob = (
  jobId: string,
  jobContractData: IJobSmartContractData,
  jobMetaData: IJobMetaData
) => {
  const job: IJobData = {
    id: jobId,

    supplier: ethers.utils.getAddress(jobContractData.supplier),
    engineer:
      jobContractData.engineer === ethers.constants.AddressZero
        ? undefined
        : ethers.utils.getAddress(jobContractData.engineer),
    bounty: BigNumber.from(jobContractData.bounty)
      .div(ethers.constants.WeiPerEther)
      .toNumber(),
    deposit: BigNumber.from(jobContractData.deposit)
      .div(ethers.constants.WeiPerEther)
      .toNumber(),
    startTime: BigNumber.from(jobContractData.startTime).toNumber(),
    completedTime: BigNumber.from(jobContractData.completedTime).toNumber(),
    closedBySupplier: jobContractData.closedBySupplier,
    closedByEngineer: jobContractData.closedByEngineer,
    state: jobContractData.state,

    title: jobMetaData.title,
    description: jobMetaData.description,
    buyIn: jobMetaData.buyIn,
    acceptanceCriteria: jobMetaData.acceptanceCriteria,
  };

  return job;
};

export const useJob = (jobId: string) => {
  const { contracts } = useSmartContracts();
  const { account } = useWallet();
  const [jobData, setJobData] = useState<undefined | any>();
  const { data, error, isLoading } = useMoralisQuery(
    'JobPostedEvents',
    (query) => {
      return query.equalTo('jobId', jobId);
    }
  );

  useEffect(() => {
    const fetchJob = async () => {
      const job = await contracts.Job.jobs(jobId);

      const foundJobResult = data[0];
      const jobMetaDataJSON = foundJobResult.get('jobMetaData');
      // TODO: validate meta data with a schema
      const unsafeJobMetaData = JSON.parse(jobMetaDataJSON);

      setJobData(assembleJob(jobId, job, unsafeJobMetaData));
    };

    if (jobId && account && !isLoading && data.length > 0) {
      fetchJob();
    }
  }, [jobId, account, isLoading, data]);

  return jobData;
};
