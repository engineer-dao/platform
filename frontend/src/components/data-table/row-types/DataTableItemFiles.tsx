import { PaperClipIcon } from '@heroicons/react/solid';
import React from 'react';
import { IDataTableItemFiles } from '../../../interfaces/IDataTableItem';

const DataTableItemFiles: React.FC<IDataTableItemFiles> = (props) => {
  const { label, value } = props;

  if (!Array.isArray(value)) return null;

  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
          {/* To be replaced: these types will all be different in the future as we hook up to real data. */}
          {(value as any[]).map((item: any, index: number) => (
            <li
              key={index}
              className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
            >
              <div className="flex w-0 flex-1 items-center">
                <PaperClipIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-2 w-0 flex-1 truncate">
                  {item.filename}
                </span>
              </div>
              <div className="ml-4 flex-shrink-0">
                <a
                  href={item.link}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
};

export default DataTableItemFiles;
