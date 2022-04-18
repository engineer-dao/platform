import { PlusIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { SectionPath } from '../enums/admin/Sections';

interface IContractsHeading {
  heading: string;
  displayCreate?: boolean;
}

const ContractsHeading: React.FC<IContractsHeading> = (props) => {
  const { heading, displayCreate } = props;

  return (
    <div className="border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-xl font-medium leading-6 text-gray-900">{heading}</h3>
      <div className="mt-3 sm:mt-0 sm:ml-4">
        <div className="flex justify-between rounded-md">
          {displayCreate && (
            <span className="ml-3">
              <Link
                to={SectionPath.createContract}
                className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractsHeading;
