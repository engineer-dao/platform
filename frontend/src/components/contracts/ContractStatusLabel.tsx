import classNames from 'classnames';
// import { ContractStatus } from '../../enums/ContractStatus';
import { JobState, JobStateLabels } from 'enums/JobState';

interface IContractStatusLabelProps {
  status: JobState;
}

const ContractStatusLabel: React.FC<IContractStatusLabelProps> = (props) => {
  const { status } = props;

  let _color;

  switch (status) {
    case JobState.Available:
      _color = 'text-green-600';
      break;
    case JobState.Started:
      _color = 'text-blue-600';
      break;
    case JobState.Completed:
      _color = 'text-yellow-600';
      break;
    case JobState.FinalApproved:
      _color = 'text-gray-600';
      break;
    case JobState.Disputed:
      _color = 'text-red-600';
      break;
    case JobState.FinalNoResponse:
      _color = 'text-red-400';
      break;
    case JobState.FinalMutualClose:
      _color = 'text-gray-400';
      break;
  }

  return (
    <h3 className={classNames('text-md truncate font-medium', _color)}>
      {JobStateLabels[status]}
    </h3>
  );
};

export default ContractStatusLabel;
