import { PlusIcon } from '@heroicons/react/outline';
import {
  ChevronDownIcon,
  FilterIcon,
  SortAscendingIcon,
} from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import { SectionPath } from '../enums/admin/Sections';

interface ISortFilterHeading {
  heading: string;
  displayCreate?: boolean;
}

const SortFilterHeading: React.FC<ISortFilterHeading> = (props) => {
  const { heading, displayCreate } = props;

  return (
    <div className="border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-xl font-medium leading-6 text-gray-900">{heading}</h3>
      <div className="mt-3 sm:mt-0 sm:ml-4">
        <div className="flex justify-between rounded-md">
          <div>
            <button
              type="button"
              className="focus:outline-none relative -ml-px inline-flex items-center rounded-l-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <FilterIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-2 hidden sm:inline-block">Filter</span>
              <ChevronDownIcon
                className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              className="focus:outline-none relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <SortAscendingIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-2 hidden sm:inline-block">Sort</span>
              <ChevronDownIcon
                className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </button>
          </div>

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

export default SortFilterHeading;
