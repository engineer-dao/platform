import classNames from 'classnames';
import React from 'react';
import { JobState, JobStateLabels } from 'enums/JobState';

interface IStatusChipProps {
  status: JobState;
  color?: string;
  size?: 'large' | 'small';
}

const StatusChip: React.FC<IStatusChipProps> = (props) => {
  const { status, color, size = 'large' } = props;

  let _color = color;

  switch (status) {
    case JobState.Available:
      _color = 'bg-green-200 text-green-800';
      break;
    case JobState.Started:
      _color = 'bg-blue-600 text-white';
      break;
    case JobState.Completed:
      _color = 'bg-yellow-600 text-white';
      break;
    case JobState.FinalApproved:
      _color = 'bg-gray-600 text-white';
      break;
    case JobState.Disputed:
      _color = 'bg-red-400 text-white';
      break;
    case JobState.FinalNoResponse:
      _color = 'bg-red-100 text-red-800';
      break;
    case JobState.FinalMutualClose:
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
      {JobStateLabels[status]}
    </span>
  );
};

export default StatusChip;
