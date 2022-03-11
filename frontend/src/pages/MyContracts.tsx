import ContractsContainer from 'components/contracts/ContractsContainer';
import SortFilterHeading from 'components/SortFilterHeading';

export const MyContracts = () => {
  return (
    <>
      <SortFilterHeading heading="My Contracts" />
      <ContractsContainer />
    </>
  );
};
