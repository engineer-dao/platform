import classNames from 'classnames';
import React from 'react';
import { JobState, JobStateLabels } from 'enums/JobState';

interface IStatusChipProps {
  state?: JobState;
  color?: string;
  size?: 'large' | 'medium' | 'small';
}

const StatusChip: React.FC<IStatusChipProps> = (props) => {
  const { state, color, size = 'large' } = props;

  let _color = color;

  const red = 'bg-red-400 text-white';
  const green = 'bg-green-200 text-green-800';
  const blue = 'bg-blue-600 text-white';
  const yellow = 'bg-yellow-600 text-white';
  const darkGreen = 'bg-green-600 text-white';
  const gray = 'bg-gray-600 text-white';
  const lightGray = 'bg-gray-200 text-white';

  switch (state) {
    case JobState.Available:
      _color = green;
      break;
    case JobState.Started:
      _color = blue;
      break;
    case JobState.Completed:
      _color = yellow;
      break;
    case JobState.Disputed:
      _color = red;
      break;
    case JobState.FinalApproved:
      _color = darkGreen;
      break;
    case JobState.FinalCanceledBySupplier:
      _color = red;
      break;
    case JobState.FinalMutualClose:
      _color = gray;
      break;
    case JobState.FinalNoResponse:
      _color = darkGreen;
      break;
    case JobState.FinalDisputeResolvedForSupplier:
      _color = gray;
      break;
    case JobState.FinalDisputeResolvedForEngineer:
      _color = gray;
      break;
    case JobState.FinalDisputeResolvedWithSplit:
      _color = gray;
      break;
    default:
      _color = lightGray;
      break;
  }

  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full font-medium',
        size === 'large' && 'px-4 py-1 text-lg',
        size === 'medium' && 'text-md px-3 py-1',
        size === 'small' && 'px-2 py-0.5 text-sm',
        _color
      )}
    >
      {state ? JobStateLabels[state] : '...'}
    </span>
  );
};

export default StatusChip;
