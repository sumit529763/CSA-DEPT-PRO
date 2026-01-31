import { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isSuperAdmin = user?.role === "superadmin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isSuperAdmin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
/* 🔥 THIS EXPORT WAS MISSING OR BROKEN */
export const useAuth = () => useContext(AuthContext);
