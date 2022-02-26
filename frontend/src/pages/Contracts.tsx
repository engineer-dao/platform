import ContractsContainer from '../components/contracts/ContractsContainer';
import SortFilterHeading from '../components/SortFilterHeading';
import { useFindJobs } from 'components/smart-contracts/hooks/useJob';

const Contracts = () => {
  const { jobs, isLoading } = useFindJobs();

  return (
    <>
      <SortFilterHeading heading="Contracts" displayCreate />
      {isLoading ? (
        <div>Loading..</div>
      ) : jobs.length ? (
        <ContractsContainer jobs={jobs} />
      ) : (
        <div>No jobs found.</div>
      )}
    </>
  );
};

export default Contracts;
