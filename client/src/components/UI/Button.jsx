// Button.jsx
// src/components/UI/Button.jsx
import React from "react";
import { NavLink } from "react-router-dom"; // <-- Import NavLink

export default function Button({ children, onClick, to, className = "" }) {
  if (to) {
    return <NavLink className={`btn ${className}`} to={to}>{children}</NavLink>;
  }
  
  return <button className={`btn ${className}`} onClick={onClick}>{children}</button>;
}