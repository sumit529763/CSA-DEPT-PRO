import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents kick-out on refresh

  useEffect(() => {
    const restoreSession = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (savedUser && token) {
          // If we have both, restore the user to state
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Session restoration failed:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false); // Check complete
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    
    // Save to State
    setUser(data.user);
    
    // Save to LocalStorage for persistence
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    
    return data;
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isSuperAdmin = user?.role === "superadmin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isSuperAdmin,
        login,
        logout,
        loading // Shared so ProtectedRoute knows when to wait
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);