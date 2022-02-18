import ActivityFeed from 'components/activity-feed/ActivityFeed';
import { ApproveJobForm } from 'components/single-contract/ApproveJobForm';
import { CompleteJobForm } from 'components/single-contract/CompleteJobForm';
import SingleContractData from 'components/single-contract/SingleContractData';
import SingleContractHeading from 'components/single-contract/SingleContractHeading';
import { useJob } from 'components/smart-contracts/hooks/useJob';
import { JobState } from 'enums/JobState';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSingleContract } from '../components/single-contract/context/useSingleContract';
import { ISingleContractRouteParams } from '../interfaces/routes/ISingleContractRouteParams';

const SingleContract: React.FC = () => {
  const { id } = useParams<ISingleContractRouteParams>();

  const jobData = useJob(id);

  const { setSingleContract, data } = useSingleContract();

  useEffect(() => {
    if (jobData) {
      setSingleContract(jobData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData]);

  return data ? (
    <>
      <SingleContractHeading contract={data} />
      <SingleContractData contract={data} />
      {data.state === JobState.Started && <CompleteJobForm job={data} />}
      {data.state === JobState.Completed && <ApproveJobForm job={data} />}
      <ActivityFeed />
    </>
  ) : null;
};

export default SingleContract;
