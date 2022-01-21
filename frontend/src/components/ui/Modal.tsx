import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/outline';

import { IModalProps } from 'interfaces/IModalProps';
import { DynamicHeroIcon } from 'components/ui/DynamicHeroIcon';

/*
// usage:
import { useState } from 'react';
import { Modal } from 'components/ui/Modal';

export const MyComponent: React.FunctionComponent = () => {
  const [showModal, setShowModal] = useState(false);

  // find Icon types at https://unpkg.com/browse/@heroicons/react@1.0.5/outline/index.js
  return (
    <>
      <button
        className="mt-2 rounded-lg border-2 border:gray-700 text-gray-200 hover:border-white hover:bg-gray-700 hover:text-white py-2 px-3 w-100 whitespace-nowrap"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Click this button to show the Modal Dialog
      </button>


      <Modal
        title="Example Modal Title"
        icon="EmojiHappyIcon"
        closeButton="I'm good"
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <p>The body of the modal content here.</p>
        <p>Another line of information is here.</p>
      </Modal>
    </>
  );
};
*/

export const Modal: React.FunctionComponent<IModalProps> = (
  props: IModalProps
) => {
  const [open, setOpen] = useState(props.isOpen);

  const onClose = () => {
    props.onRequestClose && props.onRequestClose();
  };

  return (
    <Transition.Root show={props.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <DynamicHeroIcon
                    icon={props.icon ?? 'CheckIcon'}
                  ></DynamicHeroIcon>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    {props.title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{props.children}</p>
                  </div>
                </div>
              </div>
              {props.closeButton && (
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => onClose()}
                  >
                    {props.closeButton}
                  </button>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
