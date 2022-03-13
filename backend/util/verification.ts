import { getJobContract } from 'services/contract';

// supplier, engineer, owner and dispute resolver can post
export const addressIsValidForJobId = async (
  address: string,
  jobId: string
) => {
  const Job = getJobContract();
  const jobData = await Job.jobs(jobId);

  if (
    addressesMatch(address, jobData.supplier) ||
    addressesMatch(address, jobData.engineer)
  ) {
    return true;
  }

  if (await isDisputeResolver(address)) {
    return true;
  }

  if (await isOwner(address)) {
    return true;
  }

  return false;
};

export const isDisputeResolver = async (address?: string | null) => {
  const Job = getJobContract();
  const disputeResolver = await Job.disputeResolver();

  return addressesMatch(address, disputeResolver);
};

export const isOwner = async (address?: string | null) => {
  const Job = getJobContract();
  const owner = await Job.owner();

  return addressesMatch(address, owner);
};

export const addressesMatch = (
  address1: string | undefined | null,
  address2: string | undefined | null
) => {
  return (
    address1 && address2 && address1.toLowerCase() === address2.toLowerCase()
  );
};
