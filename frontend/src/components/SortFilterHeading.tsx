import {
  ChevronDownIcon,
  FilterIcon,
  SortAscendingIcon,
} from '@heroicons/react/solid';

const SortFilterHeading = () => {
  return (
    <div className="pb-5 border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-xl leading-6 font-medium text-gray-900">Contracts</h3>
      <div className="mt-3 sm:mt-0 sm:ml-4">
        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className="ml-2">Filter</span>
            <ChevronDownIcon
              className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <SortAscendingIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <span className="ml-2">Sort</span>
            <ChevronDownIcon
              className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortFilterHeading;
