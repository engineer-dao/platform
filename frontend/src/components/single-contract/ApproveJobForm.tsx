import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { ApproveJobModal } from 'components/smart-contracts/modals/ApproveJobModal';
import { useWallet } from 'components/wallet/useWallet';
import { Form, Formik } from 'formik';
import { IJobData } from 'interfaces/IJobData';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface IApproveJobFormProps {
  job: IJobData;
}

export const ApproveJobForm: React.FC<IApproveJobFormProps> = (props) => {
  const { job } = props;

  const history = useHistory();

  const { contracts } = useSmartContracts();
  const wallet = useWallet();
  const isSupplier =
    (wallet.account || '').toLowerCase() === (job.supplier || '').toLowerCase();

  const [showApproveJobModal, setShowApproveJobModal] = useState(false);

  const tokenName = process.env.REACT_APP_PAYMENT_TOKEN_NAME;

  return (
    <Formik
      initialValues={{}}
      validate={(values) => {
        const errors = {};
        return errors;
      }}
      onSubmit={(values) => {
        if (!contracts.isERC20Approved) {
          return;
        }

        setShowApproveJobModal(true);
      }}
    >
      {({ values, isSubmitting, setSubmitting }) => (
        <Form
          className="mt-6 overflow-hidden shadow sm:rounded-md"
          style={isSubmitting ? { opacity: 0.5 } : {}}
        >
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 text-sm font-normal leading-5">
                If you are the supplier who commissioned this job, you may
                complete this job and send payment to the engineer.
              </div>
              <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
                <button
                  disabled={isSubmitting || !isSupplier}
                  type="submit"
                  className={
                    'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' +
                    (isSubmitting || !isSupplier
                      ? ' bg-indigo-100 hover:bg-indigo-100'
                      : ' bg-indigo-600 hover:bg-indigo-700')
                  }
                >
                  Approve and Pay
                </button>

                {isSubmitting && (
                  <ApproveJobModal
                    jobId={job.id}
                    show={showApproveJobModal}
                    onConfirmed={(jobId: string) => {
                      setShowApproveJobModal(false);
                      // reload
                      history.push(`/contract/${jobId}`);
                    }}
                    onError={() => {
                      setSubmitting(false);
                      setShowApproveJobModal(false);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
