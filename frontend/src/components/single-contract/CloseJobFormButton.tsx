import { CloseJobModal } from 'components/smart-contracts/modals/CloseJobModal';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSingleContract } from './context/useSingleContract';

export const CloseJobFormButton = () => {
  const { data: job } = useSingleContract();
  const [showCloseJobModal, setShowCloseJobModal] = useState(false);
  const history = useHistory();

  return job ? (
    <Formik
      initialValues={{}}
      onSubmit={(values) => {
        setShowCloseJobModal(true);
      }}
    >
      {({ isSubmitting, setSubmitting }) => (
        <Form style={isSubmitting ? { opacity: 0.5 } : {}}>
          <button
            disabled={isSubmitting}
            type="submit"
            className={
              'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' +
              (isSubmitting
                ? ' bg-indigo-100 hover:bg-indigo-100'
                : ' bg-indigo-600 hover:bg-indigo-700')
            }
          >
            Request to Close Job
          </button>

          {isSubmitting && (
            <CloseJobModal
              jobId={job.id}
              show={showCloseJobModal}
              onConfirmed={(jobId: string) => {
                setShowCloseJobModal(false);
                // reload
                history.push(`/contract/${jobId}`);
              }}
              onError={() => {
                setSubmitting(false);
                setShowCloseJobModal(false);
              }}
            />
          )}
        </Form>
      )}
    </Formik>
  ) : null;
};
