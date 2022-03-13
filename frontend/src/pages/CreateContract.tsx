import { RequireWalletDialog } from 'components/wallet/RequireWalletDialog';
import { useWallet } from 'components/wallet/useWallet';
import ApproveTokenDialog from '../components/create-contract/form/ApproveTokenDialog';
import CreateContractForm from '../components/create-contract/form/CreateContractForm';
import { useSmartContracts } from '../components/smart-contracts/hooks/useSmartContracts';

export const CreateContract = () => {
  const { contracts } = useSmartContracts();
  const { account } = useWallet();

  return (
    <>
      <h3 className="text-xl font-medium leading-6 text-gray-900">
        Create Contract
      </h3>
      {!account ? <RequireWalletDialog /> : null}
      {account && !contracts?.isERC20Approved ? <ApproveTokenDialog /> : null}
      <CreateContractForm />
    </>
  );
};
