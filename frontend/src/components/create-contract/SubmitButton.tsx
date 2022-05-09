import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { SupportedTokens } from '../../enums/SupportedTokens';
import { useSmartContracts } from '../smart-contracts/hooks/useSmartContracts';
import { ApproveENGIModal } from '../smart-contracts/modals/ApproveENGIModal';
import { ApproveUSDCModal } from '../smart-contracts/modals/ApproveUSDCModal';
import { ICreateContractForm } from './form/ICreateContractForm';

export const SubmitButton = (props: { disabled?: boolean }) => {
  const { disabled = false } = props;
  const { isSubmitting, values } = useFormikContext<ICreateContractForm>();
  const { contracts } = useSmartContracts();

  const [showApproveENGI, setShowApproveENGI] = useState(false);
  const [showApproveUSDC, setShowApproveUSDC] = useState(false);

  const showApproveENGIButton =
    values?.token === SupportedTokens.ENGI && !contracts.isENGIApproved;

  const showApproveUSDCButton =
    values?.token === SupportedTokens.USDC && !contracts.isUSDCApproved;

  const buttonClasses = () =>
    classNames(
      'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
      {
        'bg-indigo-200 hover:bg-indigo-200': disabled || isSubmitting,
        'bg-indigo-600 hover:bg-indigo-700': !(disabled || isSubmitting),
      }
    );

  return (
    <>
      <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
        {showApproveENGIButton ? (
          <button
            disabled={disabled || isSubmitting}
            type="button"
            onClick={() => setShowApproveENGI(true)}
            className={buttonClasses()}
          >
            Approve ENGI
          </button>
        ) : showApproveUSDCButton ? (
          <button
            disabled={disabled || isSubmitting}
            type="button"
            onClick={() => setShowApproveUSDC(true)}
            className={buttonClasses()}
          >
            Approve USDC
          </button>
        ) : (
          <button
            disabled={disabled || isSubmitting}
            type="submit"
            className={buttonClasses()}
          >
            Fund &amp; Create
          </button>
        )}
      </div>
      <ApproveENGIModal
        show={showApproveENGI}
        onFinish={() => setShowApproveENGI(false)}
        onError={(error: any) => console.log(error)}
      />
      <ApproveUSDCModal
        show={showApproveUSDC}
        onFinish={() => setShowApproveUSDC(false)}
        onError={(error: any) => console.log(error)}
      />
    </>
  );
};
