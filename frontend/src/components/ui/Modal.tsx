import React from 'react';
import { IModalProps } from 'interfaces/IModalProps';
import ReactModal from 'react-modal';

/*
// usage:
import { Modal } from 'components/ui/Modal';

export const WalletConnectionStatus: React.FunctionComponent = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
        }}
      >
        Show
      </button>

      <Modal
        title="Hello World Title"
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <div>Hello World</div>
      </Modal>
    </>
  );
};
*/

export const Modal: React.FunctionComponent<IModalProps> = (
  props: IModalProps
) => {
  const onClose = (event: React.MouseEvent | React.KeyboardEvent) => {
    props.onRequestClose && props.onRequestClose(event);
  };

  return (
    <ReactModal
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
        },
        content: {
          position: 'absolute',
          top: '10%',
          left: '10%',
          right: '10%',
          bottom: '50%',
          border: '2px solid #999',
          background: '#fff',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '4px',
          outline: 'none',
          padding: '0',
        },
      }}
      {...props}
    >
      {/* content */}
      <div className="border-0 relative flex flex-col w-full bg-white outline-none focus:outline-none">
        {/* header */}
        {props.title && (
          <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 bg-gray-800">
            <h3 className="text-3xl font-semibold text-white">{props.title}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-white text-opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="bg-transparent text-white text-opacity-50 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
        )}
        {/* body */}
        <div className="relative p-6 flex-auto">
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            {props.children}
          </p>
        </div>
      </div>
    </ReactModal>
  );
};
