import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import "../Styles/Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/auth/update-password",
        { 
          currentPassword: passwords.currentPassword, 
          newPassword: passwords.newPassword 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Security settings updated!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Account Settings</h1>
        <p>Manage your identity and security across the platform</p>
      </div>

      <div className="profile-content-grid">
        {/* Profile Card */}
        <div className="profile-glass-card user-info-card">
          <div className="profile-avatar-wrapper">
            <div className="avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <span className="role-tag">{user?.role?.toUpperCase()}</span>
          </div>
          
          <div className="user-details-list">
            <div className="detail-row">
              <label>Full Name</label>
              <span>{user?.name || "Administrator"}</span>
            </div>
            <div className="detail-row">
              <label>Email Address</label>
              <span>{user?.email}</span>
            </div>
            <div className="detail-row">
              <label>Department</label>
              <span>CSA Department</span>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="profile-glass-card security-card">
          <div className="card-heading">
            <i className="fas fa-shield-alt"></i>
            <h3>Login & Security</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="security-form">
            <div className="form-input-group">
              <label>Current Password</label>
              <input 
                type="password" 
                placeholder="Enter current password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                required 
              />
            </div>

            <div className="form-dual-row">
              <div className="form-input-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="At least 6 characters"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  required 
                />
              </div>
              <div className="form-input-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Repeat new password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="save-changes-btn" disabled={loading}>
              {loading ? "Saving..." : "Update Security"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}