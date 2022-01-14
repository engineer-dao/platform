import {
  ChevronDownIcon,
  SortAscendingIcon,
  FilterIcon,
} from '@heroicons/react/solid';
import ContractsContainer from '../components/contracts/ContractsContainer';
import SortFilterHeading from '../components/SortFilterHeading';

const Contracts = () => {
  return (
    <>
      <SortFilterHeading />
      <ContractsContainer />
    </>
  );
};

export default Contracts;
