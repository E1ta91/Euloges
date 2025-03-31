import React from 'react'

const ChatModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <button onClick={onClose} className="text-right">
            Close
          </button>
          {children}
        </div>
      </div>
    );
  };


export default ChatModal