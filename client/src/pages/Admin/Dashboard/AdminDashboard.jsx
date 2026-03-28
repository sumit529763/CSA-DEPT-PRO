import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    news: 0,
    events: 0,
    gallery: 0,
    notices: 0,
    exam: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const base = import.meta.env.VITE_API_BASE_URL;

    // Fetch all counts in parallel — gracefully handles any individual failure
    Promise.allSettled([
      axios.get(`${base}/api/news`),
      axios.get(`${base}/api/events`),
      axios.get(`${base}/api/gallery`),
      axios.get(`${base}/api/notices/admin/all`, { headers }),
      axios.get(`${base}/api/exam/admin/all`, { headers }),
    ]).then(([news, events, gallery, notices, exam]) => {
      setCounts({
        news:    news.status    === "fulfilled" ? (news.value.data.count    ?? 0) : 0,
        events:  events.status  === "fulfilled" ? (events.value.data.count  ?? 0) : 0,
        gallery: gallery.status === "fulfilled" ? (gallery.value.data.count ?? 0) : 0,
        notices: notices.status === "fulfilled" ? (notices.value.data.count ?? 0) : 0,
        exam:    exam.status    === "fulfilled" ? (exam.value.data.count    ?? 0) : 0,
      });
    });
  }, []);

  const stats = [
    { label: "Total News",      count: counts.news,    icon: "fa-newspaper",       path: "/admin/manage/news",    color: "#3b82f6" },
    { label: "Active Events",   count: counts.events,  icon: "fa-calendar-check",  path: "/admin/manage/events",  color: "#8b5cf6" },
    { label: "Gallery Images",  count: counts.gallery, icon: "fa-images",          path: "/admin/manage/gallery", color: "#06b6d4" },
    { label: "Notices",         count: counts.notices, icon: "fa-bell",            path: "/admin/manage/notices", color: "#f59e0b" },
    { label: "Exam Entries",    count: counts.exam,    icon: "fa-graduation-cap",  path: "/admin/manage/exam",    color: "#10b981" },
  ];

  const quickActions = [
    { label: "Add News",    icon: "fa-plus-circle",    path: "/admin/manage/news",    color: "#3b82f6" },
    { label: "Add Notice",  icon: "fa-bell",           path: "/admin/manage/notices", color: "#f59e0b" },
    { label: "Add Exam",    icon: "fa-graduation-cap", path: "/admin/manage/exam",    color: "#10b981" },
    { label: "Add Event",   icon: "fa-calendar-plus",  path: "/admin/manage/events",  color: "#8b5cf6" },
    { label: "Gallery",     icon: "fa-images",         path: "/admin/manage/gallery", color: "#06b6d4" },
  ];

  return (
    <div className="dashboardPage">

      {/* WELCOME */}
      <div className="dashboardTop">
        <h2>Welcome back, {user?.name || "Admin"} 👋</h2>
        <p>Here's a quick overview of the CSA Department portal</p>
      </div>

      {/* STATS GRID */}
      <div className="statsGrid">
        {stats.map((s, i) => (
          <div
            className="statCard"
            key={i}
            onClick={() => navigate(s.path)}
            style={{ cursor: "pointer" }}
          >
            <div className="statIconWrap" style={{ background: s.color + "18" }}>
              <i className={`fas ${s.icon}`} style={{ color: s.color }}></i>
            </div>
            <h3>{s.count}</h3>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="quickActions">
        <h3>Quick Actions</h3>
        <div className="qaGrid">
          {quickActions.map((a, i) => (
            <div
              key={i}
              className="qaCard"
              onClick={() => navigate(a.path)}
            >
              <div className="qaIcon" style={{ background: a.color + "18" }}>
                <i className={`fas ${a.icon}`} style={{ color: a.color }}></i>
              </div>
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SUPER ADMIN PANEL */}
      {isSuperAdmin && (
        <div className="systemPanel">
          <h3>System Controls</h3>
          <div className="panelGrid">
            <div className="panelCard" onClick={() => navigate("/admin/super/users")}>
              <i className="fas fa-user-plus"></i>
              <span>Manage Admins</span>
            </div>
            <div className="panelCard" onClick={() => navigate("/admin/super/audit")}>
              <i className="fas fa-shield-alt"></i>
              <span>View Audit Logs</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}