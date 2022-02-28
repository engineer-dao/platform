import ActivityFeed from 'components/activity-feed/ActivityFeed';
import { ApproveJobForm } from 'components/single-contract/ApproveJobForm';
import { CompleteJobForm } from 'components/single-contract/CompleteJobForm';
import SingleContractData from 'components/single-contract/SingleContractData';
import SingleContractHeading from 'components/single-contract/SingleContractHeading';
import { JobState } from 'enums/JobState';
import React from 'react';
import Loader from '../components/full-screen-loader/FullScreenLoader';
import { useJob } from '../components/smart-contracts/hooks/useJob';

const SingleContract: React.FC = () => {
  const { job, isLoading } = useJob();

  return job && !isLoading ? (
    <>
      <SingleContractHeading />
      <SingleContractData />
      {job.state === JobState.Started && <CompleteJobForm />}
      {job.state === JobState.Completed && <ApproveJobForm />}
      <ActivityFeed />
    </>
  ) : isLoading ? (
    <Loader />
  ) : (
    <div>Invalid or missing job</div>
  );
};

export default SingleContract;
