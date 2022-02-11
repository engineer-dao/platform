// import { IContract } from '../../interfaces/IContract';
import StatusChip from './StatusChip';
import { IJobData } from 'interfaces/IJobData';

interface ISingleContractHeadingProps {
  contract: IJobData;
}

const SingleContractHeading: React.FC<ISingleContractHeadingProps> = (
  props
) => {
  const { contract } = props;
  const { title, state } = contract;

  return (
    <div className="pb-5">
      <div className="sm:flex sm:items-baseline sm:justify-between">
        <div className="sm:w-0 sm:flex-1">
          <h3 className="text-xl font-medium leading-6 text-gray-900">
            {title}
          </h3>
        </div>
        <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
          <StatusChip status={state} />
        </div>
      </div>
    </div>
  );
};

export default SingleContractHeading;
