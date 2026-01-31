// src/components/UI/Card.jsx
import React from "react";
import "./Card.css"; // <-- Import CSS

export default function Card({ title, body, children }) {
  return (
    <div className="card-base"> {/* <-- Use CSS class */}
      <h4 className="card-title">{title}</h4>
      {/* Note: It is better to use the <h4> tag just for the title 
          and render the main 'body' text as a child for maximum flexibility. */}
      {children}
    </div>
  );
}