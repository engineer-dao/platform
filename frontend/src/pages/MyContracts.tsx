import ContractsContainer from '../components/contracts/ContractsContainer';
import SortFilterHeading from '../components/SortFilterHeading';

const MyContracts = () => {
  return (
    <>
      <SortFilterHeading heading="My Contracts" />
      <ContractsContainer jobs={[]} />
    </>
  );
};

export default MyContracts;
