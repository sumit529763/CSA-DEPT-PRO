// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State for the loading effect

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true); // Start loading immediately on submit

    try {
      const user = await login(email, password);

      // We add a small artificial delay so the user can actually see 
      // the professional loading effect before the redirect
      setTimeout(() => {
        if (user.user.role === "superadmin") {
          navigate("/admin/super/users", { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      }, 1500);

    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    }

  };

  // If the system is authenticating, show the spinner instead of the form
  if (isLoggingIn) {
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
          {error && <div className="login-error">{error}</div>}

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