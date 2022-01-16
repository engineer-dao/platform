import { CashIcon } from '@heroicons/react/solid';
import {
  CashIcon as OutlineCashIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import { IContract } from '../../interfaces/IContract';
import { Link } from 'react-router-dom';

interface IContractItemProps {
  contract: IContract;
}

const ContractItem: React.FC<IContractItemProps> = ({ contract }) => {
  const {
    id,
    title,
    bounty,
    bounty_suffix,
    buy_in,
    buy_in_suffix,
    availability,
  } = contract;

  return (
    <li
      key={id}
      className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
    >
      <Link to={`/contract/${id}`}>
        <div className="w-full flex items-center justify-between p-6 space-x-6">
          {/* Left section */}
          <div className="flex-1 truncate">
            <div className="flex flex-col items-start">
              <h3 className="text-gray-700 text-lg font-medium truncate mb-6">
                {title}
              </h3>
              <div className="flex item-center">
                <p className="mt-1 mr-3 text-gray-700 font-bold text-md truncate flex items-center">
                  <CashIcon
                    className="h-5 w-5 mr-2 text-green-500"
                    aria-hidden="true"
                  />
                  {bounty} {bounty_suffix} Bounty
                </p>
                <p className="mt-1 text-gray-700 font-bold text-md truncate flex items-center">
                  <OutlineCashIcon
                    className="h-5 w-5 mr-2 text-green-500"
                    aria-hidden="true"
                  />
                  {buy_in} {buy_in_suffix} Buy-In
                </p>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex-0 truncate">
            <h3 className="text-md font-medium truncate text-green-600">
              {availability}
            </h3>
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
