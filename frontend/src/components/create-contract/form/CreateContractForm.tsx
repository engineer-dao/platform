import Currency from '../../forms/inputs/Currency';
import Input from '../../forms/inputs/Input';
import TextArea from '../../forms/inputs/TextArea';
import { ListBox } from '../../ListBox';
import {
  acceptanceTestsItems,
  identityItems,
  labelItems,
} from 'interfaces/Labels';
import OptionsSummary from '../OptionsSummary';
import PaymentSummary from '../PaymentSummary';
import { Formik, Form, FormikProps } from 'formik';
import { ICreateContractForm } from './ICreateContractForm';
import { SubmitButton } from '../SubmitButton';
import { PostJobModal } from '../../smart-contracts/modals/PostJobModal';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createFormSchema } from './ValidationSchema';
import { SupportedTokens } from '../../../enums/SupportedTokens';

const CreateContractForm = () => {
  const initialValues: ICreateContractForm = {
    title: '',
    description: '',
    acceptanceCriteria: '',
    contactInformation: '',
    bounty: '',
    labels: [],
    identity: [],
    acceptanceTests: [],
    requiredDeposit: '',
    endDate: '',
    token: SupportedTokens.ENGI,
  };

  const history = useHistory();

  const [showPostJobModal, setShowPostJobModal] = useState(false);

  const onJobPosted = (jobId: string) => {
    setShowPostJobModal(false);

    // redirect to the job by jobId
    history.push(`/contract/${jobId}`);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createFormSchema}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange
    >
      {({
        values,
        isSubmitting,
        setSubmitting,
        isValid,
        dirty,
      }: FormikProps<ICreateContractForm>) => {
        const onJobPostedError = () => {
          setSubmitting(false);
          setShowPostJobModal(false);
        };

        return (
          <Form
            className="mt-6 overflow-hidden shadow sm:rounded-md"
            style={isSubmitting ? { opacity: 0.5 } : {}}
          >
            <fieldset>
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
                  <div className="col-span-6">
                    <Input
                      id="contactInformation"
                      label="Contact Information"
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
                      min={50}
                    />
                  </div>
                  <div className="col-span-2">
                    <Currency
                      id="requiredDeposit"
                      placeholder="0.3"
                      min={50}
                      label="Buy-In"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input id="endDate" label="End Date" type="date" />
                  </div>
                  <div className="col-span-6 flex w-full bg-gray-50 px-4 py-5 sm:p-6">
                    <div className="w-1/2">
                      <PaymentSummary tokenName={values?.token} data={values} />
                    </div>
                    <div className="w-1/2">
                      <OptionsSummary data={values} />
                    </div>
                  </div>
                  <SubmitButton disabled={!(isValid && dirty)} />
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
            </fieldset>
          </Form>
        );
      }}
    </Formik>
  );

  function handleSubmit() {
    setShowPostJobModal(true);
  }
};

export default CreateContractForm;
