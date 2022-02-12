import classNames from 'classnames';
import React from 'react';
import { IJobState } from 'interfaces/IJobData';

interface IStatusChipProps {
  status: IJobState;
  color?: string;
  size?: 'large' | 'small';
}

const StatusChip: React.FC<IStatusChipProps> = (props) => {
  const { status, color, size = 'large' } = props;

  let _color = color;

  switch (status) {
    case IJobState.Available:
      _color = 'bg-green-200 text-green-800';
      break;
    case IJobState.Started:
      _color = 'bg-blue-600 text-white';
      break;
    case IJobState.Completed:
      _color = 'bg-orange-300 text-white';
      break;
    case IJobState.FinalApproved:
      _color = 'bg-gray-400 text-white';
      break;
    case IJobState.Disputed:
      _color = 'bg-red-400 text-white';
      break;
    case IJobState.FinalNoResponse:
      _color = 'bg-red-100 text-red-800';
      break;
    case IJobState.FinalMutualClose:
      _color = 'bg-red-300 text-white';
      break;
  }

  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full font-medium',
        size === 'large' && 'px-4 py-1 text-lg',
        size === 'small' && 'px-2 py-0.5 text-sm',
        _color
      )}
    >
      {IJobState[status]}
    </span>
  );
};

export default StatusChip;
