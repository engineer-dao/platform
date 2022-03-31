import { useDAOFee } from '../smart-contracts/hooks/useDAOFee';
import { ICreateContractForm } from './form/ICreateContractForm';

const PaymentSummary = ({
  tokenName,
  data,
}: {
  tokenName?: string;
  data: ICreateContractForm;
}) => {
  const { daoFee, isLoading } = useDAOFee();

  const token = tokenName || process.env.REACT_APP_PAYMENT_TOKEN_NAME || '';

  const bounty = data.bounty ? parseInt(data.bounty) : 0;
  const deposit = data.requiredDeposit ? parseInt(data.requiredDeposit) : 0;

  const totalPayout = bounty + deposit;

  const serviceFee = bounty * daoFee;

  return !isLoading ? (
    <>
      <p className="text-lg font-medium leading-6">Summary</p>
      <p className="mt-1 text-sm font-normal leading-5">
        {bounty} {token} Bounty + {deposit} {token} Buy-In
      </p>
      <p className="leading-2 text-xs">
        + {serviceFee} {token} Service Fee ({daoFee * 100}%)
      </p>
      <p className="text-lg font-semibold leading-7">
        {totalPayout} {token} Total Payout
      </p>

      <a
        href="https://engineerdao.notion.site/How-It-Works-6ce13129b9244abf981b41666b90797e"
        className="focus:outline-none mt-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        How It Works
      </a>
    </>
  ) : null;
};

export default PaymentSummary;
