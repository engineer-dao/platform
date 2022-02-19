import { useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { IListBoxItem } from '../interfaces/IListBoxItem';
import { useField } from 'formik';

interface IListBoxProps {
  items: IListBoxItem[];
  name: string;
}

export const ListBox: React.FC<IListBoxProps> = ({ items, name }) => {
  const [selectedItems, setSelectedItems] = useState<IListBoxItem[]>([
    items[3],
  ]);

  // eslint-disable-next-line
  const [field, meta, helpers] = useField(name);

  useEffect(() => {
    helpers.setValue(selectedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  function isSelected(value: string) {
    return selectedItems.find((el: IListBoxItem) => el.name === value)
      ? true
      : false;
  }

  function handleSelect(value: string) {
    if (!isSelected(value)) {
      const newItem = items.find((el: IListBoxItem) => el.name === value);
      if (newItem) {
        const selectedItemsUpdated = [...selectedItems, newItem];
        setSelectedItems(selectedItemsUpdated);
      }
    } else {
      handleDeselect(value);
    }
  }

  function handleDeselect(value: string) {
    const selectedItemsUpdated = selectedItems.filter(
      (el: IListBoxItem) => el.name !== value
    );
    setSelectedItems(selectedItemsUpdated);
  }

  return (
    <div className="relative z-50 flex items-center justify-center">
      <div className="mx-auto w-full">
        <Listbox
          as="div"
          className="space-y-1"
          value={selectedItems}
          onChange={(value: any) => handleSelect(value)}
        >
          {() => (
            <div className="relative">
              <span className="inline-block w-full rounded-md shadow-sm">
                <Listbox.Button className="focus:outline-none focus:shadow-outline-blue relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-blue-300 sm:text-sm sm:leading-5">
                  <span className="block truncate">
                    {selectedItems.length < 1
                      ? 'Select'
                      : `Selected (${selectedItems.length})`}
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
                <Listbox.Options
                  static
                  className="shadow-xs focus:outline-none max-h-60 overflow-auto rounded-md py-1 text-base leading-6 sm:text-sm sm:leading-5"
                >
                  {items.map((item: IListBoxItem) => {
                    const selected = isSelected(item.name);
                    return (
                      <Listbox.Option key={item.id} value={item.name}>
                        {({ active }) => (
                          <div
                            className={`${
                              active
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-900'
                            } relative cursor-default select-none py-2 pl-8 pr-4`}
                          >
                            <span
                              className={`${
                                selected ? 'font-semibold' : 'font-normal'
                              } block truncate`}
                            >
                              {item.name}
                            </span>
                            {selected && (
                              <span
                                className={`${
                                  active ? 'text-white' : 'text-blue-600'
                                } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                              >
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </div>
                        )}
                      </Listbox.Option>
                    );
                  })}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
    </div>
  );
};
