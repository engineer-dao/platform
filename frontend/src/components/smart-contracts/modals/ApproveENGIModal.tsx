import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import {
  SmartContractAddresses,
  useSmartContracts,
} from 'components/smart-contracts/hooks/useSmartContracts';
import { constants, ContractReceipt } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';

export const ApproveENGIModal = (props: ITransactionModalProps) => {
  const { show, onFinish, onError } = props;

  const { contracts, updateENGIApproval } = useSmartContracts();

  // the logic called to initiate the transaction
  const callContract = async () => {
    return contracts.ENGIToken.approve(
      SmartContractAddresses.Job,
      constants.MaxUint256
    );
  };

  // what to do when the transaction is confirmed on the blockchain
  const onConfirmed = (receipt: ContractReceipt) => {
    updateENGIApproval(true);
  };

  // render the transaction modal
  return (
    <TransactionModal
      title="Approving ENGI Spending"
      {...{ show, callContract, onConfirmed, onFinish, onError }}
    />
  );
};
