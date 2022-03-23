import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon, FlagIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import React, { Fragment, useState } from 'react';
import ReportModal from '../modals/ReportModal';

const OptionsDropdown = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="mx-4 flex flex-shrink-0 self-center">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="focus:outline-none absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'flex px-4 py-2 text-sm'
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      setModalOpen(true);
                    }}
                  >
                    <FlagIcon
                      className="mr-3 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Report content</span>
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <ReportModal isOpen={modalOpen} setOpen={setModalOpen} />
    </div>
  );
};

export default OptionsDropdown;
