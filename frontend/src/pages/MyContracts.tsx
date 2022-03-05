import { PlusIcon } from '@heroicons/react/outline';
import ContractsContainer from 'components/contracts/ContractsContainer';
import SortFilterHeading from 'components/SortFilterHeading';
import { SectionPath } from 'enums/admin/Sections';
import { Link } from 'react-router-dom';
import Loader from '../components/full-screen-loader/FullScreenLoader';
import { useMyJobs } from '../components/smart-contracts/hooks/useMyJobs';

export const MyContracts = () => {
  const { jobs, isLoading } = useMyJobs();

  return (
    <>
      <SortFilterHeading heading="My Contracts" />
      {isLoading ? (
        <Loader />
      ) : jobs.length > 0 ? (
        <ContractsContainer jobs={jobs} />
      ) : (
        <div>
          <div>You don't have any jobs at this time.</div>
          <div className="mt-3">
            <Link
              to={SectionPath.createContract}
              className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create a Job
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
