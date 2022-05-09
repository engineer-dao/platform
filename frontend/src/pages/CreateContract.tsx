import { RequireWalletDialog } from 'components/wallet/RequireWalletDialog';
import { useWallet } from 'components/wallet/useWallet';
import CreateContractForm from '../components/create-contract/form/CreateContractForm';

export const CreateContract = () => {
  const { account } = useWallet();

  return (
    <>
      <h3 className="text-xl font-medium leading-6 text-gray-900">
        Create Contract
      </h3>
      {!account ? <RequireWalletDialog /> : null}
      <CreateContractForm />
    </>
  );
};
