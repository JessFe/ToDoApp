import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { UserContextProvider } from "./context/UserContext.tsx";
import { FiltersContextProvider } from "./context/FiltersContext.tsx";
import BackgroundManager from "./components/BackgroundManager.tsx";

import "./styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      <FiltersContextProvider>
        <BackgroundManager />
        <App />
      </FiltersContextProvider>
    </UserContextProvider>
  </StrictMode>
);
