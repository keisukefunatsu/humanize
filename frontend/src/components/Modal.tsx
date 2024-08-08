// ModalComponent.tsx
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element to prevent screen readers from reading the content outside the modal

// Define the interface for the props
interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  message: string;
}

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onRequestClose, title, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onRequestClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ModalComponent;