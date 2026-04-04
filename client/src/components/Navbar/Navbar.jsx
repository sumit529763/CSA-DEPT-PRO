import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"; 
import "./Navbar.css";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target) && !toggleRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/news", label: "News" },
    { to: "/notices", label: "Notices" },
    { to: "/faculty", label: "Faculty" },
    { to: "/exam", label: "Exam" },
    { to: "/events", label: "Events" },
    { to: "/placements", label: "Placements" },
    { to: "/alumni", label: "Alumni" },
    { to: "/achievements", label: "Achievements" },
  ];

  // Helper function to navigate to correct dashboard
  const goToDashboard = () => {
    if (user?.role === "superadmin") {
      navigate("/admin/super/users");
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <>
      <nav className="navbar-below" aria-label="Primary">
        <div className="container nav-inner">
          <button
            ref={toggleRef}
            className={`nav-toggle ${open ? "open" : ""}`}
            onClick={() => setOpen(o => !o)}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <ul className="nav-list desktop-nav" role="menubar">
            {links.map((l) => (
              <li key={l.to} role="none">
                <NavLink to={l.to} end={l.end} className={({isActive}) => isActive ? "active" : ""}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-cta desktop-only">
            {user ? (
              <button className="btn btn-dashboard" onClick={goToDashboard}>
                <i className="fas fa-user-shield"></i> Dashboard
              </button>
            ) : (
              <NavLink className="btn" to="/login">Admin Login</NavLink>
            )}
          </div>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${open ? "show" : ""}`}>
        <div className="mobile-menu" ref={menuRef}>
          <div className="mobile-menu-top">
            <div className="mobile-brand"><strong>BCA Dept</strong></div>
            <button className="nav-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <ul className="mobile-nav-list">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mobile-menu-footer">
            {user ? (
              <button 
                className="btn btn-dashboard-mobile" 
                onClick={() => { goToDashboard(); setOpen(false); }}
                style={{ width: '100%', border: 'none', background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '8px' }}
              >
                Go to Dashboard
              </button>
            ) : (
              <NavLink className="btn" to="/login" onClick={() => setOpen(false)} style={{ display: 'block', textAlign: 'center' }}>
                Admin Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
}