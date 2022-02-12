import Currency from '../forms/inputs/Currency';
import Dropzone from '../forms/inputs/Dropzone';
import Input from '../forms/inputs/Input';
import TextArea from '../forms/inputs/TextArea';
import { ListBox } from '../ListBox';
import { acceptanceTestsItems, identityItems, labelItems } from './labels';
import OptionsSummary from './OptionsSummary';
import PaymentSummary from './PaymentSummary';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSmartContracts } from 'components/smart-contracts/useSmartContracts';
import { ApproveERC20Modal } from 'components/smart-contracts/ApproveERC20Modal';
import { PostJobModal } from 'components/smart-contracts/PostJobModal';
import { CreateFormValues } from 'components/forms/types';
import { useHistory } from 'react-router-dom';

const CreateContractForm = () => {
  const initialValues: CreateFormValues = {
    title: '',
    description: '',
    acceptanceCriteria: '',
    bounty: '',
  };

  const history = useHistory();

  const { contracts } = useSmartContracts();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setValidatedFormData] =
    useState<CreateFormValues>(initialValues);

  const [showApproveERC20Modal, setShowApproveERC20Modal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);

  const onJobPosted = (jobId: string) => {
    setShowPostJobModal(false);

    // redirect to the job by jobId
    history.push(`/contract/${jobId}`);
  };

  const onJobPostedError = () => {
    setSubmitting(false);
    setShowPostJobModal(false);
  };

  const tokenName = process.env.REACT_APP_PAYMENT_TOKEN_NAME;

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors = {};

        // console.log('validate', JSON.stringify(values, null, 2));
        return errors;
      }}
      onSubmit={(values) => {
        if (!contracts.isERC20Approved) {
          return;
        }

        setSubmitting(true);
        setValidatedFormData(values);
        setShowPostJobModal(true);
      }}
    >
      {({ values }) => (
        <Form
          className="mt-6 overflow-hidden shadow sm:rounded-md"
          style={submitting ? { opacity: 0.5 } : {}}
        >
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <Input id="title" label="Title" />
              </div>
              <div className="col-span-6">
                <TextArea id="description" rows={10} label="Description" />
              </div>
              <div className="col-span-6">
                <TextArea
                  id="acceptanceCriteria"
                  label="Acceptance Criteria"
                  rows={5}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Labels
                </label>
                <ListBox items={labelItems}></ListBox>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Identity
                </label>
                <ListBox items={identityItems}></ListBox>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Acceptance Tests
                </label>
                <ListBox items={acceptanceTestsItems}></ListBox>
              </div>
              <div className="col-span-2">
                <Currency
                  id="bounty"
                  label="Bounty"
                  placeholder="1000"
                  tokenName={tokenName}
                />
              </div>
              <div className="col-span-2">
                <Currency
                  id="buyIn"
                  placeholder="0.3"
                  label="Buy-In"
                  tokenName={tokenName}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Attach Files
                </label>
                <Dropzone />
              </div>
              <div className="col-span-6 flex w-full bg-gray-50 px-4 py-5 sm:p-6">
                <div className="w-1/2">
                  <PaymentSummary tokenName={tokenName} data={values} />
                </div>
                <div className="w-1/2">
                  <OptionsSummary data={values} />
                </div>
              </div>
              {contracts.isERC20Approved ? (
                <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
                  <button
                    disabled={submitting}
                    type="submit"
                    className={
                      'focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' +
                      (submitting ? ' bg-indigo-100 hover:bg-indigo-100' : '')
                    }
                  >
                    Fund &amp; Create
                  </button>

                  {formData && (
                    <PostJobModal
                      formData={formData}
                      show={showPostJobModal}
                      onConfirmed={onJobPosted}
                      onError={onJobPostedError}
                    />
                  )}
                </div>
              ) : (
                <div className="col-span-6 text-center text-sm font-normal leading-5">
                  <div className="mt-2 text-gray-800">
                    You must grant approve to the contract to spend the payment
                    token before you can post this job.
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

export default CreateContractForm;
