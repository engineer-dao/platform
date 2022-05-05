import { useState } from 'react';
import { ApproveERC20Modal } from '../../smart-contracts/modals/ApproveENGIModal';

const ApproveTokenDialog = () => {
  const [showApproveERC20Modal, setShowApproveERC20Modal] = useState(false);

  return (
    <>
      <div className="col-span-6 mt-12 bg-white px-4 py-5 text-center text-sm font-normal leading-5 shadow sm:rounded-md sm:p-6">
        <div className="mt-2 text-gray-800">
          You must grant approval to spend the payment token before you can
          create and fund a job.
        </div>

        <button
          type="button"
          onClick={() => setShowApproveERC20Modal(true)}
          className="focus:outline-none mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Approve Spending
        </button>
      </div>
      <ApproveERC20Modal
        show={showApproveERC20Modal}
        onFinish={() => {
          setShowApproveERC20Modal(false);
        }}
      />
    </>
  );
};

export default ApproveTokenDialog;
