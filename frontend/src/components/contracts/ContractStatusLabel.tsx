import classNames from 'classnames';
import { ContractStatus } from '../../enums/ContractStatus';

interface IContractStatusLabelProps {
  status: keyof typeof ContractStatus;
}

const ContractStatusLabel: React.FC<IContractStatusLabelProps> = (props) => {
  const { status } = props;

  let _color;

  switch (status) {
    case 'available':
      _color = 'text-green-600';
      break;
    case 'active':
      _color = 'text-blue-600';
      break;
    case 'awaiting_payment':
      _color = 'text-orange-600';
      break;
    case 'completed':
      _color = 'text-gray-600';
      break;
    case 'disputed':
      _color = 'text-red-600';
      break;
    case 'close_requested':
      _color = 'text-red-400';
      break;
    case 'closed':
      _color = 'text-gray-400';
      break;
  }

  return (
    <h3 className={classNames('text-md font-medium truncate', _color)}>
      {ContractStatus[status]}
    </h3>
  );
};

export default ContractStatusLabel;
