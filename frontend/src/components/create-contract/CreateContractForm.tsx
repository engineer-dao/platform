import Currency from '../forms/inputs/Currency';
import Dropzone from '../forms/inputs/Dropzone';
import Input from '../forms/inputs/Input';
import TextArea from '../forms/inputs/TextArea';
import { ListBox } from '../ListBox';
import { acceptanceTestsItems, identityItems, labelItems } from './labels';
import OptionsSummary from './OptionsSummary';
import PaymentSummary from './PaymentSummary';
import { Formik, Form } from 'formik';
import { ICreateContractForm } from './ICreateContractForm';
import { SubmitButton } from './SubmitButton';
import { PostJobModal } from '../smart-contracts/modals/PostJobModal';
import { ApproveERC20Modal } from '../smart-contracts/modals/ApproveERC20Modal';
import { useSmartContracts } from '../smart-contracts/hooks/useSmartContracts';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const CreateContractForm = () => {
  const tokenName = process.env.REACT_APP_PAYMENT_TOKEN_NAME;
  const initialValues: ICreateContractForm = {
    title: '',
    description: '',
    acceptanceCriteria: '',
    bounty: '',
    labels: [],
    identity: [],
    acceptanceTests: [],
    buyIn: '',
  };

  const { contracts } = useSmartContracts();

  const history = useHistory();

  const [showApproveERC20Modal, setShowApproveERC20Modal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);

  const onJobPosted = (jobId: string) => {
    setShowPostJobModal(false);

    // redirect to the job by jobId
    history.push(`/contract/${jobId}`);
  };

  const onJobPostedError = () => {
    setShowPostJobModal(false);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, isSubmitting }) => (
        <Form
          className="mt-6 overflow-hidden shadow sm:rounded-md"
          style={isSubmitting ? { opacity: 0.5 } : {}}
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
                <ListBox items={labelItems} name="labels"></ListBox>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Identity
                </label>
                <ListBox items={identityItems} name="identity"></ListBox>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Acceptance Tests
                </label>
                <ListBox
                  items={acceptanceTestsItems}
                  name="acceptanceTests"
                ></ListBox>
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
              <SubmitButton />
            </div>
          </div>
          {values && (
            <PostJobModal
              formData={values}
              show={showPostJobModal}
              onConfirmed={onJobPosted}
              onError={onJobPostedError}
            />
          )}
          <ApproveERC20Modal
            show={showApproveERC20Modal && !contracts.isERC20Approved}
            onFinish={() => setShowApproveERC20Modal(false)}
          />
        </Form>
      )}
    </Formik>
  );

  function handleSubmit() {
    if (contracts.isERC20Approved) {
      setShowPostJobModal(true);
    } else {
      setShowApproveERC20Modal(true);
    }
  }
};

export default CreateContractForm;
