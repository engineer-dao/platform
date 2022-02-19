import { useMemo, useReducer } from 'react';
import { IJobData } from '../../../interfaces/IJobData';
import {
  ISingleContractState,
  SingleContractContext,
} from './SingleContractContext';
import { singleContractReducer } from './SingleContractReducer';

const initialState: ISingleContractState = {
  data: null,
};

export const SingleContractProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
