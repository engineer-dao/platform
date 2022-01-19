import ContractsContainer from '../components/contracts/ContractsContainer';
import SortFilterHeading from '../components/SortFilterHeading';
import { contracts } from '../mocks/contracts';

const Contracts = () => {
  return (
    <>
      <SortFilterHeading heading="Contracts" displayCreate />
      <ContractsContainer contracts={contracts} />
    </>
  );
};

export default Contracts;
