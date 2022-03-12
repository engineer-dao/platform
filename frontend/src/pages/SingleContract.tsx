import ActivityFeed from 'components/activity-feed/ActivityFeed';
import { ApproveJobForm } from 'components/single-contract/ApproveJobForm';
import { CloseJobForm } from 'components/single-contract/CloseJobForm';
import { CompleteJobForm } from 'components/single-contract/CompleteJobForm';
import { TimeoutJobForm } from 'components/single-contract/TimeoutJobForm';
import { DisputeJobForm } from 'components/single-contract/DisputeJobForm';
import { DisputeResolverForm } from 'components/single-contract/DisputeResolverForm';
import SingleContractData from 'components/single-contract/SingleContractData';
import SingleContractHeading from 'components/single-contract/SingleContractHeading';
import { useJob } from 'components/smart-contracts/hooks/useJob';
import { useWallet } from 'components/wallet/useWallet';
import { JobState } from 'enums/JobState';
import React from 'react';
import { isDisputeResolver } from 'utils/admin';
import { addressesMatch } from 'utils/ethereum';

const SingleContract: React.FC = () => {
  const { job } = useJob();

  const { account } = useWallet();

  const isEngineer = addressesMatch(account, job?.engineer);
  const isSupplier = addressesMatch(account, job?.supplier);
  const isEngineerOrSupplier = isEngineer || isSupplier;

  return (
    <>
      <SingleContractHeading />
      <SingleContractData />
      {job?.state === JobState.Started && isEngineer && <CompleteJobForm />}
      {job?.state === JobState.Completed && isEngineer && <TimeoutJobForm />}
      {job?.state === JobState.Completed && isSupplier && <ApproveJobForm />}
      {job?.state === JobState.Started && isEngineerOrSupplier && (
        <CloseJobForm />
      )}
      {(job?.state === JobState.Started || job?.state === JobState.Completed) &&
        isSupplier && <DisputeJobForm />}
      {job?.state === JobState.Disputed && isDisputeResolver(account) && (
        <DisputeResolverForm />
      )}
      <ActivityFeed />
    </>
  );
};

export default SingleContract;
