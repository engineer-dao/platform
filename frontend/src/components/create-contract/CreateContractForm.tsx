import Currency from '../forms/inputs/Currency';
import Dropzone from '../forms/inputs/Dropzone';
import Input from '../forms/inputs/Input';
import TextArea from '../forms/inputs/TextArea';
import { ListBox } from '../ListBox';
import { acceptanceTestsItems, identityItems, labelItems } from './labels';
import OptionsSummary from './OptionsSummary';
import PaymentSummary from './PaymentSummary';

const CreateContractForm = () => {
  return (
    <div className="mt-6 overflow-hidden shadow sm:rounded-md">
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
              id="acceptance-criteria"
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
            <label
              htmlFor="bounty"
              className="block text-sm font-medium text-gray-700"
            >
              Bounty
            </label>
            <Currency id="bounty" placeholder="1" label="ETH" />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="buy-in"
              className="block text-sm font-medium text-gray-700"
            >
              Buy-In
            </label>
            <Currency id="buy-in" placeholder="0.3" label="ETH" />
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
              <PaymentSummary />
            </div>
            <div className="w-1/2">
              <OptionsSummary />
            </div>
          </div>
          <div className="col-span-6 text-right text-sm font-normal leading-5 text-white">
            <button
              type="button"
              className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Fund &amp; Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContractForm;
