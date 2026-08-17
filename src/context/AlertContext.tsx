import { createContext, useContext, useState, type ReactNode } from "react";

interface AlertOptions {
  message: string;
  onConfirm?: () => void;
  type?: "alert" | "confirm";
}

interface AlertContextType {
  showAlert: (message: string) => void;
  showConfirm: (message: string, onConfirm: () => void) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    options: AlertOptions;
  }>({
    isOpen: false,
    options: { message: "", type: "alert" },
  });

  const showAlert = (message: string) => {
    setAlert({ isOpen: true, options: { message, type: "alert" } });
  };

  const showConfirm = (message: string, onConfirm: () => void) => {
    setAlert({ isOpen: true, options: { message, type: "confirm", onConfirm } });
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, options: { message: "", type: "alert" } });
  };

  const handleConfirm = () => {
    alert.options.onConfirm?.();
    closeAlert();
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {alert.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{alert.options.message}</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={closeAlert}>
                {alert.options.type === "confirm" ? "Cancel" : "OK"}
              </button>
              {alert.options.type === "confirm" && (
                <button onClick={handleConfirm}>Yes</button>
              )}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
