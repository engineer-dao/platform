import { useSmartContractCall, useSmartContracts } from './useSmartContracts';

export const useDAOFee = () => {
  const { contracts } = useSmartContracts();
  const [daoFee, daoFeeLoading] = useSmartContractCall(contracts.Job.DAO_FEE);

  const daoFeeAsPercentage = (daoFee?.toNumber() || 0) / 10000;

  return { daoFee: daoFeeAsPercentage, isLoading: daoFeeLoading };
};
