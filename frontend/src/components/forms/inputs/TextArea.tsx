import React from 'react';

interface ITextAreaProps {
  id: string;
  rows: number;
  label: string;
}

const TextArea: React.FC<ITextAreaProps> = (props) => {
  const { id, rows, label } = props;

  return (
    <>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </>
  );
};

export default TextArea;
