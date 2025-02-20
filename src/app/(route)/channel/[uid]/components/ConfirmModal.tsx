'use client';

import React from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onCancel}>
      <div 
        className="bg-white p-6 rounded shadow-md max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}>
        <p className="mb-10 mt-4 text-md font-semibold flex justify-center">{message}</p>
        <div className="flex">
          <button
            onClick={onCancel}
            className="w-1/2 mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 px-4 py-2 bg-[#1bb373] text-white rounded hover:bg-[#15744c]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
