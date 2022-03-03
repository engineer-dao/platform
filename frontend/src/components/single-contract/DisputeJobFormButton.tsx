import { useJob } from 'components/smart-contracts/hooks/useJob';
import { DisputeJobModal } from 'components/smart-contracts/modals/DisputeJobModal';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface IDisputeJobFormButtonProps {
  label?: string;
}

export const DisputeJobFormButton: React.FC<IDisputeJobFormButtonProps> = (
  props
) => {
  const { label } = props;
  const { job, isLoading } = useJob();
  const [showDisputeJobModal, setShowDisputeJobModal] = useState(false);
  const history = useHistory();

  return job && !isLoading ? (
    <Formik
      initialValues={{}}
      onSubmit={(values) => {
        setShowDisputeJobModal(true);
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
            {label || 'Close Job'}
          </button>

          {isSubmitting && (
            <DisputeJobModal
              jobId={job.id}
              show={showDisputeJobModal}
              onConfirmed={(jobId: string) => {
                setShowDisputeJobModal(false);
                // reload
                history.push(`/contract/${jobId}`);
              }}
              onError={() => {
                setSubmitting(false);
                setShowDisputeJobModal(false);
              }}
            />
          )}
        </Form>
      )}
    </Formik>
  ) : null;
};
