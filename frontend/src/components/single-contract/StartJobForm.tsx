import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { ApproveERC20Modal } from 'components/smart-contracts/modals/ApproveERC20Modal';
import { StartJobModal } from 'components/smart-contracts/modals/StartJobModal';
import { useHistory } from 'react-router-dom';
import { IJobData } from 'interfaces/IJobData';

interface IStartJobFormProps {
  job: IJobData;
}

export const StartJobForm: React.FC<IStartJobFormProps> = (props) => {
  const { job } = props;

  const history = useHistory();

  const { contracts } = useSmartContracts();

  const [showApproveERC20Modal, setShowApproveERC20Modal] = useState(false);
  const [showStartJobModal, setShowStartJobModal] = useState(false);

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

        setShowStartJobModal(true);
      }}
    >
      {({ values, isSubmitting, setSubmitting }) => (
        <Form
          className="mt-6 overflow-hidden shadow sm:rounded-md"
          style={isSubmitting ? { opacity: 0.5 } : {}}
        >
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              {contracts.isERC20Approved ? (
                <>
                  <div className="col-span-6 text-sm font-normal leading-5">
                    You will be depositing {job.buyIn} {tokenName} and
                    committing to completing this job.
                  </div>
                  <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className={
                        'focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' +
                        (isSubmitting
                          ? ' bg-indigo-100 hover:bg-indigo-100'
                          : '')
                      }
                    >
                      Deposit &amp; Start Job
                    </button>

                    {isSubmitting && (
                      <StartJobModal
                        jobId={job.id}
                        deposit={job.buyIn}
                        show={showStartJobModal}
                        onConfirmed={(jobId: string) => {
                          setShowStartJobModal(false);
                          // reload
                          history.push(`/contract/${jobId}`);
                        }}
                        onError={() => {
                          setSubmitting(false);
                          setShowStartJobModal(false);
                        }}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="col-span-6 text-center text-sm font-normal leading-5">
                  <div className="mt-2 text-gray-800">
                    You must grant approve to the contract to spend the payment
                    token before you can start this job.
                  </div>

                  <button
                    onClick={() => {
                      setShowApproveERC20Modal(true);
                    }}
                    type="button"
                    className="focus:outline-none mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Approve Spending
                  </button>

                  <ApproveERC20Modal
                    show={showApproveERC20Modal && !contracts.isERC20Approved}
                    onFinish={() => setShowApproveERC20Modal(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
