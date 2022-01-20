import React from 'react';

interface IInputProps {
  id: string;
  label: string;
}

const Input: React.FC<IInputProps> = (props) => {
  const { id, label } = props;

  return (
    <>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        id={id}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </>
  );
};

export default Input;
