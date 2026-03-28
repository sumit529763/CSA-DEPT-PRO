import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  const handleProfileClick = () => {
    navigate("/admin/profile");
    if (window.innerWidth <= 900) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>

        {/* BRAND */}
        <div className="sidebar-header">
          <div className="brand-icon">
            <i className="fas fa-user-shield" />
          </div>
          <div className="brand-text">
            <h3>CSA ADMIN</h3>
            <Link to="/" className="view-site-link">
              <i className="fas fa-globe" /> View Website
            </Link>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="sidebar-profile-card" onClick={handleProfileClick}>
          <div className="profile-avatar">
            <span>{userInitial}</span>
            <div className="avatar-online" />
          </div>
          <div className="profile-details">
            <span className="profile-name">{user?.name || "Administrator"}</span>
            <span className="profile-role">
              <i className="fas fa-shield-alt" />
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
          </div>
          <div className="profile-arrow-wrap">
            <i className="fas fa-chevron-right" />
          </div>
        </div>

        {/* NAV */}
        <nav className="sidebar-nav">

          <p className="sidebar-divider">Overview</p>
          <NavLink to="/admin/dashboard" onClick={onClose} end>
            <span className="nav-icon"><i className="fas fa-th-large" /></span>
            <span>Dashboard</span>
          </NavLink>

          <p className="sidebar-divider">Content</p>
          <NavLink to="/admin/manage/news" onClick={onClose}>
            <span className="nav-icon"><i className="fas fa-newspaper" /></span>
            <span>Manage News</span>
          </NavLink>
          <NavLink to="/admin/manage/events" onClick={onClose}>
            <span className="nav-icon"><i className="fas fa-calendar-alt" /></span>
            <span>Manage Events</span>
          </NavLink>
          <NavLink to="/admin/manage/gallery" onClick={onClose}>
            <span className="nav-icon"><i className="fas fa-images" /></span>
            <span>Manage Gallery</span>
          </NavLink>
          <NavLink to="/admin/manage/notices" onClick={onClose}>
            <span className="nav-icon"><i className="fas fa-bell" /></span>
            <span>Manage Notices</span>
          </NavLink>
          <NavLink to="/admin/manage/exam" onClick={onClose}>
            <span className="nav-icon"><i className="fas fa-graduation-cap" /></span>
            <span>Manage Exam</span>
          </NavLink>

          {isSuperAdmin && (
            <>
              <p className="sidebar-divider">System Control</p>
              <NavLink to="/admin/super/users" onClick={onClose}>
                <span className="nav-icon"><i className="fas fa-users-cog" /></span>
                <span>Manage Users</span>
              </NavLink>
              <NavLink to="/admin/super/audit" onClick={onClose}>
                <span className="nav-icon"><i className="fas fa-history" /></span>
                <span>Audit Logs</span>
              </NavLink>
            </>
          )}

        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-info">
            <span className="footer-dot" />
            <span>System Online</span>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}