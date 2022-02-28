import ContractsContainer from '../components/contracts/ContractsContainer';
import SortFilterHeading from '../components/SortFilterHeading';
import Loader from '../components/full-screen-loader/FullScreenLoader';
import { useJobs } from '../components/smart-contracts/hooks/useJobs';

const Contracts = () => {
  const { jobs, isLoading } = useJobs();

  return (
    <>
      <SortFilterHeading heading="Contracts" displayCreate />
      {isLoading ? (
        <Loader />
      ) : jobs?.length ? (
        <ContractsContainer jobs={jobs} />
      ) : (
        <div>No jobs found.</div>
      )}
    </>
  );
};

export default Contracts;
