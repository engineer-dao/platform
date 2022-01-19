import { IContract } from '../../interfaces/IContract';
import StatusChip from './StatusChip';

interface ISingleContractHeadingProps {
  contract: IContract;
}

const SingleContractHeading: React.FC<ISingleContractHeadingProps> = (
  props
) => {
  const { contract } = props;
  const { title, status } = contract;

  return (
    <div className="pb-5">
      <div className="sm:flex sm:justify-between sm:items-baseline">
        <div className="sm:w-0 sm:flex-1">
          <h3 className="text-xl leading-6 font-medium text-gray-900">
            {title}
          </h3>
        </div>
        <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
          <StatusChip status={status} />
        </div>
      </div>
    </div>
  );
};

export default SingleContractHeading;
