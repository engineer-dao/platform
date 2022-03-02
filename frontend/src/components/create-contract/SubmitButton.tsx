import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { ICreateContractForm } from './form/ICreateContractForm';

export const SubmitButton = (props: { disabled?: boolean }) => {
  const { disabled = false } = props;
  const { isSubmitting } = useFormikContext<ICreateContractForm>();

  return (
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
  );
};
