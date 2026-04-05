import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    news: 0, events: 0, gallery: 0, notices: 0, exam: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const base = import.meta.env.VITE_API_BASE_URL;

    Promise.allSettled([
      axios.get(`${base}/api/news`),
      axios.get(`${base}/api/events`),
      axios.get(`${base}/api/gallery`),
      axios.get(`${base}/api/notices/admin/all`, { headers }),
      axios.get(`${base}/api/exam/admin/all`,    { headers }),
    ]).then(([news, events, gallery, notices, exam]) => {
      setCounts({
        news:    news.status    === "fulfilled" ? (news.value.data.count    ?? news.value.data.data?.length    ?? 0) : 0,
        events:  events.status  === "fulfilled" ? (events.value.data.count  ?? events.value.data.data?.length  ?? 0) : 0,
        gallery: gallery.status === "fulfilled" ? (gallery.value.data.count ?? gallery.value.data.data?.length ?? 0) : 0,
        notices: notices.status === "fulfilled" ? (notices.value.data.count ?? notices.value.data.data?.length ?? 0) : 0,
        exam:    exam.status    === "fulfilled" ? (exam.value.data.count    ?? exam.value.data.data?.length    ?? 0) : 0,
      });
      setLoading(false);
    });
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    {
      label: "News Articles", count: counts.news,
      icon: "fa-newspaper", path: "/admin/manage/news",
      color: "#3b82f6", bg: "#eff6ff",
      desc: "Published articles",
    },
    {
      label: "Events", count: counts.events,
      icon: "fa-calendar-check", path: "/admin/manage/events",
      color: "#8b5cf6", bg: "#f5f3ff",
      desc: "Scheduled events",
    },
    {
      label: "Gallery", count: counts.gallery,
      icon: "fa-images", path: "/admin/manage/gallery",
      color: "#06b6d4", bg: "#ecfeff",
      desc: "Uploaded images",
    },
    {
      label: "Notices", count: counts.notices,
      icon: "fa-bell", path: "/admin/manage/notices",
      color: "#f59e0b", bg: "#fffbeb",
      desc: "Active notices",
    },
    {
      label: "Exam Resources", count: counts.exam,
      icon: "fa-graduation-cap", path: "/admin/manage/exam",
      color: "#10b981", bg: "#f0fdf4",
      desc: "Schedules & results",
    },
  ];

  const quickActions = [
    { label: "Post News",      icon: "fa-newspaper",      path: "/admin/manage/news",    color: "#3b82f6" },
    { label: "Add Notice",     icon: "fa-bell",           path: "/admin/manage/notices", color: "#f59e0b" },
    { label: "Upload Image",   icon: "fa-images",         path: "/admin/manage/gallery", color: "#06b6d4" },
    { label: "Add Event",      icon: "fa-calendar-plus",  path: "/admin/manage/events",  color: "#8b5cf6" },
    { label: "Exam Entry",     icon: "fa-graduation-cap", path: "/admin/manage/exam",    color: "#10b981" },
  ];

  const totalContent = counts.news + counts.events + counts.gallery + counts.notices + counts.exam;

  return (
    <div className="dashPage">

      {/* ── WELCOME BANNER ── */}
      <div className="dashBanner">
        <div className="dashBannerLeft">
          <p className="dashGreeting">{greeting},</p>
          <h2 className="dashName">{user?.name || "Administrator"} 👋</h2>
          <p className="dashSub">
            Here's what's happening with the CSA Department portal today.
          </p>
        </div>
        <div className="dashBannerRight">
          <div className="dashTotalBadge">
            <span className="dashTotalNum">{loading ? "—" : totalContent}</span>
            <span className="dashTotalLabel">Total Content Items</span>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="dashSection">
        <div className="dashSectionHeader">
          <h3 className="dashSectionTitle">
            <i className="fas fa-chart-bar" /> Content Overview
          </h3>
        </div>
        <div className="dashStatsGrid">
          {stats.map((s, i) => (
            <div
              key={i}
              className="dashStatCard"
              onClick={() => navigate(s.path)}
            >
              <div className="dashStatTop">
                <div className="dashStatIcon" style={{ background: s.bg, color: s.color }}>
                  <i className={`fas ${s.icon}`} />
                </div>
                <i className="fas fa-arrow-right dashStatArrow" />
              </div>
              <div className="dashStatNum" style={{ color: s.color }}>
                {loading
                  ? <span className="dashSkeleton" />
                  : s.count
                }
              </div>
              <div className="dashStatLabel">{s.label}</div>
              <div className="dashStatDesc">{s.desc}</div>
              <div className="dashStatBar">
                <div
                  className="dashStatBarFill"
                  style={{
                    width: loading ? "0%" : `${Math.min((s.count / Math.max(totalContent, 1)) * 100 * 2, 100)}%`,
                    background: s.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="dashSection">
        <div className="dashSectionHeader">
          <h3 className="dashSectionTitle">
            <i className="fas fa-bolt" /> Quick Actions
          </h3>
        </div>
        <div className="dashQAGrid">
          {quickActions.map((a, i) => (
            <button
              key={i}
              className="dashQABtn"
              onClick={() => navigate(a.path)}
              style={{ "--qa-color": a.color }}
            >
              <div className="dashQAIcon" style={{ background: a.color + "18", color: a.color }}>
                <i className={`fas ${a.icon}`} />
              </div>
              <span>{a.label}</span>
              <i className="fas fa-chevron-right dashQAArrow" />
            </button>
          ))}
        </div>
      </div>

      {/* ── SUPER ADMIN PANEL ── */}
      {isSuperAdmin && (
        <div className="dashSection">
          <div className="dashSectionHeader">
            <h3 className="dashSectionTitle">
              <i className="fas fa-crown" /> System Controls
            </h3>
            <span className="dashSuperBadge">Super Admin</span>
          </div>
          <div className="dashSystemGrid">
            <div
              className="dashSystemCard"
              onClick={() => navigate("/admin/super/users")}
            >
              <div className="dashSystemIcon blue">
                <i className="fas fa-users-cog" />
              </div>
              <div className="dashSystemInfo">
                <h4>Manage Admins</h4>
                <p>Create, edit and control admin accounts</p>
              </div>
              <i className="fas fa-chevron-right dashSystemArrow" />
            </div>
            <div
              className="dashSystemCard"
              onClick={() => navigate("/admin/super/audit")}
            >
              <div className="dashSystemIcon purple">
                <i className="fas fa-history" />
              </div>
              <div className="dashSystemInfo">
                <h4>Audit Logs</h4>
                <p>Track all admin activity and system events</p>
              </div>
              <i className="fas fa-chevron-right dashSystemArrow" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}