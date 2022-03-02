import ActivityFeed from 'components/activity-feed/ActivityFeed';
import { ApproveJobForm } from 'components/single-contract/ApproveJobForm';
import { CloseJobForm } from 'components/single-contract/CloseJobForm';
import { CompleteJobForm } from 'components/single-contract/CompleteJobForm';
import SingleContractData from 'components/single-contract/SingleContractData';
import SingleContractHeading from 'components/single-contract/SingleContractHeading';
import { useJob } from 'components/smart-contracts/hooks/useJob';
import { useWallet } from 'components/wallet/useWallet';
import { JobState } from 'enums/JobState';
import React from 'react';
import { addressesMatch } from 'utils/ethereum';
import Loader from '../components/full-screen-loader/FullScreenLoader';

const SingleContract: React.FC = () => {
  const { job, isLoading } = useJob();

  const { account } = useWallet();

  const isEngineer = addressesMatch(account, job?.engineer);
  const isSupplier = addressesMatch(account, job?.supplier);
  const isEngineerOrSupplier = isEngineer || isSupplier;

  return job && !isLoading ? (
    <>
      <SingleContractHeading />
      <SingleContractData />
      {job.state === JobState.Started && isEngineer && <CompleteJobForm />}
      {job.state === JobState.Completed && isSupplier && <ApproveJobForm />}
      {job.state === JobState.Started && isEngineerOrSupplier && (
        <CloseJobForm />
      )}
      <ActivityFeed />
    </>
  ) : isLoading ? (
    <Loader />
  ) : (
    <div>Invalid or missing job</div>
  );
};

export default SingleContract;
