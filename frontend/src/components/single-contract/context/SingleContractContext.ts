import { createContext } from 'react';
import { IJobData } from '../../../interfaces/IJobData';

export interface ISingleContractState {
  data: IJobData | null;
}

interface ISingleContractContext extends ISingleContractState {
  setSingleContract: (data: IJobData) => void;
}

export const SingleContractContext = createContext<
  ISingleContractContext | undefined
>(undefined);
