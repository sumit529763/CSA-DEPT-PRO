// src/pages/Admin/Dashboard/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../Styles/AdminLayout.css";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="admin-layout">
      {/* 1. The Mobile Overlay (Darkens the background when sidebar is open) */}
      {isSidebarOpen && (
        <div className="admin-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* 2. Sidebar - Passing the toggle state */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="admin-main-wrapper">
        {/* 3. Mobile Header - Only visible on small screens */}
        <header className="admin-mobile-nav">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <span className="mobile-logo">CSA ADMIN</span>
        </header>

        {/* 4. This is where Dashboard, Manage News, etc. will render */}
        <div className="admin-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}