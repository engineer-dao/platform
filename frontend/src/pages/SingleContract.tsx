import ActivityFeed from 'components/activity-feed/ActivityFeed';
import React from 'react';
import { useParams } from 'react-router-dom';
import SingleContractData from 'components/single-contract/SingleContractData';
import SingleContractHeading from 'components/single-contract/SingleContractHeading';
import { StartJobForm } from 'components/single-contract/StartJobForm';
import { ISingleContractRouteParams } from '../interfaces/routes/ISingleContractRouteParams';
import { JobState } from 'enums/JobState';
import { useJob } from 'components/smart-contracts/hooks/useJob';

const SingleContract: React.FC = () => {
  const { id } = useParams<ISingleContractRouteParams>();

  const jobData = useJob(id);

  return jobData ? (
    <>
      <SingleContractHeading contract={jobData} />
      <SingleContractData contract={jobData} />
      {jobData.state === JobState.Available && <StartJobForm job={jobData} />}
      <ActivityFeed />
    </>
  ) : null;
};

export default SingleContract;
