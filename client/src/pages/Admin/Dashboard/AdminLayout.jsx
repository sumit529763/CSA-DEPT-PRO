import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="adminShell">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />

      <div className="mainArea">
        <header className="mobileNav">
          <button className="hamburger" onClick={() => setOpen(true)}>
            <i className="fas fa-bars"></i>
          </button>
          <span className="mobileNav-title">CSA ADMIN</span>
        </header>

        <div className="contentArea">
          <Outlet />
        </div>
      </div>
    </div>
  );
}