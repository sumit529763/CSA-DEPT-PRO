// src/pages/Login/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Login.css";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  // Math Captcha States
  const [captchaData, setCaptchaData] = useState({ num1: 0, num2: 0 });
  const [userAnswer, setUserAnswer]   = useState("");

  const [error, setError]             = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // Generate new math captcha question
  const generateCaptcha = () => {
    setCaptchaData({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
    });
    setUserAnswer("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // ✅ Safe redirect — if already logged in, skip login page
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

    // Frontend captcha check
    if (parseInt(userAnswer) !== captchaData.num1 + captchaData.num2) {
      setError("Incorrect captcha. Please solve the math correctly.");
      generateCaptcha();
      return;
    }

    setIsLoggingIn(true);

    try {
      const data = await login(
        email,
        password,
        userAnswer,
        captchaData.num1,
        captchaData.num2
      );

      // ✅ Role-based redirect after successful login
      if (data.user.role === "superadmin") {
        navigate("/admin/super/users", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }

    } catch (err) {
      setIsLoggingIn(false);
      setError(err.response?.data?.message || "Login failed.");
      generateCaptcha();
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
        <p className="login-subtitle">CSA Department Access Control</p>

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
              autoComplete="current-password"
              required
            />
          </div>

          <div className="captcha-section">
            <label>Verify: {captchaData.num1} + {captchaData.num2} = ?</label>
            <input
              type="number"
              placeholder="Enter result"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="captcha-input"
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
      </section>
    </main>
  );
}