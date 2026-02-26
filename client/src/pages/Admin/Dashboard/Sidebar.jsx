import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {

  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "A";

  const handleProfileClick = () => {
    navigate("/admin/profile");
    if (window.innerWidth <= 900) onClose();
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>

      {/* BRAND */}
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

      {/* PROFILE */}
      <div className="sidebar-profile-card" onClick={handleProfileClick}>
        <div className="profile-avatar">{userInitial}</div>
        <div className="profile-details">
          <span className="profile-name">
            {user?.name || "Administrator"}
          </span>
          <span className="profile-status">Online</span>
        </div>
        <i className="fas fa-chevron-right"></i>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        <div className="nav-group">

          <NavLink to="/admin/dashboard" onClick={onClose} end>
            <i className="fas fa-th-large"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/manage/news" onClick={onClose}>
            <i className="fas fa-newspaper"></i>
            <span>Manage News</span>
          </NavLink>

          <NavLink to="/admin/manage/events" onClick={onClose}>
            <i className="fas fa-calendar-alt"></i>
            <span>Manage Events</span>
          </NavLink>

          <NavLink to="/admin/manage/gallery" onClick={onClose}>
            <i className="fas fa-images"></i>
            <span>Manage Gallery</span>
          </NavLink>

        </div>

        {isSuperAdmin && (
          <>
            <div className="sidebar-divider">
              System Control
            </div>

            <div className="nav-group">

              <NavLink to="/admin/super/users" onClick={onClose}>
                <i className="fas fa-users-cog"></i>
                <span>Manage Users</span>
              </NavLink>

              <NavLink to="/admin/super/audit" onClick={onClose}>
                <i className="fas fa-history"></i>
                <span>Audit Logs</span>
              </NavLink>

            </div>
          </>
        )}

      </nav>

      {/* LOGOUT */}
      <button className="sidebar-logout" onClick={logout}>
        <i className="fas fa-sign-out-alt"></i>
        Logout
      </button>

    </aside>
  );
}
