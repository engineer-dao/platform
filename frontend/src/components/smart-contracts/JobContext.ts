import { IJobData } from 'interfaces/IJobData';
import { createContext } from 'react';

interface IJobContext {
  job: IJobData | undefined;
  loading: boolean;
}

const initialJobContextValue: IJobContext = {
  job: undefined,
  loading: true,
};

export const JobContext = createContext<IJobContext>(initialJobContextValue);
