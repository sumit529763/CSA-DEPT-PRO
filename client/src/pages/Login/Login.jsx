import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // 🔥 PERSISTENCE FIX: If already logged in, redirect automatically
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "superadmin") {
        navigate("/admin/super/users", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      const response = await login(email, password);
      
      // Delay for professional effect
      setTimeout(() => {
        if (response.user.role === "superadmin") {
          navigate("/admin/super/users", { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      }, 1500);

    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      setIsLoggingIn(false);
      setError(error.response?.data?.message || "Login failed. Check credentials.");
    }
  };

  if (isLoggingIn || loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p className="loading-text">AUTHENTICATING WITH CSA SERVER...</p>
      </div>
    );
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h2 className="login-title">Admin Login</h2>
        <p className="login-subtitle">
          Authorized users only. Please login to continue.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error" style={{color: 'red', marginBottom: '10px', fontSize: '0.8rem'}}>{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@giet.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="login-note">
            Need access? Contact HOD or system administrator.
          </p>
        </form>
      </section>
    </main>
  );
}