import classNames from 'classnames';
import React from 'react';
import { ContractStatus } from '../../enums/ContractStatus';

interface IStatusChipProps {
  status: keyof typeof ContractStatus;
  color?: string;
}

const StatusChip: React.FC<IStatusChipProps> = (props) => {
  const { status, color } = props;

  let _color = color;

  switch (status) {
    case 'available':
      _color = 'bg-green-200 text-green-800';
      break;
    case 'active':
      _color = 'bg-blue-600 text-white';
      break;
    case 'awaiting_payment':
      _color = 'bg-orange-300 text-white';
      break;
    case 'completed':
      _color = 'bg-gray-400 text-white';
      break;
    case 'disputed':
      _color = 'bg-red-400 text-white';
      break;
    case 'close_requested':
      _color = 'bg-red-300 text-white';
      break;
    case 'closed':
      _color = 'bg-red-100 text-red-800';
      break;
  }

  return (
    <span
      className={classNames(
        'inline-flex items-center px-4 py-1 rounded-full text-lg font-medium',
        _color
      )}
    >
      {ContractStatus[status]}
    </span>
  );
};

export default StatusChip;
