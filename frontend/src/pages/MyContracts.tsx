import { PlusIcon } from '@heroicons/react/outline';
import ContractsContainer from 'components/contracts/ContractsContainer';
import { useFindJobs } from 'components/smart-contracts/hooks/useJob';
import SortFilterHeading from 'components/SortFilterHeading';
import { useWallet } from 'components/wallet/useWallet';
import { SectionPath } from 'enums/admin/Sections';
import { ethers } from 'ethers';
import { IJobFilter } from 'interfaces/IJobFilter';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const MyContracts = () => {
  const [jobFilter, setJobFilter] = useState<IJobFilter>({
    fields: {
      supplier: '0x00',
      engineer: '0x00',
    },
  });

  const wallet = useWallet();

  // filter by addresses
  useEffect(() => {
    if (wallet.account) {
      const formattedAddress = ethers.utils.getAddress(wallet.account);
      setJobFilter((jobFilter) => {
        return {
          ...jobFilter,
          fields: {
            supplier: formattedAddress,
            engineer: formattedAddress,
          },
        };
      });
    }
  }, [wallet.account]);

  const { jobs, isLoading } = useFindJobs(jobFilter);

  return (
    <>
      <SortFilterHeading heading="My Contracts" />
      {isLoading ? (
        <div>Loading...</div>
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
