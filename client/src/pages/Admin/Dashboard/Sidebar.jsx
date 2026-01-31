import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import "../Styles/Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isSuperAdmin } = useAuth();

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      {/* Mobile close button */}
      <button className="sidebar-close" onClick={onClose}>
        ✕
      </button>

      <div className="sidebar-header">
        <h3>Admin Panel</h3>
        <p>{user?.role?.toUpperCase()}</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" onClick={onClose}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/manage/news" onClick={onClose}>
          Manage News
        </NavLink>
        <NavLink to="/admin/manage/events" onClick={onClose}>
          Manage Events
        </NavLink>
        <NavLink to="/admin/manage/gallery" onClick={onClose}>
          Manage Gallery
        </NavLink>

        {isSuperAdmin && (
          <>
            <div className="sidebar-divider">Super Admin</div>
            {/* MUST match path="super/users" in App.jsx */}
            <NavLink to="/admin/super/users" onClick={onClose}>
              Manage Users
            </NavLink>
            {/* MUST match path="super/audit" in App.jsx */}
            <NavLink to="/admin/super/audit" onClick={onClose}>
              Audit Logs
            </NavLink>
          </>
        )}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
