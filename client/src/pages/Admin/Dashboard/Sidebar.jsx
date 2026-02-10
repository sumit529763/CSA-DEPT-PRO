import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import "../Styles/Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  // This function fixes the auto-close issue for the profile card
  const handleProfileClick = () => {
    navigate("/admin/profile");
    if (window.innerWidth <= 992) {
      onClose();
    }
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      {/* PROFESSIONAL CLOSE BUTTON - Mobile Only */}
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close Sidebar">
        <i className="fas fa-times"></i>
      </button>

      <div className="sidebar-header">
        <div className="header-brand">
          <div className="brand-icon">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="brand-text">
            <h3>CSA ADMIN</h3>
            <Link to="/" className="view-site-link">
              <i className="fas fa-globe"></i> View Website
            </Link>
          </div>
        </div>
      </div>

      {/* FIXED: Added handleProfileClick to auto-close on mobile */}
      <div className="sidebar-profile-card" onClick={handleProfileClick}>
        <div className="profile-avatar">{userInitial}</div>
        <div className="profile-details">
          <span className="profile-name">{user?.name || "Administrator"}</span>
          <span className="profile-status">Online</span>
        </div>
        <i className="fas fa-chevron-right profile-arrow"></i>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" onClick={onClose} end>
          <i className="fas fa-th-large"></i> Dashboard
        </NavLink>
        <NavLink to="/admin/manage/news" onClick={onClose}>
          <i className="fas fa-newspaper"></i> Manage News
        </NavLink>
        <NavLink to="/admin/manage/events" onClick={onClose}>
          <i className="fas fa-calendar-alt"></i> Manage Events
        </NavLink>
        <NavLink to="/admin/manage/gallery" onClick={onClose}>
          <i className="fas fa-images"></i> Manage Gallery
        </NavLink>

        {isSuperAdmin && (
          <div className="super-admin-group">
            <div className="sidebar-divider">System Control</div>
            <NavLink to="/admin/super/users" onClick={onClose}>
              <i className="fas fa-users-cog"></i> Manage Users
            </NavLink>
            <NavLink to="/admin/super/audit" onClick={onClose}>
              <i className="fas fa-history"></i> Audit Logs
            </NavLink>
          </div>
        )}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>
    </aside>
  );
}