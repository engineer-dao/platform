import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import {
  SmartContractAddresses,
  useSmartContracts,
} from 'components/smart-contracts/hooks/useSmartContracts';
import { constants, ContractReceipt } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';

export const ApproveUSDCModal = (props: ITransactionModalProps) => {
  const { show, onFinish, onError } = props;

  const { contracts, updateUSDCApproval } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    return contracts.USDCToken.approve(
      SmartContractAddresses.Job,
      constants.MaxUint256
    );
  };

  // what to do when the transaction is confirmed on the blockchain
  const onConfirmed = (receipt: ContractReceipt) => {
    updateUSDCApproval(true);
  };

  // render the transaction modal
  return (
    <TransactionModal
      title="Approving USDC Spending"
      {...{ show, callContract, onConfirmed, onFinish, onError }}
    />
  );
};
