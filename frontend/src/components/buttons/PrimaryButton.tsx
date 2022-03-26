import classNames from 'classnames';
import React from 'react';
import { ButtonColor } from '../../enums/ButtonColor';

interface IPrimaryButton {
  onClick: () => void;
  content: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'submit' | 'button';
  classname?: string;
  color?: keyof typeof ButtonColor;
}

const PrimaryButton: React.FC<IPrimaryButton> = (props) => {
  const { onClick, content, disabled, type, classname, color, loading } = props;

  let mainColor = 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600';
  let disabledColor = 'bg-indigo-100 hover:bg-indigo-100';

  switch (color) {
    case 'green': {
      mainColor = 'bg-green-600 hover:bg-green-700 focus:ring-green-600';
      disabledColor = 'bg-green-100 hover:bg-green-100';
      break;
    }
    case 'red': {
      mainColor = 'bg-red-600 hover:bg-red-700 focus:ring-red-600';
      disabledColor = 'bg-red-100 hover:bg-red-100';
      break;
    }
    case 'blue':
      break;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={classNames(
        'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-white shadow-sm focus:ring-2 focus:ring-offset-2',
        {
          [mainColor]: !disabled,
          [disabledColor]: disabled,
        },
        classname
      )}
    >
      {loading ? 'Loading' : content}
    </button>
  );
};

export default PrimaryButton;
