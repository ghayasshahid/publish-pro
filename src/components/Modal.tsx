import React from "react";

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  type: "alert" | "confirm";
}

export const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose, onConfirm, type }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={onClose}>
            {type === "confirm" ? "Cancel" : "OK"}
          </button>
          {type === "confirm" && (
            <button onClick={() => { onConfirm?.(); onClose(); }}>Yes</button>
          )}
        </div>
      </div>
    </div>
  );
};
