import React from 'react';
import './ConfirmationModal.css'; // Add custom styles for the modal

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to delete this product?</h3>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">Yes, Delete</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
