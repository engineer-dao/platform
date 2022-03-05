import { useJob } from 'components/smart-contracts/hooks/useJob';
import { ResolveSupplierModal } from 'components/smart-contracts/modals/ResolveSupplierModal';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const ResolveForSupplierButton = () => {
  const { job, isLoading } = useJob();
  const history = useHistory();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResolveSupplierModal, setShowResolveSupplierModal] =
    useState(false);

  return !isLoading && job ? (
    <>
      <div className="col-span-6 text-sm font-normal leading-5">
        <div className="font-bold">Option 1</div>
        Resolve this dispute for the supplier. The supplier is refunded and the
        engineer's deposit is awarded to the supplier.
      </div>
      <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
        <button
          onClick={() => {
            setShowResolveSupplierModal(true);
          }}
          disabled={isSubmitting}
          type="submit"
          className={
            'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' +
            (isSubmitting
              ? ' bg-indigo-100 hover:bg-indigo-100'
              : ' bg-indigo-600 hover:bg-indigo-700')
          }
        >
          Resolve For Supplier
        </button>
      </div>

      <ResolveSupplierModal
        jobId={job.id}
        show={showResolveSupplierModal}
        onConfirmed={(jobId: string) => {
          setShowResolveSupplierModal(false);
          // reload
          history.push(`/contract/${jobId}`);
        }}
        onError={() => {
          setIsSubmitting(false);
          setShowResolveSupplierModal(false);
        }}
      />
    </>
  ) : null;
};
