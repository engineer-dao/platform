import ContractsContainer from '../components/contracts/ContractsContainer';
import SortFilterHeading from '../components/SortFilterHeading';
import { myContracts } from '../mocks/myContracts';

const MyContracts = () => {
  return (
    <>
      <SortFilterHeading heading="My Contracts" />
      <ContractsContainer contracts={myContracts} />
    </>
  );
};

export default MyContracts;
