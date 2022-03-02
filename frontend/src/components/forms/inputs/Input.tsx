import React from 'react';

import { Field, useField } from 'formik';

interface IInputProps {
  id: string;
  label: string;
  type?: 'text' | 'date';
}

const Input: React.FC<IInputProps> = (props) => {
  const { id, label, type } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helpers] = useField(id);

  return (
    <>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <Field
          type={type || 'text'}
          label={label}
          name={id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </label>
      {meta.touched && meta.error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {meta.error}
        </p>
      )}
    </>
  );
};

export default Input;
