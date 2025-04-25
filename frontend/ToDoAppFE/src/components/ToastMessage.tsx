import { useEffect } from "react";

type ToastMessageProps = {
  message: string | React.ReactNode;
  type?: "success" | "error";
  onClose: () => void;
};

const ToastMessage = ({ message, type = "success", onClose }: ToastMessageProps) => {
  useEffect(() => {
    if (typeof message === "string") {
      const timeout = setTimeout(onClose, 4000);
      return () => clearTimeout(timeout);
    }
  }, [message, onClose]);

  // Sceglie colore e icona in base al tipo
  const bgClass = type === "success" ? "bg-teal-100" : "bg-red-100";
  const iconClass = type === "success" ? "bi bi-check-circle text-success" : "bi bi-exclamation-circle text-danger";

  return (
    <>
      {/* Sfondo scuro dietro il toast */}
      <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-2"></div>

      {/* Toast */}
      <div className="position-fixed top-50 start-50 translate-middle z-3">
        <div className={`toast show ${bgClass} text-dark border shadow rounded`}>
          <div className="d-flex align-items-start justify-content-between p-4">
            <div className="d-flex align-items-start">
              <i className={`${iconClass} me-2 fs-5`}></i>
              <div className="toast-message">{message}</div>
            </div>
            <button type="button" className="btn-close ms-3" aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToastMessage;
