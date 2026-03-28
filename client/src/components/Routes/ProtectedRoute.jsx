// src/components/Routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const token = localStorage.getItem("token");

  // 1. Wait for AuthContext to finish checking localStorage
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner"></div>
        <p style={{ marginLeft: "10px" }}>Verifying Session...</p>
      </div>
    );
  }

  // 2. Not logged in → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. ✅ NEW: superadmin route but user is only admin → redirect to dashboard
  if (requiredRole === "superadmin" && !isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 4. ✅ NEW: admin route but user has no admin role at all
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // 5. All good
  return children;
};

export default ProtectedRoute;