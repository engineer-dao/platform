import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { useSmartContracts } from '../smart-contracts/hooks/useSmartContracts';
import { ICreateContractForm } from './form/ICreateContractForm';

export const SubmitButton = (props: { disabled?: boolean }) => {
  const { disabled = false } = props;
  const { contracts } = useSmartContracts();
  const { isSubmitting } = useFormikContext<ICreateContractForm>();

  return contracts.isERC20Approved ? (
    <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
      <button
        disabled={disabled || isSubmitting}
        type="submit"
        className={classNames(
          'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
          {
            'bg-indigo-200 hover:bg-indigo-200': disabled || isSubmitting,
            'bg-indigo-600 hover:bg-indigo-700': !(disabled || isSubmitting),
          }
        )}
      >
        Fund &amp; Create
      </button>
    </div>
  ) : (
    <div className="col-span-6 text-center text-sm font-normal leading-5">
      <div className="mt-2 text-gray-800">
        You must grant approve to the contract to spend the payment token before
        you can post this job.
      </div>

      <button
        type="submit"
        className="focus:outline-none mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Approve Spending
      </button>
    </div>
  );
};
