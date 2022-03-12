import ContractsContainer from '../components/contracts/ContractsContainer';
import SortFilterHeading from '../components/SortFilterHeading';

const Contracts = () => {
  return (
    <>
      <SortFilterHeading heading="Contracts" displayCreate />
      <ContractsContainer />
    </>
  );
};

export default Contracts;
