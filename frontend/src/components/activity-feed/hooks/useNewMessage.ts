import {
  useAccountIsJobContractDisputeResolver,
  useAccountIsJobContractOwner,
  useJob,
} from 'components/smart-contracts/hooks/useJob';
import { useWallet } from 'components/wallet/useWallet';
import { addressesMatch } from 'utils/ethereum';

export const useAccountCanPostNewMessage = (): [
  canPost: boolean,
  isLoading: boolean
] => {
  const { job, isLoading: jobIsLoading } = useJob();
  const { account } = useWallet();
  const [isDisputeResolver] = useAccountIsJobContractDisputeResolver();
  const [isOwner] = useAccountIsJobContractOwner();

  let canPost = false;
  if (
    addressesMatch(account, job?.supplier) ||
    addressesMatch(account, job?.engineer) ||
    isDisputeResolver ||
    isOwner
  ) {
    canPost = true;
  }

  return [canPost, jobIsLoading];
};
