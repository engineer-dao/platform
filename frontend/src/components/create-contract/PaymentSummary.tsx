const PaymentSummary = () => {
  return (
    <>
      <p className="text-lg leading-6 font-medium">Summary</p>
      <p className="mt-1 text-sm leading-5 font-normal">
        1.3 ETH Bounty + 0.1 ETH Buy-In
      </p>
      <p className="text-lg leading-7 font-semibold">1.4 ETH Total Payout</p>
      <button
        type="button"
        className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        How It Works
      </button>
    </>
  );
};

export default PaymentSummary;
