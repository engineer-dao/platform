import { useJob } from 'components/smart-contracts/hooks/useJob';
import { ResolveEngineerModal } from 'components/smart-contracts/modals/ResolveEngineerModal';
import { ResolveSplitModal } from 'components/smart-contracts/modals/ResolveSplitModal';
import { ResolveSupplierModal } from 'components/smart-contracts/modals/ResolveSupplierModal';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const DisputeResolverForm = () => {
  const { job, isLoading } = useJob();
  const history = useHistory();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSupplierSplitPct, setCustomSupplierSplitPct] = useState('0');
  const [customEngineerSplitPct, setCustomEngineerSplitPct] = useState('0');
  const [showResolveSupplierModal, setShowResolveSupplierModal] =
    useState(false);
  const [showResolveEngineerModal, setShowResolveEngineerModal] =
    useState(false);
  const [showResolveSplitModal, setShowResolveSplitModal] = useState(false);

  return !isLoading && job ? (
    <>
      <div className="mt-6 overflow-hidden shadow sm:rounded-md">
        <div className="bg-white px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 text-sm font-normal leading-5">
              <div className="font-bold">Option 1</div>
              Resolve this dispute for the supplier. The supplier is refunded
              and the engineer's deposit is awarded to the supplier.
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

            <div className="col-span-6 text-sm font-normal leading-5">
              <div className="font-bold">Option 2</div>
              Resolve this dispute for the engineer. The engineer is awarded the
              bounty and refunded their deposit.
            </div>
            <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
              <button
                onClick={() => {
                  setShowResolveEngineerModal(true);
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
                Resolve For Engineer
              </button>
            </div>

            <div className="col-span-6 text-sm font-normal leading-5">
              <div className="font-bold">Option 3</div>
              Resolve this dispute with a custom split. The supplier and
              engineer are each awarded a percentage of the combined bounty and
              deposit.
            </div>
            <div className="col-span-2 text-left text-sm font-normal leading-5 text-black">
              <label className="block text-sm font-medium text-gray-700">
                Supplier Percentage
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm"></span>
                  </div>

                  <input
                    type="number"
                    min="1"
                    max="99"
                    className="block w-full rounded-md border-gray-300  pr-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={customSupplierSplitPct}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCustomSupplierSplitPct(e.target.value);
                      setCustomEngineerSplitPct(
                        String(100 - parseInt(e.target.value))
                      );
                    }}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </label>
            </div>
            <div className="col-span-2 text-left text-sm font-normal leading-5 text-black">
              <label className="block text-sm font-medium text-gray-700">
                Engineer Percentage
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm"></span>
                  </div>

                  <input
                    type="number"
                    min="1"
                    max="99"
                    className="block w-full rounded-md border-gray-300  pr-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={customEngineerSplitPct}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCustomEngineerSplitPct(e.target.value);
                      setCustomSupplierSplitPct(
                        String(100 - parseInt(e.target.value))
                      );
                    }}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </label>
            </div>
            <div className="col-span-2 pt-6 text-right text-sm font-normal leading-5 text-white">
              <button
                onClick={() => {
                  setShowResolveSplitModal(true);
                }}
                disabled={customEngineerSplitPct === '0' || isSubmitting}
                type="submit"
                className={
                  'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' +
                  (customEngineerSplitPct === '0' || isSubmitting
                    ? ' bg-indigo-100 hover:bg-indigo-100'
                    : ' bg-indigo-600 hover:bg-indigo-700')
                }
              >
                Resolve with Custom Split
              </button>
            </div>
          </div>
        </div>
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
      <ResolveEngineerModal
        jobId={job.id}
        show={showResolveEngineerModal}
        onConfirmed={(jobId: string) => {
          setShowResolveEngineerModal(false);
          // reload
          history.push(`/contract/${jobId}`);
        }}
        onError={() => {
          setIsSubmitting(false);
          setShowResolveEngineerModal(false);
        }}
      />
      <ResolveSplitModal
        jobId={job.id}
        engineerAmountPct={parseInt(customEngineerSplitPct)}
        show={showResolveSplitModal}
        onConfirmed={(jobId: string) => {
          setShowResolveSplitModal(false);
          // reload
          history.push(`/contract/${jobId}`);
        }}
        onError={() => {
          setIsSubmitting(false);
          setShowResolveSplitModal(false);
        }}
      />
    </>
  ) : null;
};
