import React from 'react';

import { Field, useField } from 'formik';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

interface IInputProps {
  id: string;
  label: string;
  name: string;
  component?: 'input' | 'textarea';
  rows?: number;
  required?: boolean;
}

const Input: React.FC<IInputProps> = (_props) => {
  const { id, label, required, component, rows, ...props } = _props;
  const [field, meta, helpers] = useField(props);

  const validate = () => {
    if (!required) {
      return;
    }

    if (!field.value) {
      return 'Field required';
    }
  };

  return (
    <>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <div className="relative">
          <Field
            type={!component && 'text'}
            component={component && 'textarea'}
            rows={rows || undefined}
            label={label}
            name={id}
            validate={validate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />

          {meta.touched && meta.error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {meta.error}
        </p>
      </label>
    </>
  );
};

export default Input;
