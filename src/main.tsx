import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import globalStateStore from "./GlobalStateStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertProvider } from "./context/AlertContext";
import "./styles/styles.scss";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={globalStateStore}>
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AlertProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
