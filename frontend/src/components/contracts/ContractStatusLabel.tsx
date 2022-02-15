import classNames from 'classnames';
// import { ContractStatus } from '../../enums/ContractStatus';
import { IJobState } from 'interfaces/IJobData';

interface IContractStatusLabelProps {
  status: IJobState;
}

const ContractStatusLabel: React.FC<IContractStatusLabelProps> = (props) => {
  const { status } = props;

  let _color;

  switch (status) {
    case IJobState.Available:
      _color = 'text-green-600';
      break;
    case IJobState.Started:
      _color = 'text-blue-600';
      break;
    case IJobState.Completed:
      _color = 'text-orange-600';
      break;
    case IJobState.FinalApproved:
      _color = 'text-gray-600';
      break;
    case IJobState.Disputed:
      _color = 'text-red-600';
      break;
    case IJobState.FinalNoResponse:
      _color = 'text-red-400';
      break;
    case IJobState.FinalMutualClose:
      _color = 'text-gray-400';
      break;
  }

  return (
    <h3 className={classNames('text-md truncate font-medium', _color)}>
      {IJobState[status]}
    </h3>
  );
};

export default ContractStatusLabel;
