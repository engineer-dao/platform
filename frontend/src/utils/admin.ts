import { addressesMatch } from 'utils/ethereum';

export const isDisputeResolver = (account?: string | null) => {
  return addressesMatch(
    account,
    process.env.REACT_APP_DISPUTE_RESOLVER_ADDRESS
  );
};
