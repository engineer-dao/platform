import { CashIcon } from '@heroicons/react/solid';
import {
  CashIcon as OutlineCashIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import { IContract } from '../../interfaces/IContract';
import { Link } from 'react-router-dom';
import ContractStatusLabel from './ContractStatusLabel';

interface IContractItemProps {
  contract: IContract;
}

const ContractItem: React.FC<IContractItemProps> = ({ contract }) => {
  const { id, title, bounty, bounty_suffix, buy_in, buy_in_suffix, status } =
    contract;

  return (
    <li
      key={id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
    >
      <Link to={`/contract/${id}`}>
        <div className="flex w-full items-center justify-between space-x-6 p-6">
          {/* Left section */}
          <div className="flex-1 truncate">
            <div className="flex flex-col items-start">
              <h3 className="mb-6 truncate text-lg font-medium text-gray-700">
                {title}
              </h3>
              <div className="item-center flex">
                <p className="text-md mt-1 mr-3 flex items-center truncate font-bold text-gray-700">
                  <CashIcon
                    className="mr-2 h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                  {bounty} {bounty_suffix} Bounty
                </p>
                <p className="text-md mt-1 flex items-center truncate font-bold text-gray-700">
                  <OutlineCashIcon
                    className="mr-2 h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                  {buy_in} {buy_in_suffix} Buy-In
                </p>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex-0 truncate">
            <ContractStatusLabel status={status} />
          </div>
          <div className="ml-5 flex-shrink-0">
            <ChevronRightIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
      {/* Left section and right section */}
    </li>
  );
};

export default ContractItem;
