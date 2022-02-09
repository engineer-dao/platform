import ActivityFeed from 'components/activity-feed/ActivityFeed';
import React from 'react';
import { useParams } from 'react-router-dom';
import SingleContractData from '../components/single-contract/SingleContractData';
import SingleContractHeading from '../components/single-contract/SingleContractHeading';
import { ISingleContractRouteParams } from '../interfaces/routes/ISingleContractRouteParams';
import { contracts as contracsMock } from '../mocks/contracts';
import { useJob } from 'components/smart-contracts/useJob';

const SingleContract: React.FC = () => {
  const { id } = useParams<ISingleContractRouteParams>();

  const jobData = useJob(id);

  // TODO: Replace mock
  // const contract = contracsMock.find((item) => item.id === id);

  console.log('jobData', JSON.stringify(jobData, null, 2));

  return jobData ? (
    <>
      <SingleContractHeading contract={jobData} />
      <SingleContractData contract={jobData} />
      <ActivityFeed />
    </>
  ) : null;
};

export default SingleContract;
