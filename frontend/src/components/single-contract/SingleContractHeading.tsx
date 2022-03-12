// import { IContract } from '../../interfaces/IContract';
import StatusChip from './StatusChip';
import { IJobData } from 'interfaces/IJobData';
import { useJob } from '../smart-contracts/hooks/useJob';

interface ISingleContractHeadingProps {
  contract?: IJobData;
}

const SingleContractHeading: React.FC<ISingleContractHeadingProps> = (
  props
) => {
  const { job, isLoading } = useJob();
  const { contract = job } = props;

  const { title, state } = contract || {};

  return (
    <div className="pb-5">
      {isLoading ? (
        <div className="animate-pulse sm:flex sm:items-center sm:justify-between">
          <div className="relative w-full rounded-md bg-gray-200 py-5 sm:w-0 sm:flex-1" />
          <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
            <StatusChip />
          </div>
        </div>
      ) : (
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:w-0 sm:flex-1">
            <h3 className="text-xl font-medium leading-6 text-gray-900">
              {title}
            </h3>
          </div>
          <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
            <StatusChip state={state} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleContractHeading;
