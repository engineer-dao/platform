import ActivityFeed from 'components/activity-feed/ActivityFeed';
import { ApproveJobForm } from 'components/single-contract/ApproveJobForm';
import { CompleteJobForm } from 'components/single-contract/CompleteJobForm';
import SingleContractData from 'components/single-contract/SingleContractData';
import SingleContractHeading from 'components/single-contract/SingleContractHeading';
import { StartJobForm } from 'components/single-contract/StartJobForm';
import { useJob } from 'components/smart-contracts/hooks/useJob';
import { JobState } from 'enums/JobState';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ISingleContractRouteParams } from '../interfaces/routes/ISingleContractRouteParams';

const SingleContract: React.FC = () => {
  const { id } = useParams<ISingleContractRouteParams>();

  const jobData = useJob(id);

  return jobData ? (
    <>
      <SingleContractHeading contract={jobData} />
      <SingleContractData contract={jobData} />
      {jobData.state === JobState.Available && <StartJobForm job={jobData} />}
      {jobData.state === JobState.Started && <CompleteJobForm job={jobData} />}
      {jobData.state === JobState.Completed && <ApproveJobForm job={jobData} />}
      <ActivityFeed />
    </>
  ) : null;
};

export default SingleContract;
