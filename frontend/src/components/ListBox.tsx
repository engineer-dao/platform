import { useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { IListBoxItem } from '../interfaces/IListBoxItem';
import { useField } from 'formik';
import classNames from 'classnames';
import { CheckIcon } from '@heroicons/react/solid';

interface IListBoxProps {
  items: IListBoxItem[];
  name: string;
}

export const ListBox: React.FC<IListBoxProps> = ({ items, name }) => {
  const [selectedItems, setSelectedItems] = useState<IListBoxItem[]>([]);

  // eslint-disable-next-line
  const [field, meta, helpers] = useField(name);

  useEffect(() => {
    helpers.setValue(selectedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  return (
    <div className="relative z-50 flex items-center justify-center">
      <div className="mx-auto w-full">
        <Listbox
          as="div"
          className="space-y-1"
          value={selectedItems}
          onChange={setSelectedItems}
          multiple
        >
          {() => (
            <div className="relative">
              <span className="inline-block w-full rounded-md shadow-sm">
                <Listbox.Button className="focus:outline-none focus:shadow-outline-blue relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-blue-300 sm:text-sm sm:leading-5">
                  <span className="block truncate">
                    {selectedItems?.length < 1
                      ? 'Select'
                      : selectedItems.map((item) => item.name).join(', ')}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Listbox.Button>
              </span>

              <Transition
                unmount={false}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
              >
                <Listbox.Options className="focus:outline-none absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
                  {items.map((item) => (
                    <Listbox.Option
                      key={item.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-pointer select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {item.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
    </div>
  );
};
