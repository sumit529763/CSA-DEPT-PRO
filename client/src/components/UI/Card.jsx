import React from "react";
import "./Card.css";

export default function Card({ title, children, className = "" }) {
  return (
    <div className={`card-base ${className}`}>
      {title && <h4 className="card-title">{title}</h4>}
      {children}
    </div>
  );
}