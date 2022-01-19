import {
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  KeyIcon,
  UserGroupIcon,
} from '@heroicons/react/solid';
import { ListBox } from '../components/ListBox';

type ListBoxItems = React.ComponentProps<typeof ListBox>['items'];

const labelItems: ListBoxItems = [
  {
    id: 1,
    name: 'Backend',
  },
  {
    id: 2,
    name: 'Node.js',
  },
  {
    id: 3,
    name: 'React',
  },
  {
    id: 4,
    name: 'Frontend',
  },
  {
    id: 5,
    name: 'Solidity',
  },
  {
    id: 6,
    name: 'Apollo/GraphQL',
  },
  {
    id: 7,
    name: 'Project Management',
  },
];
const identityItems: ListBoxItems = [
  {
    id: 1,
    name: 'Strict Anon',
  },
  {
    id: 2,
    name: 'Anon-First',
  },
  {
    id: 3,
    name: 'Partially Anon',
  },
  {
    id: 4,
    name: 'Optionally Anon',
  },
  {
    id: 5,
    name: 'Traditional (Identity Required)',
  },
  {
    id: 6,
    name: 'Rigorous Identity Check',
  },
  {
    id: 7,
    name: 'W2/1099 Required w/ HR',
  },
];
const acceptanceTestsItems: ListBoxItems = [
  {
    id: 1,
    name: 'Manual Testing',
  },
  {
    id: 2,
    name: 'Automated Testing (eDAO VM)',
  },
  {
    id: 3,
    name: 'Manual Approval',
  },
  {
    id: 4,
    name: 'Test Coverage Requirement',
  },
  {
    id: 5,
    name: 'Team Review',
  },
  {
    id: 6,
    name: 'Incremental Review',
  },
  {
    id: 7,
    name: 'E2E Tested',
  },
];

export const CreateContract = () => {
  return (
    <>
      <h3 className="text-xl leading-6 font-medium text-gray-900">
        Create Contract
      </h3>
      <div className="mt-3 shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 bg-white sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={10}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
            <div className="col-span-6">
              <label
                htmlFor="acceptance-criteria"
                className="block text-sm font-medium text-gray-700"
              >
                Acceptance Criteria
              </label>
              <div className="mt-1">
                <textarea
                  id="acceptance-criteria"
                  rows={5}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Labels
              </label>
              <ListBox items={labelItems}></ListBox>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Identity
              </label>
              <ListBox items={identityItems}></ListBox>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Acceptance Tests
              </label>
              <ListBox items={acceptanceTestsItems}></ListBox>
            </div>
            <div className="col-span-2">
              <label
                htmlFor="bounty"
                className="block text-sm font-medium text-gray-700"
              >
                Bounty
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  id="bounty"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="1.3"
                  aria-describedby="price-currency"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    ETH
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <label
                htmlFor="buy-in"
                className="block text-sm font-medium text-gray-700"
              >
                Buy-In
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  id="buy-in"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.1"
                  aria-describedby="price-currency"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    ETH
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <label
                htmlFor="end-date"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Attach Files
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-6 px-4 py-5 bg-gray-50 sm:p-6 w-full flex">
              <div className="w-1/2">
                <p className="text-lg leading-6 font-medium">Summary</p>
                <p className="mt-1 text-sm leading-5 font-normal">
                  1.3 ETH Bounty + 0.1 ETH Buy-In
                </p>
                <p className="text-lg leading-7 font-semibold">
                  1.4 ETH Total Payout
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  How It Works
                </button>
              </div>
              <div className="w-1/2">
                <div className="flex">
                  <CheckCircleIcon
                    className="h-5 w-5 mr-1 text-green-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-5 font-normal">Available</p>
                </div>
                <div className="flex mt-2">
                  <ClockIcon
                    className="h-5 w-5 mr-1 text-green-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-5 font-normal">30 Days</p>
                </div>
                <div className="flex mt-2">
                  <CubeIcon
                    className="h-5 w-5 mr-1 text-green-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-5 font-normal">
                    Frontend, React, MaterialUI, HTML, CSS
                  </p>
                </div>
                <div className="flex mt-2">
                  <KeyIcon
                    className="h-5 w-5 mr-1 text-green-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-5 font-normal">
                    Manual Testing, Manual Approval, Incremental Review
                  </p>
                </div>
                <div className="flex mt-2">
                  <UserGroupIcon
                    className="h-5 w-5 mr-1 text-green-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-5 font-normal">
                    Anon-First, Partially Anon, Optionally Anon
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-6 text-right text-sm text-white leading-5 font-normal">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Fund & Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
