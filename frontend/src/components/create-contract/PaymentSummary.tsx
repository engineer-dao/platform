const PaymentSummary = () => {
  return (
    <>
      <p className="text-lg font-medium leading-6">Summary</p>
      <p className="mt-1 text-sm font-normal leading-5">
        1.3 ETH Bounty + 0.1 ETH Buy-In
      </p>
      <p className="text-lg font-semibold leading-7">1.4 ETH Total Payout</p>
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
