// src/pages/Admin/Management/ManageGallery.jsx
import React, { useState } from "react";
import "../Styles/Management.css";

export default function ManageGallery() {
  // Mock data - eventually fetched from your MongoDB via services
  const [images, setImages] = useState([
    { id: 1, url: "/assets/images/csadept.jpeg", caption: "Main Building" },
    { id: 2, url: "/assets/images/csa-giet2.jpeg", caption: "Computer Lab" },
  ]);

  return (
    <div className="management-view">
      <div className="management-header">
        <div className="header-text">
          <h2>Manage Gallery</h2>
          <p>Upload and organize photos of department events and infrastructure.</p>
        </div>
        <button className="btn-add">
          <i className="fas fa-upload"></i> Upload Photo
        </button>
      </div>

      <div className="gallery-admin-grid">
        {images.map((img) => (
          <div className="gallery-admin-card" key={img.id}>
            <div className="gallery-img-wrapper">
              <img src={img.url} alt={img.caption} />
              <div className="img-actions">
                <button className="btn-delete-overlay" title="Delete">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div className="gallery-info">
              <p>{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}