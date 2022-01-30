import React, { useState } from 'react';
import { useWallet } from 'components/wallet/useWallet';
import {
  SmartContractContext,
  SmartContractState,
  buildSmartContractState,
  useERC20ApprovalEventsFilter,
} from 'components/smart-contracts/SmartContractContext';

export const ContractsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isERC20Approved, setIsERC20Approved] = useState(false);

  // connect the the contracts using the wallet when the wallet state changes
  const wallet = useWallet();
  const contracts: SmartContractState = buildSmartContractState(
    wallet,
    isERC20Approved
  );

  // update ERC20 token status when the blockchain changes
  useERC20ApprovalEventsFilter(wallet, contracts, (isApproved) => {
    setIsERC20Approved(isApproved);
  });

  // create a context to pass down
  const smartContractsContext = {
    contracts: contracts,
    updateERC20Approval: (approved: boolean) => {
      setIsERC20Approved(approved);
    },
  };

  return (
    <SmartContractContext.Provider value={smartContractsContext}>
      {children}
    </SmartContractContext.Provider>
  );
};
