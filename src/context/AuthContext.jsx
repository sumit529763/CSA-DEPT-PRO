// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const savedToken = localStorage.getItem("auth_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        authService.logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    
    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("auth_token", data.token);

    return data.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";
  const isSuperAdmin = user?.role?.toLowerCase() === "superadmin";

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isSuperAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);