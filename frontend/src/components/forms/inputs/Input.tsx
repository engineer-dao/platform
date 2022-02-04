import React from 'react';

import { Field } from 'formik';

interface IInputProps {
  id: string;
  label: string;
}

const Input: React.FC<IInputProps> = (props) => {
  const { id, label } = props;

  return (
    <>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <Field
          type="text"
          label={label}
          name={id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </label>
    </>
  );
};

export default Input;
