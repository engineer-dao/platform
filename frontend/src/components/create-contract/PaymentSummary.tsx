import { ICreateContractForm } from './ICreateContractForm';

const PaymentSummary = ({
  tokenName,
  data,
}: {
  tokenName?: string;
  data: ICreateContractForm;
}) => {
  const token = tokenName || process.env.REACT_APP_PAYMENT_TOKEN_NAME || '';

  const bounty = data.bounty ? parseInt(data.bounty) : 0;
  const buyIn = bounty * 0.1;

  const totalPayout = bounty + buyIn;

  return (
    <>
      <p className="text-lg font-medium leading-6">Summary</p>
      <p className="mt-1 text-sm font-normal leading-5">
        {bounty} {token} Bounty + {buyIn} {token} Buy-In
      </p>
      <p className="text-lg font-semibold leading-7">
        {totalPayout} {token} Total Payout
      </p>
      <button
        type="button"
        className="focus:outline-none mt-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        How It Works
      </button>
    </>
  );
};

export default PaymentSummary;
