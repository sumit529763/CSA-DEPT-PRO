import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  // No token = not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists = admin or superadmin
  return children;
};

export default ProtectedRoute;
