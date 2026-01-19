import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx"; 

import "./styles/global.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// 4. Dynamic Basename
const basename = import.meta.env.BASE_URL || "/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Error Boundary wraped the entire routed app */}
    <ErrorBoundary>
      <BrowserRouter
        basename={basename} 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);