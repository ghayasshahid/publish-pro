import { createContext, useContext, useState, type ReactNode } from "react";

interface AlertContextType {
  showAlert: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

  const showAlert = (message: string) => {
    setAlert({ isOpen: true, message });
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, message: "" });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{alert.message}</p>
            <button onClick={closeAlert}>OK</button>
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
