import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close when clicking outside (for overlay)
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

  // When menu opens, focus the first link
  useEffect(() => {
    if (open) {
      const firstLink = menuRef.current?.querySelector("a");
      firstLink?.focus();
    } else {
      // return focus to toggle
      toggleRef.current?.focus();
    }
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
  ];

  return (
    <>
      <nav className="navbar-below" aria-label="Primary">
        <div className="container nav-inner">
          {/* Hamburger / Toggle (visible on mobile) */}
          <button
            ref={toggleRef}
            className={`nav-toggle ${open ? "open" : ""}`}
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(o => !o)}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          {/* Desktop nav (visible on wider screens) */}
          <ul className="nav-list desktop-nav" role="menubar">
            {links.map((l) => (
              <li key={l.to} role="none">
                <NavLink to={l.to} end={l.end} className={({isActive}) => isActive ? "active" : ""} role="menuitem">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA or placeholder to keep layout (optional) */}
          <div className="nav-cta desktop-only">
            <a className="btn" href="/notices">Notices</a>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div className={`mobile-menu-overlay ${open ? "show" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu" id="primary-navigation" ref={menuRef}>
          <div className="mobile-menu-top">
            <div className="mobile-brand">
              <strong>BCA Dept</strong>
            </div>
            <button
              className="nav-close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <ul className="mobile-nav-list">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({isActive}) => (isActive ? "active" : "")}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mobile-menu-footer">
            <a className="btn" href="/login">Admin Login</a>
          </div>
        </div>
      </div>
    </>
  );
}
