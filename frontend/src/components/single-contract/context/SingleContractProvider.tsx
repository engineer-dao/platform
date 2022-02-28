import { useMemo, useReducer } from 'react';
import { IJobData } from '../../../interfaces/IJobData';
import { useJob } from '../../smart-contracts/hooks/useJob';
import {
  ISingleContractState,
  SingleContractContext,
} from './SingleContractContext';
import { singleContractReducer } from './SingleContractReducer';

export const SingleContractProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { job } = useJob();

  const initialState: ISingleContractState = {
    data: job || null,
  };

  const [state, dispatch] = useReducer(singleContractReducer, initialState);

  const setSingleContract = (payload: IJobData) => {
    dispatch({
      type: 'set_single_contract',
      payload,
    });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      setSingleContract,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return (
    <SingleContractContext.Provider value={contextValue}>
      {children}
    </SingleContractContext.Provider>
  );
};
