import React from 'react';
import { useParams } from 'react-router-dom';
import SingleContractData from '../components/single-contract/SingleContractData';
import SingleContractHeading from '../components/single-contract/SingleContractHeading';
import { contracts } from '../mocks/contracts';

interface ISingleContractRouteParams {
  id: string;
}

const SingleContract: React.FC = () => {
  const { id } = useParams<ISingleContractRouteParams>();

  // TODO: Replace mock
  const contract = contracts.find((item) => item.id === id);

  return contract ? (
    <>
      <SingleContractHeading contract={contract} />
      <SingleContractData />
    </>
  ) : null;
};

export default SingleContract;
