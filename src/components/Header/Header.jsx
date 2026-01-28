import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
// Note: We are commenting out the Auth import, but it is ready for integration later
// import { useAuth } from "../../context/AuthContext.jsx";
import "./Header.css";

// AnnouncementBar is implemented inside the same file
function AnnouncementBar() {
  const text = `Welcome to the Department of Computer Science & Application, GIET University, Gunupur (765022) | BCA & MCA programmes as per GIET University regulations | Stay tuned for updates on exams, events, workshops, and placement activities.`;
  return (
    <section className="announcement-bar" aria-label="Announcements">
      <div className="container announcement-inner">
        <div className="announcement-label">
          <i className="fas fa-bullhorn" aria-hidden /> Announcements
        </div>
        <div className="announcement-track">
          <p className="announcement-text">
            {text} &nbsp; | &nbsp; {text}
          </p>
        </div>
      </div>
    </section>
  );
}

const navLinks = [
  // Centralized link data
  { to: "/", label: "Home", end: true },
  { to: "/news", label: "News" },
  { to: "/notices", label: "Notices" },
  { to: "/faculty", label: "Faculty" },
  { to: "/exam", label: "Exam" },
  { to: "/events", label: "Events" },
  { to: "/placements", label: "Placements" },
  { to: "/alumni", label: "Alumni" },
];

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile state

  // Refs for A11y focus control
  const menuRef = useRef(null);
  const toggleRef = useRef(null); // Ref for the Hamburger button

  // 1. A11y: Handles ESC key to close menu
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. A11y Fix: Focus Management Hook (Resolves "Blocked aria-hidden" warning)
  useEffect(() => {
    if (!isMobileMenuOpen) {
      // When closing, explicitly move focus back to the button.
      toggleRef.current?.focus();
    } else {
      // When opening, focus the first link for keyboard users.
      menuRef.current?.querySelector(".mobile-link")?.focus();
    }
  }, [isMobileMenuOpen]);

  // Helper to close menu after clicking a link
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="top-bar">
        <div className="container top-inner right">
          {/* Brand section (remains the same) */}
          <div className="brand">
            <div className="brand-logo" aria-hidden />
            <div className="brand-text">
              <span className="brand-title desktop-only">
                Department of Computer Science &amp; Application
              </span>
              <span className="brand-title mobile-only">CSA Department</span>
              <span className="brand-subtitle">
                <p>Gandhi Institute Of Engineering And Technology University</p>
                <p> Odisha, Gunupur-765022</p>
              </span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION (Visible on large screens) */}
          <nav className="navbar desktop-nav" aria-label="Primary navigation">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {/* Admin icon (ready for Auth integration) */}
            <NavLink
              to="/login"
              className="admin-icon"
              title="Admin Login"
              aria-label="Admin Login"
            >
              <i className="fas fa-user-circle" aria-hidden />
            </NavLink>

            {/* MOBILE HAMBURGER TOGGLE (Visible on small screens) */}
            <button
              ref={toggleRef} // <--- Ref is attached here for focus management
              className="hamburger-toggle"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              <span /> {/* CSS will style these spans as lines */}
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnnouncementBar />

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`mobile-menu ${isMobileMenuOpen ? "show" : ""}`}
        id="mobile-menu"
        aria-hidden={!isMobileMenuOpen}
        ref={menuRef} // <--- Ref is attached here for focus management
      >
        <div className="mobile-menu-header">
          <span className="mobile-menu-brand">CSA Department</span>
          <button
            className="mobile-close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <nav className="mobile-nav-list">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive ? "mobile-link active" : "mobile-link"
              }
              onClick={closeMenu} // Close menu when a link is clicked
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            className="mobile-link admin-mobile-link"
            onClick={closeMenu}
          >
            Admin Login
          </NavLink>
        </nav>
      </div>

      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
