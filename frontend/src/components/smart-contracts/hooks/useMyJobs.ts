import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { IJobFilter } from '../../../interfaces/IJobFilter';
import { useWallet } from '../../wallet/useWallet';
import { useJobs } from './useJobs';

export const useMyJobs = () => {
  const { account } = useWallet();

  const [jobFilter, setJobFilter] = useState<IJobFilter>({
    fields: {
      supplier: '0x00',
      engineer: '0x00',
    },
  });

  // filter by wallet account (address)
  useEffect(() => {
    if (account) {
      const formattedAddress = ethers.utils.getAddress(account);

      setJobFilter({
        fields: {
          supplier: formattedAddress,
          engineer: formattedAddress,
        },
      });
    }
  }, [account]);

  return useJobs(jobFilter);
};
