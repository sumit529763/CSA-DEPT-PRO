import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "./Profile.css";

export default function Profile() {
  const { user, isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  const strength = (pwd) => {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8)          s++;
    if (/[A-Z]/.test(pwd))        s++;
    if (/[0-9]/.test(pwd))        s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#d42b2b", "#c07800", "#0a9e5c", "#2554f0"];
  const pwdStrength   = strength(passwords.newPassword);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error("Passwords do not match!");
    if (pwdStrength < 2)
      return toast.error("Password is too weak!");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/update-password`,
        { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || "A";
  const joinedDate  = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  return (
    <div className="profile-page">

      {/* PAGE HEADER */}
      <div className="profile-page-header">
        <div>
          <h2>My Profile</h2>
          <p>View your account details and manage security settings</p>
        </div>
      </div>

      <div className="profile-grid">

        {/* ── LEFT: PROFILE CARD ── */}
        <div className="profile-left">

          {/* AVATAR CARD */}
          <div className="pcard avatar-card">
            <div className="avatar-glow" />
            <div className="big-avatar">{userInitial}</div>
            <div className="avatar-online-dot" />
            <h3 className="pcard-name">{user?.name || "Administrator"}</h3>
            <p className="pcard-email">{user?.email}</p>
            <span className="pcard-role-badge">
              <i className="fas fa-shield-alt" />
              {user?.role?.toUpperCase() || "ADMIN"}
            </span>
          </div>

          {/* INFO CARD */}
          <div className="pcard info-card">
            <p className="pcard-section-label">Account Details</p>
            <div className="info-rows">
              <div className="info-row">
                <span className="info-icon"><i className="fas fa-building" /></span>
                <div>
                  <p className="info-label">Department</p>
                  <p className="info-value">CSA Department</p>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon"><i className="fas fa-user-tag" /></span>
                <div>
                  <p className="info-label">Role</p>
                  <p className="info-value">{isSuperAdmin ? "Super Administrator" : "Administrator"}</p>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon"><i className="fas fa-calendar-alt" /></span>
                <div>
                  <p className="info-label">Member Since</p>
                  <p className="info-value">{joinedDate}</p>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon online-icon"><i className="fas fa-circle" /></span>
                <div>
                  <p className="info-label">Status</p>
                  <p className="info-value online-text">● Active &amp; Online</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT: SECURITY CARD ── */}
        <div className="pcard security-card">
          <div className="security-card-header">
            <div className="security-icon-wrap">
              <i className="fas fa-lock" />
            </div>
            <div>
              <h3>Change Password</h3>
              <p>Keep your account secure with a strong password</p>
            </div>
          </div>

          <div className="security-divider" />

          <form onSubmit={handlePasswordChange} className="security-form">

            {/* CURRENT PASSWORD */}
            <div className="field-group">
              <label>Current Password</label>
              <div className="field-wrap">
                <i className="fas fa-key field-prefix-icon" />
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShowCurrent(!showCurrent)}>
                  <i className={`fas ${showCurrent ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="field-group">
              <label>New Password</label>
              <div className="field-wrap">
                <i className="fas fa-lock field-prefix-icon" />
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShowNew(!showNew)}>
                  <i className={`fas ${showNew ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
              {/* STRENGTH METER */}
              {passwords.newPassword && (
                <div className="strength-meter">
                  <div className="strength-bars">
                    {[1,2,3,4].map((n) => (
                      <div
                        key={n}
                        className="strength-bar"
                        style={{
                          background: n <= pwdStrength
                            ? strengthColor[pwdStrength]
                            : "var(--border2)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColor[pwdStrength] }}>
                    {strengthLabel[pwdStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="field-group">
              <label>Confirm New Password</label>
              <div className="field-wrap">
                <i className="fas fa-check-double field-prefix-icon" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  <i className={`fas ${showConfirm ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
              {/* MATCH INDICATOR */}
              {passwords.confirmPassword && (
                <p className={`match-hint ${passwords.newPassword === passwords.confirmPassword ? "match" : "no-match"}`}>
                  <i className={`fas ${passwords.newPassword === passwords.confirmPassword ? "fa-check-circle" : "fa-times-circle"}`} />
                  {passwords.newPassword === passwords.confirmPassword ? "Passwords match" : "Passwords do not match"}
                </p>
              )}
            </div>

            {/* TIPS */}
            <div className="password-tips">
              <p className="tips-label"><i className="fas fa-info-circle" /> Password requirements</p>
              <ul>
                <li className={passwords.newPassword.length >= 8 ? "met" : ""}>
                  <i className="fas fa-check" /> At least 8 characters
                </li>
                <li className={/[A-Z]/.test(passwords.newPassword) ? "met" : ""}>
                  <i className="fas fa-check" /> One uppercase letter
                </li>
                <li className={/[0-9]/.test(passwords.newPassword) ? "met" : ""}>
                  <i className="fas fa-check" /> One number
                </li>
                <li className={/[^A-Za-z0-9]/.test(passwords.newPassword) ? "met" : ""}>
                  <i className="fas fa-check" /> One special character
                </li>
              </ul>
            </div>

            <button type="submit" className="update-btn" disabled={loading}>
              {loading
                ? <><i className="fas fa-spinner fa-spin" /> Updating…</>
                : <><i className="fas fa-shield-alt" /> Update Password</>}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}