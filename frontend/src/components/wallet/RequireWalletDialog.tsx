import { useWallet } from 'components/wallet/useWallet';

interface IWalletDialogProps {
  message?: string;
}

export const RequireWalletDialog = (props: IWalletDialogProps) => {
  const message = props.message || 'Please connect your wallet to continue.';
  const { connectToWallet } = useWallet();

  return (
    <>
      <div className="col-span-6 mt-12 bg-white px-4 py-5 text-center text-sm font-normal leading-5 shadow sm:rounded-md sm:p-6">
        <div className="mt-2 text-gray-800">{message}</div>

        <button
          onClick={connectToWallet}
          className="focus:outline-none mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="w-full">Connect Wallet</div>
        </button>
      </div>
    </>
  );
};
