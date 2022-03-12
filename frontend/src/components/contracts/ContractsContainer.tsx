import { PlusIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { SectionPath } from '../../enums/admin/Sections';
import { useJobs } from '../smart-contracts/hooks/useJobs';
import ContractItem from './ContractItem';
import SkeletonContractItem from './SkeletonContractItem';

const ContractsContainer: React.FC = () => {
  const { jobs, isLoading } = useJobs();

  const opacityMap = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

  return !isLoading && !jobs.length ? (
    <div>
      <div>No jobs found.</div>
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
  ) : (
    <ul className="grid grid-cols-1 gap-6">
      {isLoading
        ? opacityMap.map((item, index) => (
            <SkeletonContractItem
              key={`contract-skeleton-${index}`}
              opacity={item}
            />
          ))
        : jobs.map((item) => <ContractItem key={item.id} job={item} />)}
    </ul>
  );
};

export default ContractsContainer;
