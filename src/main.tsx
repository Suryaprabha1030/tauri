import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { TawkProvider } from "./context/TawkProvider.tsx";
import { AuthContextProvider } from "./context/authContextProvider.tsx";
import { WebSocketProvider } from "./context/websocketContextProvider.tsx";
import CustomToastContainer from "./components/shared/CustomToastContainer.tsx";
import Toaster from "./components/shared/commonUtil/Toaster.tsx";
import StoreProvider from "./lib/redux/Provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <TawkProvider>
          <AuthContextProvider>
            <WebSocketProvider>
              <App />
            </WebSocketProvider>
            <CustomToastContainer />
            <Toaster />
          </AuthContextProvider>
        </TawkProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
);
