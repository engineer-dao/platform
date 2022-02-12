import React, { useState } from 'react';
import { useWallet } from 'components/wallet/useWallet';
import {
  SmartContractContext,
  SmartContractState,
  buildSmartContractState,
} from 'components/smart-contracts/SmartContractContext';

import {
  useERC20Approval,
  useERC20ApprovalEventsFilter,
} from 'components/smart-contracts/useERC20Events';

export const ContractsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isERC20Approved, setIsERC20Approved] = useState(false);

  // connect the contracts using the wallet when the wallet state changes
  const wallet = useWallet();
  const contracts: SmartContractState = buildSmartContractState(
    wallet,
    isERC20Approved
  );

  // load the initial approval status from the token contract
  useERC20Approval(wallet, contracts, (isApproved) => {
    setIsERC20Approved(isApproved);
  });

  // listen to ERC20 token approval status when the blockchain changes
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
