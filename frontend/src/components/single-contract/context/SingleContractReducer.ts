import { IJobData } from '../../../interfaces/IJobData';
import { ISingleContractState } from './SingleContractContext';

type SingleContractAction = {
  type: 'set_single_contract';
  payload: IJobData;
};

export const singleContractReducer = (
  state: ISingleContractState,
  action: SingleContractAction
): ISingleContractState => {
  switch (action.type) {
    case 'set_single_contract': {
      return {
        ...state,
        data: action?.payload,
      };
    }
    default: {
      return state;
    }
  }
};
