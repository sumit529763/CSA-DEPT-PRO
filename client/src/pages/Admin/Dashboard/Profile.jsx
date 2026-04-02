import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "./Profile.css";

const API = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token");

export default function Profile() {
  const { user, isSuperAdmin, updateUser } = useAuth();

  const [profileData, setProfileData]     = useState({ name: "", designation: "", bio: "" });
  const [photoFile, setPhotoFile]         = useState(null);
  const [photoPreview, setPhotoPreview]   = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [freshUser, setFreshUser]         = useState(null);
  const fileRef = useRef();

  const [passwords, setPasswords] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading]   = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const u = res.data.data;
        setFreshUser(u);
        setProfileData({ name: u.name || "", designation: u.designation || "", bio: u.bio || "" });
        setPhotoPreview(u.photo || "");
      } catch {
        setProfileData({ name: user?.name || "", designation: user?.designation || "", bio: user?.bio || "" });
        setPhotoPreview(user?.photo || "");
      }
    };
    fetchMe();
  }, []);

  const activeUser  = freshUser || user;
  const userInitial = activeUser?.name?.charAt(0).toUpperCase() || "A";

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
  const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981", "#2563eb"];
  const pwdStrength   = strength(passwords.newPassword);

  const handlePhotoPick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) return toast.error("Name is required");
    try {
      setProfileLoading(true);
      const data = new FormData();
      data.append("name",        profileData.name);
      data.append("designation", profileData.designation);
      data.append("bio",         profileData.bio);
      if (photoFile) data.append("photo", photoFile);

      const res = await axios.put(`${API}/api/auth/update-profile`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const updated = res.data.data;
      setFreshUser(updated);
      setPhotoFile(null);
      updateUser({
        id: updated._id, name: updated.name, email: updated.email,
        role: updated.role, photo: updated.photo,
        designation: updated.designation,
        lastLogin: updated.lastLogin, createdAt: updated.createdAt,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error("Passwords do not match!");
    if (pwdStrength < 2) return toast.error("Password is too weak!");
    try {
      setPwdLoading(true);
      await axios.put(
        `${API}/api/auth/update-password`,
        { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      toast.success("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const formatDateTime = (d) => d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      })
    : "Never";

  return (
    <div className="profile-page">

      {/* ── HEADER ── */}
      <div className="profile-page-header">
        <h2>My Profile</h2>
        <p>Manage your account details, photo and security settings</p>
      </div>

      <div className="profile-grid">

        {/* ══ LEFT COLUMN ══ */}
        <div className="profile-left">

          {/* AVATAR CARD */}
          <div className="pcard avatar-card">
            <div className="avatar-banner" />

            <div className="avatar-body">
              <div
                className="big-avatar-wrap"
                onClick={() => fileRef.current.click()}
                title="Click to change photo"
              >
                {photoPreview
                  ? <img src={photoPreview} alt="profile" className="big-avatar-img" />
                  : <div className="big-avatar">{userInitial}</div>
                }
                <div className="avatar-edit-overlay">
                  <i className="fas fa-camera" />
                  <span>Change</span>
                </div>
                <div className="avatar-online-dot" />
              </div>

              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoPick} hidden />

              <h3 className="pcard-name">{activeUser?.name || "Administrator"}</h3>
              <p className="pcard-email">{activeUser?.email}</p>
              <span className={`pcard-role-badge ${isSuperAdmin ? "superadmin" : ""}`}>
                <i className={`fas ${isSuperAdmin ? "fa-crown" : "fa-shield-alt"}`} />
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </span>

              {photoFile && (
                <button className="photo-save-hint" onClick={handleProfileSubmit} disabled={profileLoading}>
                  <i className="fas fa-cloud-upload-alt" />
                  {profileLoading ? "Uploading..." : "Save new photo"}
                </button>
              )}
            </div>
          </div>

          {/* ACCOUNT INFO CARD */}
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
                  <p className="info-value">{formatDate(activeUser?.createdAt)}</p>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon"><i className="fas fa-clock" /></span>
                <div>
                  <p className="info-label">Last Login</p>
                  <p className="info-value">{formatDateTime(activeUser?.lastLogin)}</p>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon online-icon"><i className="fas fa-circle" /></span>
                <div>
                  <p className="info-label">Status</p>
                  <p className="info-value online-text">Active &amp; Online</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className="profile-right">

          {/* EDIT PROFILE CARD */}
          <div className="pcard security-card">
            <div className="security-card-header">
              <div className="security-icon-wrap">
                <i className="fas fa-user-edit" />
              </div>
              <div>
                <h3>Edit Profile</h3>
                <p>Update your name, designation and bio</p>
              </div>
            </div>
            <div className="security-divider" />

            <form onSubmit={handleProfileSubmit} className="security-form">
              <div className="field-group">
                <label>Full Name <span style={{ color: "#ef4444" }}>*</span></label>
                <div className="field-wrap">
                  <i className="fas fa-user field-prefix-icon" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Designation</label>
                <div className="field-wrap">
                  <i className="fas fa-briefcase field-prefix-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Assistant Professor"
                    value={profileData.designation}
                    onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Bio</label>
                <textarea
                  className="profile-textarea"
                  placeholder="Write a short bio about yourself..."
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              </div>

              <button type="submit" className="update-btn" disabled={profileLoading}>
                {profileLoading
                  ? <><i className="fas fa-spinner fa-spin" /> Saving Changes…</>
                  : <><i className="fas fa-save" /> Save Changes</>}
              </button>
            </form>
          </div>

          {/* CHANGE PASSWORD CARD */}
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
                {passwords.newPassword && (
                  <div className="strength-meter">
                    <div className="strength-bars">
                      {[1,2,3,4].map((n) => (
                        <div
                          key={n}
                          className="strength-bar"
                          style={{ background: n <= pwdStrength ? strengthColor[pwdStrength] : "#e2e8f0" }}
                        />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: strengthColor[pwdStrength] }}>
                      {strengthLabel[pwdStrength]}
                    </span>
                  </div>
                )}
              </div>

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
                {passwords.confirmPassword && (
                  <p className={`match-hint ${passwords.newPassword === passwords.confirmPassword ? "match" : "no-match"}`}>
                    <i className={`fas ${passwords.newPassword === passwords.confirmPassword ? "fa-check-circle" : "fa-times-circle"}`} />
                    {passwords.newPassword === passwords.confirmPassword ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>

              <div className="password-tips">
                <p className="tips-label"><i className="fas fa-shield-alt" /> Password requirements</p>
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

              <button type="submit" className="update-btn" disabled={pwdLoading}>
                {pwdLoading
                  ? <><i className="fas fa-spinner fa-spin" /> Updating Password…</>
                  : <><i className="fas fa-shield-alt" /> Update Password</>}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}