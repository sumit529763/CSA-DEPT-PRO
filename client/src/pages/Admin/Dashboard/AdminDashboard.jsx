// src/pages/Admin/Dashboard/AdminDashboard.jsx
import React from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import "../Styles/Dashboard.css";

export default function AdminDashboard() {
  const { user, isSuperAdmin } = useAuth();

  // This data will eventually come from your MongoDB backend
  const stats = [
    { label: "Total News", count: 14, icon: "fa-newspaper", color: "#004aad" },
    { label: "Active Events", count: 6, icon: "fa-calendar-check", color: "#00bcd4" },
    { label: "Gallery Images", count: 24, icon: "fa-images", color: "#f39c12" },
  ];

  return (
    <div className="admin-dashboard-view">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name || "Admin"}</h2>
        <p>Manage the CSA Department digital presence from here.</p>
      </div>

      {/* 📊 Statistics Grid */}
      <div className="stats-container">
        {stats.map((item, index) => (
          <div className="admin-stat-card" key={index}>
            <div className="stat-info">
              <span className="stat-count">{item.count}</span>
              <span className="stat-label">{item.label}</span>
            </div>
            <div className="stat-icon-box" style={{ backgroundColor: item.color }}>
              <i className={`fas ${item.icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      {/* 🛡️ Super Admin Quick Actions */}
      {isSuperAdmin && (
        <div className="super-admin-section">
          <h3 className="admin-subheading">System Control Panel</h3>
          <div className="action-grid">
            <div className="action-card">
              <i className="fas fa-user-plus"></i>
              <span>Create New Admin</span>
            </div>
            <div className="action-card">
              <i className="fas fa-shield-alt"></i>
              <span>View Security Logs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}