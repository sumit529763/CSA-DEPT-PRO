// src/pages/NotFound/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="error-page">
      <div className="error-window shadow-premium">
        <div className="window-header">
          <div className="window-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <span className="window-title">System_Error.exe</span>
        </div>

        <div className="window-body">
          <h1 className="error-code">404</h1>
          <p className="error-slug">PAGE_NOT_FOUND</p>
          
          <p className="error-message">
            The requested resource could not be found on the GIETU CSA server. 
            The path might be deprecated or the syntax is incorrect.
          </p>

          <div className="code-snippet">
            <pre>
              <code>
                {`if (page === "missing") {
  returnHome();
}`}
              </code>
            </pre>
          </div>

          <div className="error-actions">
            <button className="btn-reconnect" onClick={() => navigate("/")}>
              <i className="fas fa-network-wired"></i> RECONNECT HOME
            </button>
            <button className="btn-explore" onClick={() => navigate("/gallery")}>
              Explore Campus
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}