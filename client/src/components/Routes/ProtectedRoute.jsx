import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  // 1. Wait for AuthContext to finish checking localStorage
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div> 
        <p style={{ marginLeft: '10px' }}>Verifying Session...</p>
      </div>
    );
  }

  // 2. If no token or no user, send to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. User is authenticated
  return children;
};

export default ProtectedRoute;