import { useState } from 'react';
import ApproveTokenDialog from '../components/create-contract/form/ApproveTokenDialog';
import CreateContractForm from '../components/create-contract/form/CreateContractForm';
import { useSmartContracts } from '../components/smart-contracts/hooks/useSmartContracts';
import { ApproveERC20Modal } from '../components/smart-contracts/modals/ApproveERC20Modal';

export const CreateContract = () => {
  const { contracts } = useSmartContracts();

  return (
    <>
      <h3 className="text-xl font-medium leading-6 text-gray-900">
        Create Contract
      </h3>
      {contracts.isERC20Approved ? (
        <CreateContractForm />
      ) : (
        <ApproveTokenDialog />
      )}
    </>
  );
};
