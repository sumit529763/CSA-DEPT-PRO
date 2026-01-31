// src/components/UI/SectionTitle.jsx
import React from "react";
import "./SectionTitle.css"; // <-- Import CSS

export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title-wrapper">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
