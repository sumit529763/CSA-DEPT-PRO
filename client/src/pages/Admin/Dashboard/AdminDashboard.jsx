import React from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./AdminDashboard.css";

export default function AdminDashboard() {

  const { user, isSuperAdmin } = useAuth();

  const stats = [
    { label: "Total News", count: 14, icon: "fa-newspaper" },
    { label: "Active Events", count: 6, icon: "fa-calendar-check" },
    { label: "Gallery Images", count: 24, icon: "fa-images" },
  ];

  return (
    <div className="dashboardPage">

      <div className="dashboardTop">
        <h2>Welcome, {user?.name || "Admin"}</h2>
        <p>Manage CSA Department Digital System</p>
      </div>

      {/* STATS */}

      <div className="statsGrid">
        {stats.map((s, i) => (
          <div className="statCard" key={i}>
            <i className={`fas ${s.icon}`}></i>
            <h3>{s.count}</h3>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* SUPER ADMIN */}

      {isSuperAdmin && (
        <div className="systemPanel">
          <h3>System Controls</h3>

          <div className="panelGrid">
            <div className="panelCard">
              <i className="fas fa-user-plus"></i>
              <span>Create Admin</span>
            </div>
            <div className="panelCard">
              <i className="fas fa-shield-alt"></i>
              <span>View Logs</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
