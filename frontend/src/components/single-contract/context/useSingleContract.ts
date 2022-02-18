import { useContext } from 'react';
import { SingleContractContext } from './SingleContractContext';

export const useSingleContract = () => {
  const context = useContext(SingleContractContext);
  if (!context) {
    throw new Error('No Single Contract Context Found');
  }
  return context;
};
