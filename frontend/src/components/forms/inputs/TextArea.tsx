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
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
      />
    </>
  );
};

export default TextArea;
