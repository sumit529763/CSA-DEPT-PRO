// src/components/Routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show the professional loading effect while checking auth status
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p className="loading-text">AUTHENTICATING...</p>
      </div>
    );
  }

  // If not logged in, kick them back to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}