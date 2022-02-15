import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { CompleteJobModal } from 'components/smart-contracts/modals/CompleteJobModal';
import { useWallet } from 'components/wallet/useWallet';
import { Form, Formik } from 'formik';
import { IJobData } from 'interfaces/IJobData';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface ICompleteJobFormProps {
  job: IJobData;
}

export const CompleteJobForm: React.FC<ICompleteJobFormProps> = (props) => {
  const { job } = props;

  const history = useHistory();

  const { contracts } = useSmartContracts();
  const wallet = useWallet();
  const isEngineer =
    (wallet.account || '').toLowerCase() === (job.engineer || '').toLowerCase();

  const [showCompleteJobModal, setShowCompleteJobModal] = useState(false);

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

        setShowCompleteJobModal(true);
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
                If you are the engineer who accepted this job, you may mark this
                job complete and request payment.
              </div>
              <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
                <button
                  disabled={isSubmitting || !isEngineer}
                  type="submit"
                  className={
                    'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' +
                    (isSubmitting || !isEngineer
                      ? ' bg-indigo-100 hover:bg-indigo-100'
                      : ' bg-indigo-600 hover:bg-indigo-700')
                  }
                >
                  Mark Job Completed
                </button>

                {isSubmitting && (
                  <CompleteJobModal
                    jobId={job.id}
                    show={showCompleteJobModal}
                    onConfirmed={(jobId: string) => {
                      setShowCompleteJobModal(false);
                      // reload
                      history.push(`/contract/${jobId}`);
                    }}
                    onError={() => {
                      setSubmitting(false);
                      setShowCompleteJobModal(false);
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
