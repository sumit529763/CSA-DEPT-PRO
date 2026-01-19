// src/components/Footer/Footer.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-layout">
        <div className="footer-column">
          <h3 className="footer-heading">About GIET</h3>
          <p className="footer-text">
            GIET University, Gunupur is a premier institute offering diverse
            undergraduate and postgraduate programmes with a focus on quality
            education and research.
          </p>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">About CSA</h3>
          <p className="footer-text">
            The CSA Department aims to build competent professionals with strong
            foundations in computer science, practical skills, and ethical
            values.
          </p>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Alumni &amp; Academic</h3>
          <ul className="footer-links">
            <li>
              <NavLink to="/alumni">Alumni</NavLink>
            </li>
            {/* If academic-calendar is a separate page */}
            <li>
              <NavLink to="/calendar">Academic Calendar</NavLink>
            </li>
            <li>
              <NavLink to="/placements">Placement Cell</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact Us</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="footer-contact">
            <li>Department of Computer Science &amp; Application (CSA)</li>
            <li>GIET University, Gunupur - 765022</li>
            <li>Email: csa@giet.edu</li>
            <li>Phone: +91-XXXXXXXXXX</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} CSA Department, GIET University. All rights reserved.</p>
      </div>
    </footer>
  );
}
