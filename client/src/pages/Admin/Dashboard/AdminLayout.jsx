import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminLayout.css";

export default function AdminLayout() {

  const [open, setOpen] = useState(false);

  return (
    <div className="adminShell">

      {open && <div className="overlay" onClick={()=>setOpen(false)}></div>}

      <Sidebar isOpen={open} onClose={()=>setOpen(false)} />

      <div className="mainArea">

        <header className="mobileNav">
          <button onClick={()=>setOpen(true)}>
            <i className="fas fa-bars"></i>
          </button>
          CSA ADMIN
        </header>

        <div className="contentArea">
          <Outlet />
        </div>

      </div>

    </div>
  );
}
