import { IContract } from '../../interfaces/IContract';

interface ISingleContractHeadingProps {
  contract: IContract;
}

const SingleContractHeading: React.FC<ISingleContractHeadingProps> = (
  props
) => {
  const { contract } = props;
  const { title, availability } = contract;

  return (
    <div className="pb-5">
      <div className="sm:flex sm:justify-between sm:items-baseline">
        <div className="sm:w-0 sm:flex-1">
          <h3 className="text-xl leading-6 font-medium text-gray-900">
            {title}
          </h3>
        </div>
        <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-lg font-medium bg-green-200 text-green-800">
            {availability}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SingleContractHeading;
