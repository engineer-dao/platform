import React from 'react';

import { Field, useField } from 'formik';

interface ITextAreaProps {
  id: string;
  rows: number;
  label: string;
}

const TextArea: React.FC<ITextAreaProps> = (props) => {
  const { id, rows, label } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helpers] = useField(id);

  return (
    <>
      <label className="block text-sm font-medium text-gray-700">
        <div className="flex w-full content-end justify-between">
          <span>{label}</span>
          <span className="self-end text-xs font-light italic text-gray-500">
            Markdown supported 🎉
          </span>
        </div>
        <Field
          component="textarea"
          name={id}
          rows={rows}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

export default TextArea;
